/**
 * @file widget/components/Menu.jsx
 * @description Restaurant menu view.
 *
 * Displays the restaurant header info, a back button, cart button and two
 * menu sections (Recommended + Sides & Extras) built from `MenuItem` rows.
 */

import React from 'react';
import MenuItem from './MenuItem.jsx';

/**
 * Render a titled section of menu items.
 *
 * @param {string}   title      - Section heading.
 * @param {object[]} items      - Array of menu item data.
 * @param {object}   restaurant - Parent restaurant.
 * @param {object[]} cart       - Current cart array.
 * @param {function} onAdd      - Add-to-cart callback.
 * @returns {React.ReactElement}
 */
function MenuSection({ title, items, restaurant, cart, onAdd }) {
  return (
    <>
      <div className="menu-section-title">
        {title} ({items.length})
      </div>
      <div className="menu-items">
        {items.map((item) => {
          const inCart = cart.find((c) => c.id === item.id);
          return (
            <MenuItem
              key={item.id}
              item={item}
              restaurant={restaurant}
              inCartQty={inCart ? inCart.qty : 0}
              onAdd={onAdd}
            />
          );
        })}
      </div>
    </>
  );
}

/**
 * @param {object}   props
 * @param {object}   props.restaurant    - Restaurant data object.
 * @param {object[]} props.cart          - Current cart contents.
 * @param {function} props.onBack        - Navigate back to home.
 * @param {function} props.onCartClick   - Navigate to cart view.
 * @param {function} props.onAddToCart   - `(restaurantId, itemId) => void`
 * @param {number}   props.cartItemCount - Total quantity badge value.
 * @returns {React.ReactElement}
 */
export default function Menu({
  restaurant,
  cart,
  onBack,
  onCartClick,
  onAddToCart,
  cartItemCount,
}) {
  if (!restaurant) return null;

  return (
    <div className="menu-view active">
      {/* Sticky header */}
      <div className="menu-header">
        <button className="back-btn" onClick={onBack} type="button">
          ←
        </button>
        <div className="menu-restaurant-info">
          <h2>{restaurant.name}</h2>
          <p>
            {restaurant.cuisine} &bull; {restaurant.deliveryTime}
          </p>
        </div>
        <button
          className="cart-btn"
          onClick={onCartClick}
          type="button"
          style={{ marginLeft: 'auto' }}
        >
          🛒{' '}
          <span
            className={`cart-badge${cartItemCount > 0 ? ' visible' : ''}`}
          >
            {cartItemCount}
          </span>
        </button>
      </div>

      {/* Menu sections */}
      <MenuSection
        title="Recommended"
        items={restaurant.menu?.recommended ?? []}
        restaurant={restaurant}
        cart={cart}
        onAdd={onAddToCart}
      />
      <MenuSection
        title="Sides & Extras"
        items={restaurant.menu?.sides ?? []}
        restaurant={restaurant}
        cart={cart}
        onAdd={onAddToCart}
      />
    </div>
  );
}
