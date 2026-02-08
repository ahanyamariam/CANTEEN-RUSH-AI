import { useState, useEffect } from 'react';
import api from '../api/axios';

export function useVendors(showAll = false) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const endpoint = showAll ? '/vendors/all' : '/vendors';
    api.get(endpoint)
      .then((res) => setVendors(res.data.vendors))
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, [showAll]);

  return { vendors, loading, error };
}

export function useVendorMenu(vendorId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vendorId) return;
    setLoading(true);
    api.get(`/menu/vendor/${vendorId}`)
      .then((res) => setItems(res.data.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [vendorId]);

  return { items, loading };
}

export function useVendorDetails(vendorId) {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vendorId) return;
    api.get(`/vendors/${vendorId}`)
      .then((res) => setVendor(res.data.vendor))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [vendorId]);

  return { vendor, loading };
}

// Vendor managing their own menu
export function useManageMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMenu = async (vendorId) => {
    try {
      const { data } = await api.get(`/menu/vendor/${vendorId}`);
      setItems(data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (itemData) => {
    const { data } = await api.post('/menu', itemData);
    setItems((prev) => [...prev, data.item]);
    return data.item;
  };

  const updateItem = async (itemId, updates) => {
    const { data } = await api.patch(`/menu/${itemId}`, updates);
    setItems((prev) => prev.map((i) => (i._id === itemId ? data.item : i)));
    return data.item;
  };

  const toggleAvailability = async (itemId) => {
    const { data } = await api.patch(`/menu/${itemId}/toggle`);
    setItems((prev) => prev.map((i) => (i._id === itemId ? data.item : i)));
    return data.item;
  };

  return { items, loading, fetchMenu, addItem, updateItem, toggleAvailability };
}