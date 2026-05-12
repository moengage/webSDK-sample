/**
 * @file data/restaurants.js
 * @description Static restaurant and category data — single source of truth.
 *
 * IMPORTANT: The widget (iframe) cannot import server modules. The widget
 * has its own copy of this data inline in the React components. If you add
 * or change restaurants here, update the widget data too.
 */

export const CATEGORIES = [
  { emoji: "🍔", name: "Burgers", bg: "#fef3c7" },
  { emoji: "🍕", name: "Pizza", bg: "#fee2e2" },
  { emoji: "🍜", name: "Chinese", bg: "#fce7f3" },
  { emoji: "🍱", name: "Thali", bg: "#dbeafe" },
  { emoji: "🍛", name: "Biryani", bg: "#fef9c3" },
  { emoji: "🥗", name: "Salads", bg: "#dcfce7" },
  { emoji: "🧁", name: "Desserts", bg: "#f3e8ff" },
  { emoji: "☕", name: "Cafe", bg: "#fff7ed" },
];

export const RESTAURANTS = [
  {
    id: "r1",
    name: "Biryani Blues",
    cuisine: "Biryani, North Indian, Mughlai",
    rating: 4.3,
    deliveryTime: "25-30 min",
    priceRange: "₹300 for two",
    offer: "40% OFF up to ₹80",
    emoji: "🍛",
    bg: "#fef9c3",
    pureVeg: false,
  },
  {
    id: "r2",
    name: "Pizza Paradise",
    cuisine: "Pizza, Italian, Fast Food",
    rating: 4.5,
    deliveryTime: "20-25 min",
    priceRange: "₹400 for two",
    offer: "60% OFF up to ₹120",
    emoji: "🍕",
    bg: "#fee2e2",
    pureVeg: false,
  },
  {
    id: "r3",
    name: "Dragon Wok",
    cuisine: "Chinese, Asian, Thai",
    rating: 4.1,
    deliveryTime: "30-35 min",
    priceRange: "₹350 for two",
    offer: "30% OFF up to ₹75",
    emoji: "🍜",
    bg: "#fce7f3",
    pureVeg: false,
  },
  {
    id: "r4",
    name: "Green Bowl",
    cuisine: "Salads, Healthy, Bowls",
    rating: 4.6,
    deliveryTime: "15-20 min",
    priceRange: "₹250 for two",
    offer: "20% OFF up to ₹50",
    emoji: "🥗",
    bg: "#dcfce7",
    pureVeg: true,
  },
  {
    id: "r5",
    name: "Burger Junction",
    cuisine: "Burgers, American, Fast Food",
    rating: 4.2,
    deliveryTime: "20-30 min",
    priceRange: "₹500 for two",
    offer: "50% OFF up to ₹100",
    emoji: "🍔",
    bg: "#fef3c7",
    pureVeg: false,
  },
  {
    id: "r6",
    name: "Chai & Co",
    cuisine: "Cafe, Beverages, Snacks",
    rating: 4.4,
    deliveryTime: "10-15 min",
    priceRange: "₹150 for two",
    offer: "FREE delivery",
    emoji: "☕",
    bg: "#fff7ed",
    pureVeg: true,
  },
];
