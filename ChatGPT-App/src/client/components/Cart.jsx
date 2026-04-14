/**
 * @file widget/components/Cart.jsx
 * @description Cart view displaying items, quantity controls, price summary
 *   and a "Place Order" button.
 *
 * Shows an empty-state illustration when the cart is empty with a
 * "Browse Restaurants" CTA.
 */

import React from 'react';
import VegBadge from './common/VegBadge.jsx';

/**
 * @param {object}   props
 * @param {object[]} props.cart        - Array of cart items.
 * @param {object}   props.totals      - `{ subtotal, deliveryFee, tax, total }`.
 * @param {function} props.onBack      - Navigate back (to menu or home).
 * @param {function} props.onUpdateQty - `(itemId: string, delta: number) => void`
 * @param {function} props.onPlaceOrder - Place the order.
 * @param {function} props.onGoHome    - Navigate to home (used in empty state).
 * @returns {React.ReactElement}
 */
export default function Cart({
  cart,
  totals,
  onBack,
  onUpdateQty,
  onPlaceOrder,
  onGoHome,
}) {
  const isEmpty = cart.length === 0;

  return (
    <div className="cart-view active">
      {/* Header */}
      <div className="menu-header">
        <button className="back-btn" onClick={onBack} type="button">
          ←
        </button>
        <div className="menu-restaurant-info">
          <h2>Your Cart</h2>
        </div>
      </div>

      {isEmpty ? (
        /* ── Empty state ── */
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <p>Your cart is empty</p>
          <button
            className="new-order-btn"
            onClick={onGoHome}
            type="button"
            style={{ marginTop: 16 }}
          >
            Browse Restaurants
          </button>
        </div>
      ) : (
        /* ── Cart items ── */
        <>
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <span style={{ fontSize: '1.5rem' }}>{item.emoji}</span>
              <div className="cart-item-info">
                <h4>
                  <VegBadge veg={item.veg} /> {item.name}
                </h4>
                <p>₹{item.price} each</p>
              </div>
              <div className="qty-control">
                <button
                  className="qty-btn"
                  onClick={() => onUpdateQty(item.id, -1)}
                  type="button"
                >
                  −
                </button>
                <span className="qty-val">{item.qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => onUpdateQty(item.id, 1)}
                  type="button"
                >
                  +
                </button>
              </div>
              <div className="cart-item-price">₹{item.price * item.qty}</div>
            </div>
          ))}

          {/* Summary */}
          <div className="cart-summary">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>₹{totals.subtotal}</span>
            </div>
            <div className="cart-summary-row">
              <span>Delivery Fee</span>
              <span>
                {totals.deliveryFee === 0 ? (
                  <span style={{ color: 'var(--green)' }}>FREE</span>
                ) : (
                  `₹${totals.deliveryFee}`
                )}
              </span>
            </div>
            <div className="cart-summary-row">
              <span>Taxes &amp; Charges</span>
              <span>₹{totals.tax}</span>
            </div>
            <div className="cart-summary-row total">
              <span>Grand Total</span>
              <span>₹{totals.total}</span>
            </div>
          </div>

          {/* Place Order */}
          <button
            className="place-order-btn"
            onClick={onPlaceOrder}
            type="button"
          >
            Place Order &bull; ₹{totals.total}
          </button>
        </>
      )}
    </div>
  );
}
