const express = require('express');
const MenuItem = require('../models/MenuItem');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const items = await MenuItem.find({
      vendor: req.params.vendorId, isAvailable: true,
    }).sort({ category: 1, name: 1 });
    res.json({ items });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, requireRole('vendor'), async (req, res) => {
  try {
    const item = await MenuItem.create({ ...req.body, vendor: req.user.vendorProfile });
    res.status(201).json({ item });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id', auth, requireRole('vendor'), async (req, res) => {
  try {
    const item = await MenuItem.findOneAndUpdate(
      { _id: req.params.id, vendor: req.user.vendorProfile },
      req.body, { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ item });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id/toggle', auth, requireRole('vendor'), async (req, res) => {
  try {
    const item = await MenuItem.findOne({ _id: req.params.id, vendor: req.user.vendorProfile });
    if (!item) return res.status(404).json({ error: 'Not found' });
    item.isAvailable = !item.isAvailable;
    await item.save();
    res.json({ item });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;