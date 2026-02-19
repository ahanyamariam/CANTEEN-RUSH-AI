require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const notificationService = require('./services/notificationService');
const setupSocket = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);

// Define allowed origins for CORS (Support both 3000 and 3001)
const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:3000',
    'http://localhost:3001'
].filter(Boolean); // Filters out undefined if CLIENT_URL isn't set

// Initialize Socket.io with updated CORS settings
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials: true
    },
});

notificationService.initialize(io);
setupSocket(io);

// Standard Express CORS middleware
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/vendors', require('./routes/vendors'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/predictions', require('./routes/predictions'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5001; // Matches your .env port

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`\n🚀 Backend running on http://localhost:${PORT}`);
        console.log(`📡 WebSocket ready (Allowed Origins: ${allowedOrigins.join(', ')})`);
        console.log(`🔗 Ensure your frontend is running on one of the origins above.\n`);
    });
});