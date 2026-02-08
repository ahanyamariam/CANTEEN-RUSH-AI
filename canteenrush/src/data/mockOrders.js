export const generateMockOrders = () => {
  const now = Date.now();

  return [
    {
      id: 'ORD-7821',
      studentName: 'Aarav M.',
      vendorId: 'v2',
      items: [
        { name: 'Butter Chicken + Rice', qty: 1, prepTime: 10, price: 180 },
        { name: 'Lassi', qty: 1, prepTime: 2, price: 60 },
      ],
      status: 'preparing',
      totalPrice: 240,
      placedAt: now - 8 * 60000,
      estimatedReady: now + 4 * 60000,
      tokenNumber: 'T-042',
    },
    {
      id: 'ORD-7822',
      studentName: 'Priya S.',
      vendorId: 'v2',
      items: [
        { name: 'Chole Bhature', qty: 2, prepTime: 6, price: 100 },
      ],
      status: 'confirmed',
      totalPrice: 200,
      placedAt: now - 3 * 60000,
      estimatedReady: now + 9 * 60000,
      tokenNumber: 'T-043',
    },
    {
      id: 'ORD-7823',
      studentName: 'Rohan K.',
      vendorId: 'v2',
      items: [
        { name: 'Paneer Tikka', qty: 1, prepTime: 8, price: 150 },
        { name: 'Dal Tadka + Roti', qty: 1, prepTime: 7, price: 120 },
      ],
      status: 'ready',
      totalPrice: 270,
      placedAt: now - 15 * 60000,
      estimatedReady: now - 2 * 60000,
      tokenNumber: 'T-041',
    },
    {
      id: 'ORD-7824',
      studentName: 'Sneha R.',
      vendorId: 'v1',
      items: [
        { name: 'Cappuccino', qty: 2, prepTime: 3, price: 120 },
        { name: 'Veg Sandwich', qty: 1, prepTime: 5, price: 90 },
      ],
      status: 'preparing',
      totalPrice: 330,
      placedAt: now - 5 * 60000,
      estimatedReady: now + 3 * 60000,
      tokenNumber: 'T-044',
    },
    {
      id: 'ORD-7825',
      studentName: 'Vikram P.',
      vendorId: 'v1',
      items: [
        { name: 'Masala Chai', qty: 3, prepTime: 3, price: 40 },
      ],
      status: 'confirmed',
      totalPrice: 120,
      placedAt: now - 1 * 60000,
      estimatedReady: now + 8 * 60000,
      tokenNumber: 'T-045',
    },
    {
      id: 'ORD-7826',
      studentName: 'Meera J.',
      vendorId: 'v3',
      items: [
        { name: 'Hakka Noodles', qty: 1, prepTime: 7, price: 120 },
        { name: 'Manchurian Dry', qty: 1, prepTime: 8, price: 130 },
      ],
      status: 'preparing',
      totalPrice: 250,
      placedAt: now - 6 * 60000,
      estimatedReady: now + 5 * 60000,
      tokenNumber: 'T-046',
    },
  ];
};