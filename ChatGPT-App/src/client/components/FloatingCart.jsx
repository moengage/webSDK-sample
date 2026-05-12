/**
 * @file widget/components/FloatingCart.jsx
 * @description Sticky bottom bar that shows a cart summary when items exist
 *   and the user is not already viewing the cart or order screens.
 *
 * The bar displays item count, restaurant name, total price and a
 * right-arrow indicator.
 */

import React, { useMemo } from 'react';

/**
 * @param {object}   props
 * @param {object[]} props.cart        - Current cart items.
 * @param {string}   props.currentView - Active view name (`'home'|'menu'|'cart'|'order'`).
 * @param {function} props.onClick     - Navigate to cart view.
 * @returns {React.ReactElement|null}
 */
export default function FloatingCart({ cart, currentView, onClick }) {
  const { count, total } = useMemo(() => {
    const count = cart.reduce((sum, c) => sum + c.qty, 0);
    const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
    return { count, total };
  }, [cart]);

  const visible =
    count > 0 && currentView !== 'cart' && currentView !== 'order';

  if (!visible) return null;

  return (
    <div
      className="floating-cart visible"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
    >
      <div className="floating-cart-left">
        <span>
          {count} item{count > 1 ? 's' : ''}
        </span>
        <small>{cart[0]?.restaurantName || ''}</small>
      </div>
      <div className="floating-cart-right">
        <span>₹{total}</span> →
      </div>
    </div>
  );
}
