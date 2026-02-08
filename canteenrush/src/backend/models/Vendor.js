const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shopName: { type: String, required: true },
  location: String,
  isOpen: { type: Boolean, default: false },
  maxConcurrentOrders: { type: Number, default: 5 },
  operatingHours: {
    open: { type: String, default: '08:00' },
    close: { type: String, default: '17:00' },
  },
  avgPrepTimeMinutes: { type: Number, default: 10 },
  currentLoad: {
    activeOrders: { type: Number, default: 0 },
    queueDepth: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  metrics: {
    totalOrdersCompleted: { type: Number, default: 0 },
    avgActualPrepTime: { type: Number, default: 10 },
    peakHourMultiplier: { type: Number, default: 1.5 },
    accuracyScore: { type: Number, default: 0.85 },
  },
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);