/**
 * @file data/menus.js
 * @description Static menu data for all restaurants.
 *
 * Each restaurant has two sections: `recommended` (main dishes) and
 * `sides` (extras). Items include price, veg/non-veg flag, emoji, and
 * background color for the widget UI.
 *
 * The `flattenMenu()` helper merges both sections into a single array,
 * used by search and add-to-cart tools for item lookups.
 */

export const MENUS = {
  r1: {
    recommended: [
      { id: "m1", name: "Hyderabadi Chicken Biryani", desc: "Aromatic basmati rice with tender chicken", price: 299, emoji: "🍗", veg: false, bg: "#fee2e2" },
      { id: "m2", name: "Paneer Biryani", desc: "Rich creamy paneer with fragrant rice", price: 249, emoji: "🧀", veg: true, bg: "#dcfce7" },
      { id: "m3", name: "Mutton Biryani", desc: "Slow-cooked mutton with saffron rice", price: 399, emoji: "🍖", veg: false, bg: "#fef3c7" },
    ],
    sides: [
      { id: "m4", name: "Raita", desc: "Cooling yogurt with spices", price: 59, emoji: "🥣", veg: true, bg: "#dbeafe" },
      { id: "m5", name: "Mirchi Ka Salan", desc: "Spicy chili gravy", price: 129, emoji: "🌶️", veg: true, bg: "#fee2e2" },
    ],
  },
  r2: {
    recommended: [
      { id: "m6", name: "Farmhouse Pizza", desc: "Loaded with fresh veggies and cheese", price: 349, emoji: "🍕", veg: true, bg: "#dcfce7" },
      { id: "m7", name: "Pepperoni Feast", desc: "Classic pepperoni with mozzarella", price: 449, emoji: "🍕", veg: false, bg: "#fee2e2" },
      { id: "m8", name: "Margherita", desc: "Simple, classic, delicious", price: 199, emoji: "🍕", veg: true, bg: "#fef9c3" },
    ],
    sides: [
      { id: "m9", name: "Garlic Bread", desc: "Crispy with garlic butter", price: 129, emoji: "🍞", veg: true, bg: "#fef3c7" },
      { id: "m10", name: "Cheesy Dip Sticks", desc: "Stuffed breadsticks with cheese", price: 159, emoji: "🧀", veg: true, bg: "#fff7ed" },
    ],
  },
  r3: {
    recommended: [
      { id: "m11", name: "Hakka Noodles", desc: "Stir-fried noodles with vegetables", price: 199, emoji: "🍝", veg: true, bg: "#dcfce7" },
      { id: "m12", name: "Chicken Manchurian", desc: "Crispy chicken in tangy sauce", price: 279, emoji: "🍗", veg: false, bg: "#fee2e2" },
      { id: "m13", name: "Veg Fried Rice", desc: "Wok-tossed rice with vegetables", price: 179, emoji: "🍚", veg: true, bg: "#fef9c3" },
    ],
    sides: [
      { id: "m14", name: "Spring Rolls", desc: "Crispy rolls with veggie filling", price: 149, emoji: "🥟", veg: true, bg: "#fef3c7" },
      { id: "m15", name: "Hot & Sour Soup", desc: "Spicy and tangy broth", price: 119, emoji: "🥣", veg: true, bg: "#dbeafe" },
    ],
  },
  r4: {
    recommended: [
      { id: "m16", name: "Caesar Salad", desc: "Romaine lettuce with parmesan", price: 249, emoji: "🥗", veg: true, bg: "#dcfce7" },
      { id: "m17", name: "Quinoa Power Bowl", desc: "Quinoa, avocado, chickpeas", price: 299, emoji: "🥙", veg: true, bg: "#fef9c3" },
      { id: "m18", name: "Smoothie Bowl", desc: "Acai with fresh fruits", price: 229, emoji: "🍇", veg: true, bg: "#f3e8ff" },
    ],
    sides: [
      { id: "m19", name: "Fresh Juice", desc: "Cold-pressed orange juice", price: 99, emoji: "🧃", veg: true, bg: "#fff7ed" },
      { id: "m20", name: "Hummus & Pita", desc: "Creamy hummus with warm pita", price: 149, emoji: "🫓", veg: true, bg: "#fef3c7" },
    ],
  },
  r5: {
    recommended: [
      { id: "m21", name: "Classic Smash Burger", desc: "Beef patty with special sauce", price: 299, emoji: "🍔", veg: false, bg: "#fee2e2" },
      { id: "m22", name: "Crispy Chicken Burger", desc: "Crunchy fried chicken fillet", price: 249, emoji: "🍔", veg: false, bg: "#fef3c7" },
      { id: "m23", name: "Veggie Delight Burger", desc: "Plant-based patty with fresh veggies", price: 199, emoji: "🍔", veg: true, bg: "#dcfce7" },
    ],
    sides: [
      { id: "m24", name: "Loaded Fries", desc: "Cheese and jalapeno fries", price: 149, emoji: "🍟", veg: true, bg: "#fef9c3" },
      { id: "m25", name: "Chocolate Shake", desc: "Thick and creamy", price: 129, emoji: "🥤", veg: true, bg: "#f3e8ff" },
    ],
  },
  r6: {
    recommended: [
      { id: "m26", name: "Masala Chai", desc: "Authentic Indian spiced tea", price: 49, emoji: "☕", veg: true, bg: "#fff7ed" },
      { id: "m27", name: "Cold Coffee", desc: "Chilled coffee with ice cream", price: 129, emoji: "🧊", veg: true, bg: "#dbeafe" },
      { id: "m28", name: "Samosa (2 pcs)", desc: "Crispy potato-filled pastry", price: 59, emoji: "🥟", veg: true, bg: "#fef3c7" },
    ],
    sides: [
      { id: "m29", name: "Vada Pav", desc: "Mumbai-style spicy potato bun", price: 39, emoji: "🍔", veg: true, bg: "#fef9c3" },
      { id: "m30", name: "Bread Pakora", desc: "Deep-fried stuffed bread", price: 49, emoji: "🍞", veg: true, bg: "#fee2e2" },
    ],
  },
};

/**
 * Flatten a restaurant's menu (recommended + sides) into a single array.
 * @param {string} restaurantId — Restaurant ID (e.g. "r1")
 * @returns {Array} All menu items for the restaurant
 */
export function flattenMenu(restaurantId) {
  const menu = MENUS[restaurantId];
  if (!menu) return [];
  return [...(menu.recommended || []), ...(menu.sides || [])];
}
