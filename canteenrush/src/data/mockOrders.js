/**
 * FERRO Industrial Mock Orders
 * Data Type: Technical Transaction Logs
 */

export const generateMockOrders = () => {
  const now = Date.now();

  return [
    {
      id: 'ORD-7821',
      studentName: 'Aarav M.',
      vendorId: 'v2',
      items: [
        { name: 'Butter Chicken + Rice', qty: 1, complexity: 'high', price: 180 },
        { name: 'Lassi', qty: 1, complexity: 'low', price: 60 },
      ],
      status: 'preparing',
      totalPrice: 240,
      placedAt: now - 8 * 60000,
      estimatedReady: now + 4 * 60000,
      tokenNumber: 'T-042',
      protocol: 'AI_OPTIMIZED', // Shows "Neural Optimization" in UI
    },
    {
      id: 'ORD-7822',
      studentName: 'Priya S.',
      vendorId: 'v2',
      items: [
        { name: 'Chole Bhature', qty: 2, complexity: 'medium', price: 100 },
      ],
      status: 'confirmed',
      totalPrice: 200,
      placedAt: now - 3 * 60000,
      estimatedReady: now + 9 * 60000,
      tokenNumber: 'T-043',
      protocol: 'DETERMINISTIC', // Standard baseline rules
    },
    {
      id: 'ORD-7823',
      studentName: 'Rohan K.',
      vendorId: 'v2',
      items: [
        { name: 'Paneer Tikka', qty: 1, complexity: 'high', price: 150 },
        { name: 'Dal Tadka + Roti', qty: 1, complexity: 'medium', price: 120 },
      ],
      status: 'ready',
      totalPrice: 270,
      placedAt: now - 15 * 60000,
      estimatedReady: now - 2 * 60000,
      tokenNumber: 'T-041',
      protocol: 'AI_OPTIMIZED',
    }
  ];
};