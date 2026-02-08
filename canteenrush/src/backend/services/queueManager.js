const Order = require('../models/Order');
const Vendor = require('../models/Vendor');

class QueueManager {
  async getVendorQueue(vendorId) {
    const orders = await Order.find({
      vendor: vendorId,
      status: { $in: ['placed', 'confirmed', 'preparing'] },
    })
      .populate('items.menuItem', 'name basePrepTimeMinutes complexity price')
      .populate('student', 'name phone')
      .sort({ placedAt: 1 })
      .lean();

    return orders.map((order, i) => ({
      ...order,
      queuePosition: i + 1,
      waitingMinutes: Math.round((Date.now() - new Date(order.placedAt)) / 60000),
      isUrgent: order.desiredPickupTime
        && new Date(order.desiredPickupTime) - Date.now() < 5 * 60000,
    }));
  }

  async transitionOrder(orderId, newStatus) {
    const valid = {
      placed: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['collected'],
      collected: [],
      cancelled: [],
    };

    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');
    if (!valid[order.status]?.includes(newStatus)) {
      throw new Error(`Cannot transition ${order.status} → ${newStatus}`);
    }

    order.status = newStatus;
    order.statusHistory.push({ status: newStatus, timestamp: new Date() });

    if (newStatus === 'ready') order.actualReadyTime = new Date();
    if (newStatus === 'collected') order.collectedAt = new Date();

    await order.save();
    await this._updateVendorLoad(order.vendor);
    return order;
  }

  async _updateVendorLoad(vendorId) {
    const activeOrders = await Order.countDocuments({
      vendor: vendorId, status: { $in: ['confirmed', 'preparing'] },
    });
    const queueDepth = await Order.countDocuments({
      vendor: vendorId, status: { $in: ['placed', 'confirmed', 'preparing'] },
    });
    await Vendor.findByIdAndUpdate(vendorId, {
      'currentLoad.activeOrders': activeOrders,
      'currentLoad.queueDepth': queueDepth,
      'currentLoad.lastUpdated': new Date(),
    });
  }
}

module.exports = new QueueManager();