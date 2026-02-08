import { io } from 'socket.io-client';

let socket = null;

export function connectSocket() {
    const token = localStorage.getItem('token');
    if (!token || socket) return socket;

    socket = io('http://localhost:5001', {
        auth: { token },
        reconnection: true,
        reconnectionDelay: 1000,
    });

    socket.on('connect', () => console.log('🟢 Socket connected'));
    socket.on('connect_error', (e) => console.error('🔴 Socket error:', e.message));

    return socket;
}

export function getSocket() { return socket; }

export function disconnectSocket() {
    if (socket) { socket.disconnect(); socket = null; }
}