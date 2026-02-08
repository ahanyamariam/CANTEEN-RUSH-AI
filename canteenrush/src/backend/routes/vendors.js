const express = require('express');
const Vendor = require('../models/Vendor');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find({ isOpen: true }).populate('user', 'name');
    res.json({ vendors });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/all', async (req, res) => {
  try {
    const vendors = await Vendor.find().populate('user', 'name');
    res.json({ vendors });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate('user', 'name');
    if (!vendor) return res.status(404).json({ error: 'Not found' });
    res.json({ vendor });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/toggle-status', auth, requireRole('vendor'), async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user.vendorProfile);
    vendor.isOpen = !vendor.isOpen;
    await vendor.save();
    res.json({ vendor });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/settings', auth, requireRole('vendor'), async (req, res) => {
  try {
    const allowed = ['maxConcurrentOrders', 'operatingHours', 'avgPrepTimeMinutes', 'shopName', 'location'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const vendor = await Vendor.findByIdAndUpdate(req.user.vendorProfile, updates, { new: true });
    res.json({ vendor });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;