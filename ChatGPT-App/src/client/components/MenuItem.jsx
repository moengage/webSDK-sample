/**
 * @file widget/components/MenuItem.jsx
 * @description Individual menu item row with emoji, name, veg badge,
 *   description, price and an ADD button.
 *
 * When the item is already in the cart the button shows "Added (qty)" with
 * a green highlight.
 */

import React from 'react';
import VegBadge from './common/VegBadge.jsx';

/**
 * @param {object}   props
 * @param {object}   props.item       - Menu item data from `constants/restaurants.js`.
 * @param {object}   props.restaurant - Parent restaurant data object.
 * @param {number}   props.inCartQty  - Current quantity in cart (0 if absent).
 * @param {function} props.onAdd      - `(restaurantId, itemId) => void`
 * @returns {React.ReactElement}
 */
export default function MenuItem({ item, restaurant, inCartQty, onAdd }) {
  const isAdded = inCartQty > 0;

  return (
    <div className="menu-item">
      <div className="menu-item-icon" style={{ background: item.bg }}>
        {item.emoji}
      </div>
      <div className="menu-item-details">
        <h4>
          <VegBadge veg={item.veg} /> {item.name}
        </h4>
        <div className="item-desc">{item.desc}</div>
        <div className="item-price">₹{item.price}</div>
      </div>
      <button
        className={`add-btn${isAdded ? ' added' : ''}`}
        onClick={() => onAdd(restaurant.id, item.id)}
        type="button"
      >
        {isAdded ? `Added (${inCartQty})` : 'ADD'}
      </button>
    </div>
  );
}
