const express = require('express');
const chatService = require('../services/chatService');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/message', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const response = await chatService.handleMessage(req.user._id.toString(), message);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI Brain Freeze 🥶' });
  }
});

module.exports = router;