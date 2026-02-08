const mongoose = require('mongoose');

const predictionLogSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  predictedMinutes: Number,
  actualMinutes: Number,
  errorMinutes: Number,
  absoluteError: Number,
  conditions: {
    queueDepth: Number,
    activeOrders: Number,
    timeOfDay: String,
    dayOfWeek: String,
    itemComplexities: [String],
    totalItems: Number,
    isRushHour: Boolean,
  },
  createdAt: { type: Date, default: Date.now },
});

predictionLogSchema.index({ vendor: 1, createdAt: -1 });

module.exports = mongoose.model('PredictionLog', predictionLogSchema);