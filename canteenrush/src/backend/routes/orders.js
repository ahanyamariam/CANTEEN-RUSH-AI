const express = require('express');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Vendor = require('../models/Vendor');
const predictionEngine = require('../services/predictionEngine');
const geminiService = require('../services/geminiService'); // 🟢 ADDED THIS
const queueManager = require('../services/queueManager');
const notificationService = require('../services/notificationService');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// ── Student: Place Order ─────────────────────────────────
router.post('/', auth, requireRole('student'), async (req, res) => {
  try {
    const { vendorId, items, desiredPickupTime } = req.body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    if (!vendor.isOpen) return res.status(400).json({ error: 'Vendor is closed' });

    // 1. Get the full details of the items first
    const menuItems = await MenuItem.find({ _id: { $in: items.map(i => i.menuItem) } });

    // 2. Calculate price (Moved up so it's ready for the Order model)
    const totalPrice = items.reduce((total, item) => {
      const mi = menuItems.find(m => m._id.toString() === item.menuItem.toString());
      return total + (mi?.price || 0) * (item.quantity || 1);
    }, 0);

    // 3. AI Prediction (Now it has context via predictionEngine)
    const prediction = await predictionEngine.predictReadyTime({ items }, vendorId);

    const order = new Order({
      student: req.user._id,
      vendor: vendorId,
      items,
      totalPrice,
      desiredPickupTime: desiredPickupTime ? new Date(desiredPickupTime) : null,
      predictedReadyTime: prediction.predictedReadyTime,
      queuePosition: prediction.queuePosition,
      prediction: {
        estimatedPrepMinutes: prediction.estimatedMinutes,
        queuePositionAtOrder: prediction.queuePosition,
        vendorLoadAtOrder: vendor.currentLoad?.activeOrders || 0,
        confidenceScore: prediction.confidence,
        method: prediction.method,
        geminiReasoning: prediction.reasoning,
      },
    });

    order.statusHistory.push({ status: 'placed' });
    await order.save();

    // Update vendor load
    await Vendor.findByIdAndUpdate(vendorId, { $inc: { 'currentLoad.queueDepth': 1 } });

    // Notify vendor
    notificationService.notifyVendor(vendorId, 'order:new', {
      orderId: order._id, token: order.token,
    });

    // Populate for response
    await order.populate('items.menuItem', 'name price category');
    await order.populate('vendor', 'shopName location');

    res.status(201).json({
      order: {
        id: order._id,
        token: order.token,
        status: order.status,
        items: order.items,
        totalPrice: order.totalPrice,
        predictedReadyTime: order.predictedReadyTime,
        queuePosition: order.queuePosition,
        prediction: {
          estimatedMinutes: prediction.estimatedMinutes,
          confidence: prediction.confidence,
          reasoning: prediction.reasoning,
          breakdown: prediction.breakdown,
          method: prediction.method,
        },
        vendor: order.vendor,
      },
    });
  } catch (err) {
    console.error('Order error:', err);
    res.status(500).json({ error: err.message });
  }
});
// ── Student: Active Orders ───────────────────────────────
router.get('/active', auth, requireRole('student'), async (req, res) => {
  try {
    const orders = await Order.find({
      student: req.user._id,
      status: { $in: ['placed', 'confirmed', 'preparing', 'ready'] },
    })
      .populate('items.menuItem', 'name price')
      .populate('vendor', 'shopName location')
      .sort({ placedAt: -1 });
    res.json({ orders });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Student: Order History ───────────────────────────────
router.get('/my', auth, requireRole('student'), async (req, res) => {
  try {
    const orders = await Order.find({ student: req.user._id })
      .populate('items.menuItem', 'name price')
      .populate('vendor', 'shopName location')
      .sort({ placedAt: -1 }).limit(20);
    res.json({ orders });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Public: Track by Token ───────────────────────────────
router.get('/track/:token', async (req, res) => {
  try {
    const order = await Order.findOne({ token: req.params.token.toUpperCase() })
      .populate('items.menuItem', 'name price')
      .populate('vendor', 'shopName location');
    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json({
      token: order.token, status: order.status,
      items: order.items,
      predictedReadyTime: order.predictedReadyTime,
      actualReadyTime: order.actualReadyTime,
      queuePosition: order.queuePosition,
      prediction: {
        estimatedMinutes: order.prediction?.estimatedPrepMinutes,
        confidence: order.prediction?.confidenceScore,
        reasoning: order.prediction?.geminiReasoning,
      },
      statusHistory: order.statusHistory,
      vendor: order.vendor,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Student: Cancel ──────────────────────────────────────
router.post('/:id/cancel', auth, requireRole('student'), async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, student: req.user._id });
    if (!order) return res.status(404).json({ error: 'Not found' });
    if (!['placed', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ error: 'Cannot cancel — already preparing' });
    }
    const updated = await queueManager.transitionOrder(order._id, 'cancelled');
    notificationService.orderStateChanged(updated);
    res.json({ message: 'Cancelled', order: updated });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Vendor: Live Queue ───────────────────────────────────
router.get('/vendor/queue', auth, requireRole('vendor'), async (req, res) => {
  try {
    const queue = await queueManager.getVendorQueue(req.user.vendorProfile);
    res.json({ queue });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Vendor: Update Status ────────────────────────────────
router.patch('/:id/status', auth, requireRole('vendor'), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await queueManager.transitionOrder(req.params.id, status);

    if (status === 'collected') {
      await predictionEngine.logPredictionAccuracy(order);
    }

    notificationService.orderStateChanged(order);
    const queue = await queueManager.getVendorQueue(req.user.vendorProfile);

    res.json({ order, queue });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ── Vendor: Collect by Token ─────────────────────────────
router.post('/collect/:token', auth, requireRole('vendor'), async (req, res) => {
  try {
    const order = await Order.findOne({
      token: req.params.token.toUpperCase(),
      vendor: req.user.vendorProfile,
      status: 'ready',
    });
    if (!order) return res.status(404).json({ error: 'No ready order with this token' });

    const updated = await queueManager.transitionOrder(order._id, 'collected');
    await predictionEngine.logPredictionAccuracy(updated);
    notificationService.orderStateChanged(updated);

    res.json({ message: 'Collected', order: updated });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Vendor: History + Stats ──────────────────────────────
router.get('/test-ai', async (req, res) => {
  const result = await geminiService.predictPrepTime({
    items: [{ name: 'Samosa', quantity: 2 }],
    totalItemCount: 2,
    itemComplexities: ['simple'],
    basePrepTimes: [5],
    vendorName: "Test Shop",
    activeOrders: 1,
    queueDepth: 0,
    maxConcurrent: 5,
    vendorAvgPrepTime: 5,
    currentTime: new Date().toISOString(),
    dayOfWeek: "monday",
    isRushHour: false,
    avgPredictionError: 0,
    rushMultiplier: 1.2,
    recentTrend: "accurate",
    recentCompletedOrders: []
  });
  res.json({ success: !!result, data: result });
});

module.exports = router;