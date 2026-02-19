const geminiService = require('./geminiService');
const Order = require('../models/Order');
const Vendor = require('../models/Vendor');
const MenuItem = require('../models/MenuItem');
const PredictionLog = require('../models/PredictionLog');

class PredictionEngine {
  async predictReadyTime(orderData, vendorId) {
    const vendor = await Vendor.findById(vendorId);
    const menuItems = await MenuItem.find({
      _id: { $in: orderData.items.map(i => i.menuItem) },
    });

    const context = await this._buildContext(orderData, vendor, menuItems);
    
    // 1. Compute safety baseline
    const deterministic = this._deterministicPredict(context);

    // 2. Try Gemini AI
    let geminiResult = null;
    let finalEstimate; 
    let method;

    try {
      geminiResult = await geminiService.predictPrepTime(context);
    } catch (e) {
      console.warn('⚠️ Gemini fallback triggered:', e.message);
    }

    // 3. Robust check for AI results
    const aiMinutes = geminiResult?.estimatedMinutes || geminiResult?.estimated_prep_minutes;

    if (geminiResult && aiMinutes) {
      // Logic: Prioritize AI but blend with rules for safety
      const gw = (geminiResult.confidence || 0.5) * (vendor.metrics?.accuracyScore || 0.8);
      const dw = 1 - gw;
      
      finalEstimate = Math.round(aiMinutes * gw + deterministic.estimatedMinutes * dw);
      method = 'hybrid'; 
      console.log(`✅ Gemini Response Used: ${aiMinutes} mins`);
    } else {
      finalEstimate = deterministic.estimatedMinutes;
      method = 'deterministic';
      console.log("⚠️ Using Rule-based logic");
    }

    // 4. Final Sanity Bounds (2 - 45 mins)
    finalEstimate = Math.max(2, Math.min(45, finalEstimate));
    const predictedReadyTime = new Date(Date.now() + finalEstimate * 60000);

    return {
      estimatedMinutes: finalEstimate,
      predictedReadyTime,
      confidence: geminiResult?.confidence || deterministic.confidence,
      method,
      reasoning: geminiResult?.reasoning || deterministic.reasoning,
      breakdown: geminiResult?.breakdown || deterministic.breakdown,
      queuePosition: context.queueDepth + 1,
    };
  }

  /**
   * Math-based baseline logic (Deterministic)
   */
  _deterministicPredict(ctx) {
    const basePrepTime = ctx.basePrepTimes.reduce((s, t) => s + t, 0);
    const parallelBatches = Math.ceil(ctx.queueDepth / Math.max(ctx.maxConcurrent, 1));
    const queueWait = parallelBatches * (ctx.vendorAvgPrepTime || 5);
    const rushMultiplier = ctx.isRushHour ? (ctx.rushMultiplier || 1.3) : 1.0;

    const complexityBonus = ctx.itemComplexities.reduce((s, c) => {
      if (c === 'complex') return s + 3;
      if (c === 'medium') return s + 1;
      return s;
    }, 0);

    const capacityRatio = ctx.activeOrders / Math.max(ctx.maxConcurrent, 1);
    const capacityBuffer = capacityRatio > 0.8 ? 3 : capacityRatio > 0.5 ? 1 : 0;

    const total = Math.round(
      (basePrepTime + queueWait + complexityBonus + capacityBuffer) * rushMultiplier
    );

    return {
      estimatedMinutes: Math.max(2, total),
      confidence: 0.65,
      reasoning: `~${basePrepTime} min prep, ${ctx.queueDepth} orders ahead.`,
      breakdown: {
        queue_wait_minutes: Math.round(queueWait),
        active_prep_minutes: basePrepTime + complexityBonus,
        buffer_minutes: capacityBuffer,
      },
    };
  }

  async _buildContext(orderData, vendor, menuItems) {
    const now = new Date();
    const hour = now.getHours();
    const days = ['sun','mon','tue','wed','thu','fri','sat'];

    const activeOrders = await Order.countDocuments({
      vendor: vendor._id,
      status: { $in: ['confirmed', 'preparing'] },
    });

    const queueDepth = await Order.countDocuments({
      vendor: vendor._id,
      status: { $in: ['placed', 'confirmed'] },
    });

    const recentCompleted = await Order.find({
      vendor: vendor._id, status: 'collected',
    }).sort({ collectedAt: -1 }).limit(5).lean();

    const recentCompletedOrders = recentCompleted.map(o => ({
      itemCount: o.items.length,
      predictedMinutes: o.prediction?.estimatedPrepMinutes,
      actualMinutes: o.actualReadyTime && o.placedAt
        ? Math.round((o.actualReadyTime - o.placedAt) / 60000) : null,
    }));

    return {
      items: menuItems.map(m => ({
        name: m.name,
        quantity: orderData.items.find(
          i => i.menuItem.toString() === m._id.toString()
        )?.quantity || 1,
      })),
      totalItemCount: orderData.items.reduce((s, i) => s + (i.quantity || 1), 0),
      itemComplexities: menuItems.map(m => m.complexity),
      basePrepTimes: menuItems.map(m => {
        const qty = orderData.items.find(
          i => i.menuItem.toString() === m._id.toString()
        )?.quantity || 1;
        return m.basePrepTimeMinutes * qty;
      }),
      vendorName: vendor.shopName,
      activeOrders,
      queueDepth,
      maxConcurrent: vendor.maxConcurrentOrders,
      vendorAvgPrepTime: vendor.metrics?.avgActualPrepTime || 5,
      currentTime: now.toISOString(),
      dayOfWeek: days[now.getDay()],
      isRushHour: hour >= 11 && hour <= 13,
      avgPredictionError: vendor.metrics?.avgPredictionError || 0,
      rushMultiplier: vendor.metrics?.peakHourMultiplier || 1.2,
      recentTrend: "accurate",
      recentCompletedOrders,
    };
  }

  async logPredictionAccuracy(order) {
    if (!order.prediction || !order.actualReadyTime || !order.placedAt) return;

    const actualMinutes = Math.round((order.actualReadyTime - order.placedAt) / 60000);
    const predictedMinutes = order.prediction.estimatedPrepMinutes;
    const errorMinutes = actualMinutes - predictedMinutes;

    await PredictionLog.create({
      order: order._id,
      vendor: order.vendor,
      predictedMinutes,
      actualMinutes,
      errorMinutes,
      absoluteError: Math.abs(errorMinutes),
      conditions: {
        queueDepth: order.prediction.queuePositionAtOrder,
        activeOrders: order.prediction.vendorLoadAtOrder,
        timeOfDay: new Date(order.placedAt).toTimeString().slice(0, 5),
        dayOfWeek: ['sun','mon','tue','wed','thu','fri','sat'][new Date(order.placedAt).getDay()],
        totalItems: order.items.length,
      },
    });
  }
}

module.exports = new PredictionEngine();