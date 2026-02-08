class NotificationService {
  constructor() { this.io = null; }

  initialize(io) { this.io = io; }

  notifyStudent(studentId, event, data) {
    if (!this.io) return;
    this.io.to(`student:${studentId}`).emit(event, { ...data, timestamp: new Date() });
  }

  notifyVendor(vendorId, event, data) {
    if (!this.io) return;
    this.io.to(`vendor:${vendorId}`).emit(event, { ...data, timestamp: new Date() });
  }

  orderStateChanged(order) {
    const sid = order.student._id || order.student;
    const vid = order.vendor._id || order.vendor;
    const payload = {
      orderId: order._id, token: order.token,
      status: order.status, predictedReadyTime: order.predictedReadyTime,
    };
    this.notifyStudent(sid, 'order:updated', payload);
    this.notifyVendor(vid, 'queue:updated', payload);

    if (order.status === 'ready') {
      this.notifyStudent(sid, 'order:ready', {
        ...payload, message: `Order ${order.token} is ready for pickup!`,
      });
    }
  }
}

module.exports = new NotificationService();