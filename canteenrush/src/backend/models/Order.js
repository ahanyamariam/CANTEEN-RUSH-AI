const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderSchema = new mongoose.Schema({
  token: {
    type: String,
    default: () => uuidv4().slice(0, 8).toUpperCase(),
    unique: true,
  },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    quantity: { type: Number, default: 1 },
    specialInstructions: String,
  }],
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'preparing', 'ready', 'collected', 'cancelled'],
    default: 'placed',
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
  }],
  placedAt: { type: Date, default: Date.now },
  desiredPickupTime: Date,
  predictedReadyTime: Date,
  actualReadyTime: Date,
  collectedAt: Date,
  prediction: {
    estimatedPrepMinutes: Number,
    queuePositionAtOrder: Number,
    vendorLoadAtOrder: Number,
    confidenceScore: Number,
    method: { type: String, enum: ['deterministic', 'gemini', 'hybrid'] },
    geminiReasoning: String,
  },
  totalPrice: Number,
  queuePosition: Number,
}, { timestamps: true });

orderSchema.index({ vendor: 1, status: 1, placedAt: 1 });
orderSchema.index({ student: 1, status: 1 });
module.exports = mongoose.model('Order', orderSchema);