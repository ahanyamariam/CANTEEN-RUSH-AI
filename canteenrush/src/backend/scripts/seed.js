require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const PredictionLog = require('../models/PredictionLog');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear everything
  await User.deleteMany({});
  await Vendor.deleteMany({});
  await MenuItem.deleteMany({});
  await Order.deleteMany({});
  await PredictionLog.deleteMany({});

  // ─── VENDOR 1: Raj's Canteen (South Indian) ─────────────
  const vendorUser1 = await User.create({
    name: 'Raj Kumar',
    email: 'raj@vendor.com',
    password: 'password123',
    role: 'vendor',
    phone: '9876543210',
  });

  const vendor1 = await Vendor.create({
    user: vendorUser1._id,
    shopName: "Raj's South Indian",
    location: 'Building A, Ground Floor',
    isOpen: true,
    maxConcurrentOrders: 4,
    avgPrepTimeMinutes: 8,
    operatingHours: { open: '07:30', close: '16:00' },
  });

  vendorUser1.vendorProfile = vendor1._id;
  await vendorUser1.save();

  await MenuItem.insertMany([
    { vendor: vendor1._id, name: 'Masala Dosa', category: 'meal', price: 60, basePrepTimeMinutes: 8, complexity: 'medium' },
    { vendor: vendor1._id, name: 'Plain Dosa', category: 'meal', price: 40, basePrepTimeMinutes: 5, complexity: 'simple' },
    { vendor: vendor1._id, name: 'Idli Sambar (2 pcs)', category: 'snack', price: 30, basePrepTimeMinutes: 4, complexity: 'simple' },
    { vendor: vendor1._id, name: 'Medu Vada (2 pcs)', category: 'snack', price: 35, basePrepTimeMinutes: 5, complexity: 'simple' },
    { vendor: vendor1._id, name: 'Rava Upma', category: 'meal', price: 35, basePrepTimeMinutes: 6, complexity: 'simple' },
    { vendor: vendor1._id, name: 'Filter Coffee', category: 'beverage', price: 20, basePrepTimeMinutes: 3, complexity: 'simple' },
    { vendor: vendor1._id, name: 'Masala Chai', category: 'beverage', price: 15, basePrepTimeMinutes: 3, complexity: 'simple' },
    { vendor: vendor1._id, name: 'Uthappam', category: 'meal', price: 55, basePrepTimeMinutes: 7, complexity: 'medium' },
    { vendor: vendor1._id, name: 'Mini Tiffin Combo', category: 'combo', price: 80, basePrepTimeMinutes: 10, complexity: 'medium' },
  ]);

  // ─── VENDOR 2: Sharma Ji's Chaat ──────────────────────
  const vendorUser2 = await User.create({
    name: 'Vikram Sharma',
    email: 'vikram@vendor.com',
    password: 'password123',
    role: 'vendor',
    phone: '9876543211',
  });

  const vendor2 = await Vendor.create({
    user: vendorUser2._id,
    shopName: "Sharma Ji's Chaat & Snacks",
    location: 'Building B, Canteen Area',
    isOpen: true,
    maxConcurrentOrders: 6,
    avgPrepTimeMinutes: 5,
    operatingHours: { open: '09:00', close: '18:00' },
  });

  vendorUser2.vendorProfile = vendor2._id;
  await vendorUser2.save();

  await MenuItem.insertMany([
    { vendor: vendor2._id, name: 'Samosa (2 pcs)', category: 'snack', price: 20, basePrepTimeMinutes: 2, complexity: 'simple' },
    { vendor: vendor2._id, name: 'Pani Puri (6 pcs)', category: 'snack', price: 30, basePrepTimeMinutes: 3, complexity: 'simple' },
    { vendor: vendor2._id, name: 'Aloo Tikki', category: 'snack', price: 25, basePrepTimeMinutes: 4, complexity: 'simple' },
    { vendor: vendor2._id, name: 'Chole Bhature', category: 'meal', price: 70, basePrepTimeMinutes: 8, complexity: 'medium' },
    { vendor: vendor2._id, name: 'Pav Bhaji', category: 'meal', price: 60, basePrepTimeMinutes: 7, complexity: 'medium' },
    { vendor: vendor2._id, name: 'Dahi Bhalla', category: 'snack', price: 40, basePrepTimeMinutes: 4, complexity: 'simple' },
    { vendor: vendor2._id, name: 'Sweet Lassi', category: 'beverage', price: 25, basePrepTimeMinutes: 2, complexity: 'simple' },
    { vendor: vendor2._id, name: 'Chaat Combo', category: 'combo', price: 90, basePrepTimeMinutes: 8, complexity: 'medium' },
  ]);

  // ─── VENDOR 3: Dragon Wok (Chinese/Indo-Chinese) ──────
  const vendorUser3 = await User.create({
    name: 'Li Wei',
    email: 'li@vendor.com',
    password: 'password123',
    role: 'vendor',
    phone: '9876543212',
  });

  const vendor3 = await Vendor.create({
    user: vendorUser3._id,
    shopName: 'Dragon Wok',
    location: 'Building C, Food Court',
    isOpen: true,
    maxConcurrentOrders: 3,
    avgPrepTimeMinutes: 12,
    operatingHours: { open: '10:00', close: '20:00' },
  });

  vendorUser3.vendorProfile = vendor3._id;
  await vendorUser3.save();

  await MenuItem.insertMany([
    { vendor: vendor3._id, name: 'Veg Fried Rice', category: 'meal', price: 80, basePrepTimeMinutes: 10, complexity: 'medium' },
    { vendor: vendor3._id, name: 'Chicken Fried Rice', category: 'meal', price: 100, basePrepTimeMinutes: 12, complexity: 'medium' },
    { vendor: vendor3._id, name: 'Veg Manchurian', category: 'meal', price: 70, basePrepTimeMinutes: 10, complexity: 'medium' },
    { vendor: vendor3._id, name: 'Chilli Paneer', category: 'meal', price: 90, basePrepTimeMinutes: 12, complexity: 'complex' },
    { vendor: vendor3._id, name: 'Hakka Noodles', category: 'meal', price: 75, basePrepTimeMinutes: 10, complexity: 'medium' },
    { vendor: vendor3._id, name: 'Spring Rolls (4 pcs)', category: 'snack', price: 50, basePrepTimeMinutes: 6, complexity: 'simple' },
    { vendor: vendor3._id, name: 'Hot & Sour Soup', category: 'beverage', price: 40, basePrepTimeMinutes: 5, complexity: 'simple' },
    { vendor: vendor3._id, name: 'Dragon Special Thali', category: 'combo', price: 150, basePrepTimeMinutes: 18, complexity: 'complex' },
  ]);

  // ─── VENDOR 4: Juice Junction (Beverages) ─────────────
  const vendorUser4 = await User.create({
    name: 'Priya Nair',
    email: 'priya@vendor.com',
    password: 'password123',
    role: 'vendor',
    phone: '9876543213',
  });

  const vendor4 = await Vendor.create({
    user: vendorUser4._id,
    shopName: 'Juice Junction',
    location: 'Near Library, Building D',
    isOpen: true,
    maxConcurrentOrders: 8,
    avgPrepTimeMinutes: 4,
    operatingHours: { open: '08:00', close: '18:00' },
  });

  vendorUser4.vendorProfile = vendor4._id;
  await vendorUser4.save();

  await MenuItem.insertMany([
    { vendor: vendor4._id, name: 'Mango Shake', category: 'beverage', price: 40, basePrepTimeMinutes: 3, complexity: 'simple' },
    { vendor: vendor4._id, name: 'Banana Shake', category: 'beverage', price: 35, basePrepTimeMinutes: 3, complexity: 'simple' },
    { vendor: vendor4._id, name: 'Fresh Orange Juice', category: 'beverage', price: 45, basePrepTimeMinutes: 4, complexity: 'simple' },
    { vendor: vendor4._id, name: 'Watermelon Juice', category: 'beverage', price: 30, basePrepTimeMinutes: 3, complexity: 'simple' },
    { vendor: vendor4._id, name: 'Cold Coffee', category: 'beverage', price: 50, basePrepTimeMinutes: 4, complexity: 'simple' },
    { vendor: vendor4._id, name: 'Oreo Shake', category: 'beverage', price: 60, basePrepTimeMinutes: 5, complexity: 'medium' },
    { vendor: vendor4._id, name: 'Fruit Bowl', category: 'snack', price: 50, basePrepTimeMinutes: 3, complexity: 'simple' },
    { vendor: vendor4._id, name: 'Sandwich + Juice Combo', category: 'combo', price: 80, basePrepTimeMinutes: 7, complexity: 'medium' },
  ]);

  // ─── VENDOR 5: Biryani House ──────────────────────────
  const vendorUser5 = await User.create({
    name: 'Ahmed Khan',
    email: 'ahmed@vendor.com',
    password: 'password123',
    role: 'vendor',
    phone: '9876543214',
  });

  const vendor5 = await Vendor.create({
    user: vendorUser5._id,
    shopName: 'Biryani House',
    location: 'Main Gate, Food Street',
    isOpen: false,  // closed — to show mixed state
    maxConcurrentOrders: 3,
    avgPrepTimeMinutes: 15,
    operatingHours: { open: '11:00', close: '15:00' },
  });

  vendorUser5.vendorProfile = vendor5._id;
  await vendorUser5.save();

  await MenuItem.insertMany([
    { vendor: vendor5._id, name: 'Veg Biryani', category: 'meal', price: 90, basePrepTimeMinutes: 12, complexity: 'complex' },
    { vendor: vendor5._id, name: 'Chicken Biryani', category: 'meal', price: 120, basePrepTimeMinutes: 15, complexity: 'complex' },
    { vendor: vendor5._id, name: 'Paneer Biryani', category: 'meal', price: 100, basePrepTimeMinutes: 13, complexity: 'complex' },
    { vendor: vendor5._id, name: 'Raita', category: 'snack', price: 20, basePrepTimeMinutes: 2, complexity: 'simple' },
    { vendor: vendor5._id, name: 'Gulab Jamun (2 pcs)', category: 'dessert', price: 30, basePrepTimeMinutes: 2, complexity: 'simple' },
    { vendor: vendor5._id, name: 'Biryani Thali', category: 'combo', price: 150, basePrepTimeMinutes: 18, complexity: 'complex' },
  ]);

  // ─── STUDENTS ─────────────────────────────────────────
  await User.create({
    name: 'Amit Sharma',
    email: 'amit@student.com',
    password: 'password123',
    role: 'student',
    phone: '9998887771',
    classSchedule: [
      { day: 'mon', breakStart: '11:30', breakEnd: '12:15' },
      { day: 'tue', breakStart: '10:30', breakEnd: '11:15' },
      { day: 'wed', breakStart: '11:30', breakEnd: '12:15' },
      { day: 'thu', breakStart: '13:00', breakEnd: '13:45' },
      { day: 'fri', breakStart: '11:30', breakEnd: '12:15' },
    ],
  });

  await User.create({
    name: 'Neha Gupta',
    email: 'neha@student.com',
    password: 'password123',
    role: 'student',
    phone: '9998887772',
  });

  await User.create({
    name: 'Rohan Patel',
    email: 'rohan@student.com',
    password: 'password123',
    role: 'student',
    phone: '9998887773',
  });

  console.log('\n✅ Seed complete! Multi-vendor data loaded.\n');
  console.log('═══════════════════════════════════════════');
  console.log('  VENDOR LOGINS:');
  console.log('  raj@vendor.com      / password123  (South Indian)');
  console.log('  vikram@vendor.com   / password123  (Chaat)');
  console.log('  li@vendor.com       / password123  (Chinese)');
  console.log('  priya@vendor.com    / password123  (Juices)');
  console.log('  ahmed@vendor.com    / password123  (Biryani - CLOSED)');
  console.log('');
  console.log('  STUDENT LOGINS:');
  console.log('  amit@student.com    / password123');
  console.log('  neha@student.com    / password123');
  console.log('  rohan@student.com   / password123');
  console.log('═══════════════════════════════════════════\n');

  await mongoose.disconnect();
}

seed().catch(console.error);