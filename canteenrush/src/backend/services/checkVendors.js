require('dotenv').config();
const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const vendors = await Vendor.find({});
  
  console.log('\n🏪 VENDORS IN DB:');
  vendors.forEach(v => {
    console.log(`- "${v.shopName}" (ID: ${v._id})`);
  });
  console.log('\n');
  await mongoose.disconnect();
}

check();