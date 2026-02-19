import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { getSocket } from '../api/socket';

// Student: Place Order Protocol
export function usePlaceOrder() {
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);

  const placeOrder = async (vendorId, items, desiredPickupTime = null) => {
    setPlacing(true);
    setError(null);
    try {
      const { data } = await api.post('/orders', { vendorId, items, desiredPickupTime });
      return data.order;
    } catch (err) {
      const msg = `[SYNC_ERROR] ${err.response?.data?.error || err.message}`;
      setError(msg);
      throw new Error(msg);
    } finally {
      setPlacing(false);
    }
  };

  return { placeOrder, placing, error };
}

// Student: Active Orders (Real-Time Sync)
export function useActiveOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const { data } = await api.get('/orders/active');
      setOrders(data.orders);
    } catch (err) {
      console.error('[NETWORK] FETCH_FAILED', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    const socket = getSocket();
    if (socket) {
      socket.on('order:updated', fetch);
      socket.on('order:ready', (data) => {
        fetch();
        // Technical Browser Notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('[STATUS] ORDER_READY', {
            body: `${data.message} / TOKEN: ${data.token || 'N/A'}`,
            icon: '/favicon.ico' // Ensure this is a clean geometric icon
          });
        }
      });
      socket.on('order:preparing', fetch);
      return () => {
        socket.off('order:updated', fetch);
        socket.off('order:ready');
        socket.off('order:preparing', fetch);
      };
    }
    // Technical fallback sync
    const interval = setInterval(fetch, 15000);
    return () => clearInterval(interval);
  }, [fetch]);

  const cancelOrder = async (orderId) => {
    await api.post(`/orders/${orderId}/cancel`);
    fetch();
  };

  return { orders, loading, refetch: fetch, cancelOrder };
}

// Public: Track by Token
export function useTrackOrder(token) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const track = useCallback(async (t) => {
    const searchToken = t || token;
    if (!searchToken) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/orders/track/${searchToken}`);
      setOrder(data);
    } catch (err) {
      setError(`[ERROR] TOKEN_NOT_FOUND: ${searchToken}`);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) track();
  }, [token, track]);

  return { order, loading, error, track };
}

// Vendor: Live Kitchen Queue
export function useVendorQueue() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const { data } = await api.get('/orders/vendor/queue');
      setQueue(data.queue);
    } catch (err) {
      console.error('[KITCHEN_SYNC] FAILED', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = async (orderId, status) => {
    const { data } = await api.patch(`/orders/${orderId}/status`, { status });
    setQueue(data.queue);
    return data.order;
  };

  const collectByToken = async (token) => {
    const { data } = await api.post(`/orders/collect/${token}`);
    await fetch();
    return data.order;
  };

  useEffect(() => {
    fetch();
    const socket = getSocket();
    if (socket) {
      socket.on('order:new', fetch);
      socket.on('queue:updated', fetch);
      return () => {
        socket.off('order:new', fetch);
        socket.off('queue:updated', fetch);
      };
    }
    const interval = setInterval(fetch, 10000);
    return () => clearInterval(interval);
  }, [fetch]);

  return { queue, loading, updateStatus, collectByToken, refetch: fetch };
}

// Student: Order History
export function useOrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const { data } = await api.get('/orders/history');
      setOrders(data.orders);
    } catch (err) {
      console.error('[NETWORK] HISTORY_FETCH_FAILED', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { orders, loading, refetch: fetch };
}

// Vendor: Order History and Stats
export function useVendorHistory(days = 7) {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/orders/vendor/history?days=${days}`);
      setOrders(data.orders);
      setStats(data.stats);
    } catch (err) {
      console.error('[KITCHEN_OS] HISTORY_SYNC_FAILED', err);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { orders, stats, loading, refetch: fetch };
}