/**
 * @file widget/components/OrderConfirmation.jsx
 * @description Order tracking / confirmation view.
 *
 * Displays a check-mark animation, order ID, animated tracking dots, four
 * tracking steps (Confirmed, Prepared, Delivery, Delivered), an order
 * summary and an "Order More" CTA.
 */

import React, { useMemo } from 'react';

/**
 * Tracking step configuration.
 * @type {{ icon: string, label: string, done: boolean }[]}
 */
const TRACKING_STEPS = [
  { icon: '✓', label: 'Order Confirmed', done: true },
  { icon: '👨‍🍳', label: 'Being Prepared', done: true },
  { icon: '🛵', label: 'Out for Delivery', done: false },
  { icon: '📦', label: 'Delivered', done: false },
];

/**
 * @param {object}   props
 * @param {object}   props.order       - Order data.
 * @param {string}   props.order.orderId       - Unique order reference.
 * @param {string}   props.order.restaurant    - Restaurant name.
 * @param {number}   props.order.itemCount     - Total item count.
 * @param {number}   props.order.total         - Grand total in INR.
 * @param {function} props.onNewOrder  - Navigate back to home for another order.
 * @returns {React.ReactElement}
 */
export default function OrderConfirmation({ order, onNewOrder }) {
  if (!order) return null;

  const orderId = useMemo(
    () => order.orderId || 'FD' + Date.now().toString(36).toUpperCase(),
    [order.orderId],
  );

  return (
    <div className="order-confirmation active">
      {/* Success icon */}
      <div className="check-icon">✓</div>

      <h2>Order Placed!</h2>
      <p>Your food is being prepared</p>

      {/* Order ID */}
      <div className="order-id">Order #{orderId}</div>

      {/* Animated tracking dots */}
      <div className="track-anim">
        <div className="track-dot" />
        <div className="track-dot" />
        <div className="track-dot" />
        <div className="track-dot" />
      </div>

      {/* Tracking steps */}
      <div className="track-status">
        {TRACKING_STEPS.map((step, i) => (
          <div className="track-step" key={i}>
            <div
              className={`track-step-icon ${step.done ? 'done' : 'pending'}`}
            >
              {step.icon}
            </div>
            <span
              className={`track-step-text ${step.done ? 'done' : 'pending'}`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Order summary */}
      <p
        style={{
          marginTop: 16,
          fontSize: '0.85rem',
          color: 'var(--gray-500)',
        }}
      >
        From <strong>{order.restaurant || 'Restaurant'}</strong> &bull;{' '}
        {order.itemCount || 0} items &bull; ₹{order.total || 0}
      </p>

      {/* CTA */}
      <button
        className="new-order-btn"
        onClick={onNewOrder}
        type="button"
      >
        Order More
      </button>
    </div>
  );
}
