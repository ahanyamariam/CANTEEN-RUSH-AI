require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const predictionEngine = require('../services/predictionEngine');
const queueManager = require('../services/queueManager');
const PredictionLog = require('../models/PredictionLog');

async function simulate() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('\n🎮 ═══ RANDOMIZED ORDER SIMULATION ═══\n');

  // 1. Get ALL students and open vendors
  const students = await User.find({ role: 'student' });
  const vendors = await Vendor.find({ isOpen: true });

  if (students.length === 0 || vendors.length === 0) {
    console.error('❌ No students or open vendors found. Run seed first: npm run seed');
    process.exit(1);
  }

  // 2. Pick Random Student & Vendor
  const student = students[Math.floor(Math.random() * students.length)];
  const vendor = vendors[Math.floor(Math.random() * vendors.length)];

  // 3. Get Menu for that Vendor
  const menuItems = await MenuItem.find({ vendor: vendor._id });
  
  if (menuItems.length === 0) {
    console.error(`❌ Vendor ${vendor.shopName} has no menu items.`);
    process.exit(1);
  }

  console.log(`Student: ${student.name}`);
  console.log(`Vendor:  ${vendor.shopName}`);

  // 4. Pick Random Items (1 to 3 items)
  const numItems = Math.floor(Math.random() * 3) + 1;
  const selectedItems = [];
  
  for (let i = 0; i < numItems; i++) {
    const item = menuItems[Math.floor(Math.random() * menuItems.length)];
    selectedItems.push({
      menuItem: item._id,
      quantity: Math.floor(Math.random() * 2) + 1 // 1 or 2 quantity
    });
  }

  console.log(`Items:   ${selectedItems.length} items selected\n`);

  // ── STEP 1: AI Prediction ──────────────────────────────
  console.log('─── STEP 1: Getting AI Prediction ───');

  const startTime = Date.now();
  const prediction = await predictionEngine.predictReadyTime({ items: selectedItems }, vendor._id);
  const aiDuration = Date.now() - startTime;

  console.log(`\n🤖 Prediction Result (took ${aiDuration}ms):`);
  console.log(`   Method:     ${prediction.method}`);
  console.log(`   Estimate:   ${prediction.estimatedMinutes} minutes`);
  console.log(`   Confidence: ${(prediction.confidence * 100).toFixed(0)}%`);
  console.log(`   Reasoning:  ${prediction.reasoning}`);

  // ── STEP 2: Create Order ───────────────────────────────
  console.log('\n─── STEP 2: Creating Order ───');

  // Calculate total price
  let totalPrice = 0;
  for (const sel of selectedItems) {
    const item = menuItems.find(m => m._id.toString() === sel.menuItem.toString());
    totalPrice += item.price * sel.quantity;
  }

  const order = new Order({
    student: student._id,
    vendor: vendor._id,
    items: selectedItems,
    totalPrice,
    predictedReadyTime: prediction.predictedReadyTime,
    queuePosition: prediction.queuePosition,
    prediction: {
      estimatedPrepMinutes: prediction.estimatedMinutes,
      queuePositionAtOrder: prediction.queuePosition,
      vendorLoadAtOrder: vendor.currentLoad.activeOrders,
      confidenceScore: prediction.confidence,
      method: prediction.method,
      geminiReasoning: prediction.reasoning,
    },
  });
  order.statusHistory.push({ status: 'placed' });
  await order.save();

  console.log(`   Order created: ${order.token}`);

  // ── STEP 3: Simulate Vendor Workflow ───────────────────
  console.log('\n─── STEP 3: Simulating Vendor Workflow ───');

  // Confirm
  await queueManager.transitionOrder(order._id, 'confirmed');
  console.log(`   ${order.token} → confirmed`);

  // Start preparing (random delay 500ms - 1500ms)
  await new Promise(r => setTimeout(r, Math.random() * 1000 + 500));
  await queueManager.transitionOrder(order._id, 'preparing');
  console.log(`   ${order.token} → preparing`);

  // Mark ready (random prep time simulation)
  await new Promise(r => setTimeout(r, Math.random() * 1500 + 500));
  await queueManager.transitionOrder(order._id, 'ready');
  console.log(`   ${order.token} → ready ✅`);

  // Collect
  await new Promise(r => setTimeout(r, 500));
  const finalOrder = await queueManager.transitionOrder(order._id, 'collected');
  console.log(`   ${order.token} → collected`);

  // ── STEP 4: Log Prediction Accuracy ────────────────────
  console.log('\n─── STEP 4: Logging Prediction Accuracy ───');

  await predictionEngine.logPredictionAccuracy(finalOrder);

  const log = await PredictionLog.findOne({ order: order._id });

  if (log) {
    console.log(`   Predicted: ${log.predictedMinutes} min`);
    console.log(`   Actual:    ${log.actualMinutes} min`);
    console.log(`   Error:     ${log.errorMinutes > 0 ? '+' : ''}${log.errorMinutes} min`);
  }

  // ── STEP 5: Update Stats ───────────────────────
  console.log('\n─── STEP 5: Vendor Stats Updated ───');
  const updatedVendor = await Vendor.findById(vendor._id);
  console.log(`   Accuracy score: ${(updatedVendor.metrics.accuracyScore * 100).toFixed(0)}%`);

  console.log('\n═══════════════════════════════════════════');
  console.log('  ✅ SIMULATION COMPLETE');
  console.log('═══════════════════════════════════════════\n');

  await mongoose.disconnect();
}

simulate().catch(console.error);