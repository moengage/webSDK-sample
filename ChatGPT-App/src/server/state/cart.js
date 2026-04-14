/**
 * @file state/cart.js
 * @description Mutable cart and order state shared across MCP requests.
 *
 * State is module-level (persists across requests within one server process).
 * Each request creates a fresh McpServer but they all share this module's
 * state, which is how the cart persists across tool calls.
 *
 * The widget also has its own client-side cart state that gets synced
 * via the `update_cart` action in structuredContent.
 */

let cart = [];
let orders = [];
let nextOrderId = 1;

// ── Cart ──

/** Get the current cart items. */
export function getCart() {
  return cart;
}

/** Add an item to the cart (or increment quantity if it exists). */
export function addItem({ id, name, price, qty, emoji, veg, restaurantId, restaurantName }) {
  const existing = cart.find((c) => c.id === id);
  if (existing) {
    existing.qty = qty || existing.qty + 1;
  } else {
    cart.push({ id, name, price, qty: qty || 1, emoji, veg, restaurantId, restaurantName });
  }
}

/** Clear all items from the cart. */
export function clearCart() {
  cart = [];
}

/** Get the total price of all items in the cart. */
export function getCartTotal() {
  return cart.reduce((sum, c) => sum + c.price * c.qty, 0);
}

/** Get the total number of items in the cart. */
export function getCartItemCount() {
  return cart.reduce((sum, c) => sum + c.qty, 0);
}

// ── Orders ──

/**
 * Create an order from the current cart (or provided items).
 * Clears the cart after order creation.
 */
export function createOrder({ restaurant, items, total }) {
  const orderId = `FD${(nextOrderId++).toString().padStart(4, "0")}`;
  const order = {
    orderId,
    restaurant: restaurant || "Restaurant",
    items: items || cart,
    total: total || getCartTotal(),
    itemCount: (items || cart).reduce((s, i) => s + (i.qty || i.quantity || 0), 0),
    status: "confirmed",
    estimatedDelivery: "30-40 min",
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  clearCart();
  return order;
}

/** Find an order by ID, or return the most recent order. */
export function findOrder(orderId) {
  if (orderId) return orders.find((o) => o.orderId === orderId);
  return orders[orders.length - 1];
}
