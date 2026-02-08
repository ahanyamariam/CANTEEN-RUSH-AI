const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['snack', 'beverage', 'meal', 'dessert', 'combo'], default: 'snack' },
  price: { type: Number, required: true },
  basePrepTimeMinutes: { type: Number, required: true, default: 5 },
  complexity: { type: String, enum: ['simple', 'medium', 'complex'], default: 'simple' },
  isAvailable: { type: Boolean, default: true },
  ingredients: [String],
  image: String,
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);