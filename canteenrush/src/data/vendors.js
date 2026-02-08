export const vendors = [
  {
    id: 'v1',
    name: 'Café Horizon',
    image: '☕',
    cuisine: 'Beverages & Snacks',
    rating: 4.5,
    avgPrepTime: 4,
    capacity: 5,
    location: 'Block A, Ground Floor',
    isOpen: true,
  },
  {
    id: 'v2',
    name: 'Desi Dhaba',
    image: '🍛',
    cuisine: 'North Indian',
    rating: 4.3,
    avgPrepTime: 8,
    capacity: 4,
    location: 'Central Canteen',
    isOpen: true,
  },
  {
    id: 'v3',
    name: 'Dragon Wok',
    image: '🥡',
    cuisine: 'Chinese & Indo-Chinese',
    rating: 4.1,
    avgPrepTime: 7,
    capacity: 4,
    location: 'Block C, Food Court',
    isOpen: true,
  },
  {
    id: 'v4',
    name: 'Pizza Planet',
    image: '🍕',
    cuisine: 'Pizza & Italian',
    rating: 4.6,
    avgPrepTime: 10,
    capacity: 3,
    location: 'Central Canteen',
    isOpen: true,
  },
  {
    id: 'v5',
    name: 'Green Bowl',
    image: '🥗',
    cuisine: 'Healthy & Salads',
    rating: 4.4,
    avgPrepTime: 5,
    capacity: 6,
    location: 'Block B, Level 1',
    isOpen: true,
  },
  {
    id: 'v6',
    name: 'Juice Junction',
    image: '🧃',
    cuisine: 'Juices & Smoothies',
    rating: 4.7,
    avgPrepTime: 3,
    capacity: 6,
    location: 'Near Library',
    isOpen: false,
  },
];

export const menuItems = [
  // Café Horizon
  { id: 'm1', vendorId: 'v1', name: 'Espresso', price: 80, prepTime: 2, category: 'Coffee', image: '☕', popular: true },
  { id: 'm2', vendorId: 'v1', name: 'Cappuccino', price: 120, prepTime: 3, category: 'Coffee', image: '☕', popular: true },
  { id: 'm3', vendorId: 'v1', name: 'Cold Brew', price: 150, prepTime: 2, category: 'Coffee', image: '🧊', popular: false },
  { id: 'm4', vendorId: 'v1', name: 'Veg Sandwich', price: 90, prepTime: 5, category: 'Snacks', image: '🥪', popular: true },
  { id: 'm5', vendorId: 'v1', name: 'Chocolate Muffin', price: 70, prepTime: 1, category: 'Snacks', image: '🧁', popular: false },
  { id: 'm6', vendorId: 'v1', name: 'Masala Chai', price: 40, prepTime: 3, category: 'Tea', image: '🍵', popular: true },

  // Desi Dhaba
  { id: 'm7', vendorId: 'v2', name: 'Butter Chicken + Rice', price: 180, prepTime: 10, category: 'Main', image: '🍛', popular: true },
  { id: 'm8', vendorId: 'v2', name: 'Paneer Tikka', price: 150, prepTime: 8, category: 'Starter', image: '🧀', popular: true },
  { id: 'm9', vendorId: 'v2', name: 'Dal Tadka + Roti', price: 120, prepTime: 7, category: 'Main', image: '🫘', popular: false },
  { id: 'm10', vendorId: 'v2', name: 'Chole Bhature', price: 100, prepTime: 6, category: 'Main', image: '🫓', popular: true },
  { id: 'm11', vendorId: 'v2', name: 'Lassi', price: 60, prepTime: 2, category: 'Drinks', image: '🥛', popular: false },

  // Dragon Wok
  { id: 'm12', vendorId: 'v3', name: 'Hakka Noodles', price: 120, prepTime: 7, category: 'Main', image: '🍜', popular: true },
  { id: 'm13', vendorId: 'v3', name: 'Manchurian Dry', price: 130, prepTime: 8, category: 'Starter', image: '🥟', popular: true },
  { id: 'm14', vendorId: 'v3', name: 'Fried Rice', price: 110, prepTime: 6, category: 'Main', image: '🍚', popular: true },
  { id: 'm15', vendorId: 'v3', name: 'Spring Rolls', price: 100, prepTime: 5, category: 'Starter', image: '🌯', popular: false },
  { id: 'm16', vendorId: 'v3', name: 'Chilli Paneer', price: 140, prepTime: 8, category: 'Starter', image: '🌶️', popular: false },

  // Pizza Planet
  { id: 'm17', vendorId: 'v4', name: 'Margherita Pizza', price: 200, prepTime: 12, category: 'Pizza', image: '🍕', popular: true },
  { id: 'm18', vendorId: 'v4', name: 'Pepperoni Slice', price: 150, prepTime: 8, category: 'Pizza', image: '🍕', popular: true },
  { id: 'm19', vendorId: 'v4', name: 'Garlic Bread', price: 100, prepTime: 6, category: 'Sides', image: '🧄', popular: true },
  { id: 'm20', vendorId: 'v4', name: 'Pasta Alfredo', price: 170, prepTime: 9, category: 'Pasta', image: '🍝', popular: false },

  // Green Bowl
  { id: 'm21', vendorId: 'v5', name: 'Caesar Salad', price: 160, prepTime: 4, category: 'Salad', image: '🥗', popular: true },
  { id: 'm22', vendorId: 'v5', name: 'Quinoa Bowl', price: 190, prepTime: 5, category: 'Bowl', image: '🥣', popular: true },
  { id: 'm23', vendorId: 'v5', name: 'Fruit Bowl', price: 120, prepTime: 3, category: 'Bowl', image: '🍇', popular: false },
  { id: 'm24', vendorId: 'v5', name: 'Protein Smoothie', price: 140, prepTime: 3, category: 'Drinks', image: '🥤', popular: true },

  // Juice Junction
  { id: 'm25', vendorId: 'v6', name: 'Orange Juice', price: 80, prepTime: 3, category: 'Juice', image: '🍊', popular: true },
  { id: 'm26', vendorId: 'v6', name: 'Mango Smoothie', price: 110, prepTime: 4, category: 'Smoothie', image: '🥭', popular: true },
  { id: 'm27', vendorId: 'v6', name: 'Green Detox', price: 130, prepTime: 3, category: 'Juice', image: '🥬', popular: false },
];