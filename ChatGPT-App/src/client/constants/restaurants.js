/**
 * @file widget/constants/restaurants.js
 * @description Static restaurant and category data for the food delivery widget.
 *
 * This is a copy of server-side data/restaurants.js + categories subset.
 * The widget runs in an iframe and cannot import server modules, so data
 * must be duplicated here. Keep both copies in sync when adding restaurants.
 */

/**
 * Food categories for browsing by type.
 * @type {Array<{ emoji: string, name: string, bg: string }>}
 */
export const CATEGORIES = [
  { emoji: '🍔', name: 'Burgers', bg: '#fef3c7' },
  { emoji: '🍕', name: 'Pizza',   bg: '#fee2e2' },
  { emoji: '🍜', name: 'Chinese', bg: '#fce7f3' },
  { emoji: '🍱', name: 'Thali',   bg: '#dbeafe' },
  { emoji: '🍛', name: 'Biryani', bg: '#fef9c3' },
  { emoji: '🥗', name: 'Salads',  bg: '#dcfce7' },
  { emoji: '🧁', name: 'Desserts',bg: '#f3e8ff' },
  { emoji: '☕', name: 'Cafe',    bg: '#fff7ed' },
];

/**
 * All available restaurants with nested menu structure.
 * @type {Array<{ id, name, cuisine, rating, deliveryTime, priceRange, offer, emoji, bg, pureVeg, menu }>}
 */
export const RESTAURANTS = [
  {
    id: 'r1', name: 'Biryani Blues', cuisine: 'Biryani, North Indian, Mughlai',
    rating: 4.3, deliveryTime: '25-30 min', priceRange: '₹300 for two',
    offer: '40% OFF up to ₹80', emoji: '🍛', bg: '#fef9c3', pureVeg: false,
    menu: {
      recommended: [
        { id: 'm1', name: 'Hyderabadi Chicken Biryani', desc: 'Aromatic basmati rice with tender chicken', price: 299, emoji: '🍗', veg: false, bg: '#fee2e2' },
        { id: 'm2', name: 'Paneer Biryani', desc: 'Rich creamy paneer with fragrant rice', price: 249, emoji: '🧀', veg: true, bg: '#dcfce7' },
        { id: 'm3', name: 'Mutton Biryani', desc: 'Slow-cooked mutton with saffron rice', price: 399, emoji: '🍖', veg: false, bg: '#fef3c7' },
      ],
      sides: [
        { id: 'm4', name: 'Raita', desc: 'Cooling yogurt with spices', price: 59, emoji: '🥣', veg: true, bg: '#dbeafe' },
        { id: 'm5', name: 'Mirchi Ka Salan', desc: 'Spicy chili gravy', price: 129, emoji: '🌶️', veg: true, bg: '#fee2e2' },
      ]
    }
  },
  {
    id: 'r2', name: 'Pizza Paradise', cuisine: 'Pizza, Italian, Fast Food',
    rating: 4.5, deliveryTime: '20-25 min', priceRange: '₹400 for two',
    offer: '60% OFF up to ₹120', emoji: '🍕', bg: '#fee2e2', pureVeg: false,
    menu: {
      recommended: [
        { id: 'm6', name: 'Farmhouse Pizza', desc: 'Loaded with fresh veggies and cheese', price: 349, emoji: '🍕', veg: true, bg: '#dcfce7' },
        { id: 'm7', name: 'Pepperoni Feast', desc: 'Classic pepperoni with mozzarella', price: 449, emoji: '🍕', veg: false, bg: '#fee2e2' },
        { id: 'm8', name: 'Margherita', desc: 'Simple, classic, delicious', price: 199, emoji: '🍕', veg: true, bg: '#fef9c3' },
      ],
      sides: [
        { id: 'm9', name: 'Garlic Bread', desc: 'Crispy with garlic butter', price: 129, emoji: '🍞', veg: true, bg: '#fef3c7' },
        { id: 'm10', name: 'Cheesy Dip Sticks', desc: 'Stuffed breadsticks with cheese', price: 159, emoji: '🧀', veg: true, bg: '#fff7ed' },
      ]
    }
  },
  {
    id: 'r3', name: 'Dragon Wok', cuisine: 'Chinese, Asian, Thai',
    rating: 4.1, deliveryTime: '30-35 min', priceRange: '₹350 for two',
    offer: '30% OFF up to ₹75', emoji: '🍜', bg: '#fce7f3', pureVeg: false,
    menu: {
      recommended: [
        { id: 'm11', name: 'Hakka Noodles', desc: 'Stir-fried noodles with vegetables', price: 199, emoji: '🍝', veg: true, bg: '#dcfce7' },
        { id: 'm12', name: 'Chicken Manchurian', desc: 'Crispy chicken in tangy sauce', price: 279, emoji: '🍗', veg: false, bg: '#fee2e2' },
        { id: 'm13', name: 'Veg Fried Rice', desc: 'Wok-tossed rice with vegetables', price: 179, emoji: '🍚', veg: true, bg: '#fef9c3' },
      ],
      sides: [
        { id: 'm14', name: 'Spring Rolls', desc: 'Crispy rolls with veggie filling', price: 149, emoji: '🥟', veg: true, bg: '#fef3c7' },
        { id: 'm15', name: 'Hot & Sour Soup', desc: 'Spicy and tangy broth', price: 119, emoji: '🥣', veg: true, bg: '#dbeafe' },
      ]
    }
  },
  {
    id: 'r4', name: 'Green Bowl', cuisine: 'Salads, Healthy, Bowls',
    rating: 4.6, deliveryTime: '15-20 min', priceRange: '₹250 for two',
    offer: '20% OFF up to ₹50', emoji: '🥗', bg: '#dcfce7', pureVeg: true,
    menu: {
      recommended: [
        { id: 'm16', name: 'Caesar Salad', desc: 'Romaine lettuce with parmesan', price: 249, emoji: '🥗', veg: true, bg: '#dcfce7' },
        { id: 'm17', name: 'Quinoa Power Bowl', desc: 'Quinoa, avocado, chickpeas', price: 299, emoji: '🥙', veg: true, bg: '#fef9c3' },
        { id: 'm18', name: 'Smoothie Bowl', desc: 'Acai with fresh fruits', price: 229, emoji: '🍇', veg: true, bg: '#f3e8ff' },
      ],
      sides: [
        { id: 'm19', name: 'Fresh Juice', desc: 'Cold-pressed orange juice', price: 99, emoji: '🧃', veg: true, bg: '#fff7ed' },
        { id: 'm20', name: 'Hummus & Pita', desc: 'Creamy hummus with warm pita', price: 149, emoji: '🫓', veg: true, bg: '#fef3c7' },
      ]
    }
  },
  {
    id: 'r5', name: 'Burger Junction', cuisine: 'Burgers, American, Fast Food',
    rating: 4.2, deliveryTime: '20-30 min', priceRange: '₹500 for two',
    offer: '50% OFF up to ₹100', emoji: '🍔', bg: '#fef3c7', pureVeg: false,
    menu: {
      recommended: [
        { id: 'm21', name: 'Classic Smash Burger', desc: 'Beef patty with special sauce', price: 299, emoji: '🍔', veg: false, bg: '#fee2e2' },
        { id: 'm22', name: 'Crispy Chicken Burger', desc: 'Crunchy fried chicken fillet', price: 249, emoji: '🍔', veg: false, bg: '#fef3c7' },
        { id: 'm23', name: 'Veggie Delight Burger', desc: 'Plant-based patty with fresh veggies', price: 199, emoji: '🍔', veg: true, bg: '#dcfce7' },
      ],
      sides: [
        { id: 'm24', name: 'Loaded Fries', desc: 'Cheese and jalapeno fries', price: 149, emoji: '🍟', veg: true, bg: '#fef9c3' },
        { id: 'm25', name: 'Chocolate Shake', desc: 'Thick and creamy', price: 129, emoji: '🥤', veg: true, bg: '#f3e8ff' },
      ]
    }
  },
  {
    id: 'r6', name: 'Chai & Co', cuisine: 'Cafe, Beverages, Snacks',
    rating: 4.4, deliveryTime: '10-15 min', priceRange: '₹150 for two',
    offer: 'FREE delivery', emoji: '☕', bg: '#fff7ed', pureVeg: true,
    menu: {
      recommended: [
        { id: 'm26', name: 'Masala Chai', desc: 'Authentic Indian spiced tea', price: 49, emoji: '☕', veg: true, bg: '#fff7ed' },
        { id: 'm27', name: 'Cold Coffee', desc: 'Chilled coffee with ice cream', price: 129, emoji: '🧊', veg: true, bg: '#dbeafe' },
        { id: 'm28', name: 'Samosa (2 pcs)', desc: 'Crispy potato-filled pastry', price: 59, emoji: '🥟', veg: true, bg: '#fef3c7' },
      ],
      sides: [
        { id: 'm29', name: 'Vada Pav', desc: 'Mumbai-style spicy potato bun', price: 39, emoji: '🍔', veg: true, bg: '#fef9c3' },
        { id: 'm30', name: 'Bread Pakora', desc: 'Deep-fried stuffed bread', price: 49, emoji: '🍞', veg: true, bg: '#fee2e2' },
      ]
    }
  }
];
