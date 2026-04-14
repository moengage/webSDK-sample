/**
 * @file widget/hooks/useCart.js
 * @description React hook for cart state management.
 *
 * Encapsulates the mutable cart array, quantity updates, cross-restaurant
 * clearing, and total calculations.  The hook is intentionally thin — it
 * manages local widget state only; server synchronisation happens via the
 * MCP bridge in the App component.
 */

import { useState, useCallback } from 'react';
import { findRestaurant, flattenMenu } from '../utils/menuUtils.js';

/** Minimum cart value for free delivery (in INR). */
const FREE_DELIVERY_THRESHOLD = 500;

/** Delivery fee when order total is below threshold (in INR). */
const DELIVERY_FEE = 40;

/** GST tax rate applied to subtotal. */
const TAX_RATE = 0.05;

/**
 * @typedef {object} CartItem
 * @property {string}  id             - Menu item ID (e.g. `'m1'`).
 * @property {string}  name           - Display name.
 * @property {number}  price          - Unit price in INR.
 * @property {string}  emoji          - Emoji icon.
 * @property {boolean} veg            - Whether the item is vegetarian.
 * @property {number}  qty            - Quantity in cart.
 * @property {string}  restaurantId   - Owning restaurant ID.
 * @property {string}  restaurantName - Owning restaurant display name.
 */

/**
 * @typedef {object} CartTotals
 * @property {number} subtotal    - Sum of (price * qty) for all items.
 * @property {number} deliveryFee - Delivery charge (free above INR 500).
 * @property {number} tax         - 5 % GST rounded to nearest integer.
 * @property {number} total       - Grand total (subtotal + delivery + tax).
 * @property {number} itemCount   - Sum of all item quantities.
 */

/**
 * Normalise a server-format cart item into the shape expected by the widget.
 *
 * The MCP server may return slightly different keys (`item_id`, `restaurant_id`,
 * `item_name`, `quantity`) than those used internally.  This function bridges
 * that gap by looking up the menu data when needed.
 *
 * @param {object} item - Raw cart item from the server.
 * @returns {CartItem}
 */
function normalizeCartItem(item) {
  // Already normalised
  if (item.restaurantId && item.emoji) return item;

  const restaurant = findRestaurant(item.restaurantId || item.restaurant_id);
  const menuItem = restaurant
    ? flattenMenu(restaurant).find((m) => m.id === (item.id || item.item_id))
    : null;

  return {
    id: item.id || item.item_id,
    name: item.name || item.item_name,
    price: item.price,
    emoji: menuItem?.emoji || item.emoji || '🍽️',
    veg: menuItem?.veg ?? item.veg ?? true,
    qty: item.qty || item.quantity || 1,
    restaurantId: item.restaurantId || item.restaurant_id,
    restaurantName: item.restaurantName || restaurant?.name || 'Restaurant',
  };
}

/**
 * Custom hook managing the widget's cart state.
 *
 * @returns {{
 *   cart:       CartItem[],
 *   addToCart:  (restaurantId: string, itemId: string) => boolean,
 *   updateQty: (itemId: string, delta: number) => void,
 *   clearCart:  () => void,
 *   cartTotals: () => CartTotals,
 *   syncCart:   (serverCart: object[]) => void,
 * }}
 */
export default function useCart() {
  /** @type {[CartItem[], Function]} */
  const [cart, setCart] = useState([]);

  // ── addToCart ──────────────────────────────────────────────────────────────
  /**
   * Add a menu item to the cart (or increment its quantity).
   *
   * If the cart already contains items from a *different* restaurant the cart
   * is cleared first (multi-restaurant orders are not supported).  Returns
   * `false` when a cross-restaurant prompt would have been shown in the
   * vanilla version — the caller may use `window.confirm` before invoking.
   *
   * @param {string} restaurantId
   * @param {string} itemId
   * @returns {boolean} `true` when the item was added, `false` when blocked.
   */
  const addToCart = useCallback((restaurantId, itemId) => {
    const restaurant = findRestaurant(restaurantId);
    if (!restaurant) return false;
    const item = flattenMenu(restaurant).find((m) => m.id === itemId);
    if (!item) return false;

    setCart((prev) => {
      let next = [...prev];

      // Clear if switching restaurants
      if (next.length > 0 && next[0].restaurantId !== restaurantId) {
        next = [];
      }

      const existing = next.find((c) => c.id === itemId);
      if (existing) {
        return next.map((c) =>
          c.id === itemId ? { ...c, qty: c.qty + 1 } : c,
        );
      }

      return [
        ...next,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          emoji: item.emoji,
          veg: item.veg,
          qty: 1,
          restaurantId,
          restaurantName: restaurant.name,
        },
      ];
    });

    return true;
  }, []);

  // ── updateQty ─────────────────────────────────────────────────────────────
  /**
   * Change the quantity of a cart item by `delta`.  Removes the item when the
   * resulting quantity drops to zero or below.
   *
   * @param {string} itemId
   * @param {number} delta - Positive to increase, negative to decrease.
   */
  const updateQty = useCallback((itemId, delta) => {
    setCart((prev) => {
      const updated = prev
        .map((c) => (c.id === itemId ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0);
      return updated;
    });
  }, []);

  // ── clearCart ──────────────────────────────────────────────────────────────
  /**
   * Empty the cart entirely.
   */
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // ── cartTotals ────────────────────────────────────────────────────────────
  /**
   * Derive order totals from the current cart contents.
   *
   * @returns {CartTotals}
   */
  const cartTotals = useCallback(() => {
    const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
    const deliveryFee = subtotal > FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + deliveryFee + tax;
    const itemCount = cart.reduce((sum, c) => sum + c.qty, 0);
    return { subtotal, deliveryFee, tax, total, itemCount };
  }, [cart]);

  // ── syncCart ──────────────────────────────────────────────────────────────
  /**
   * Overwrite the local cart with data received from the server, normalising
   * each item into the widget's internal format.
   *
   * @param {object[]} serverCart - Array of cart items from an MCP tool response.
   */
  const syncCart = useCallback((serverCart) => {
    if (!Array.isArray(serverCart)) return;
    setCart(serverCart.map(normalizeCartItem));
  }, []);

  return {
    cart,
    addToCart,
    updateQty,
    clearCart,
    cartTotals,
    syncCart,
  };
}
