const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = function setupSocket(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Auth required'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found'));
      socket.user = user;
      next();
    } catch (e) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`⚡ Socket: ${socket.user.name} (${socket.user.role})`);

    if (socket.user.role === 'student') {
      socket.join(`student:${socket.user._id}`);
    }
    if (socket.user.role === 'vendor' && socket.user.vendorProfile) {
      socket.join(`vendor:${socket.user.vendorProfile}`);
    }

    socket.on('order:subscribe', (orderId) => socket.join(`order:${orderId}`));
    socket.on('order:unsubscribe', (orderId) => socket.leave(`order:${orderId}`));
    socket.on('disconnect', () => console.log(`💤 Disconnected: ${socket.user.name}`));
  });
};