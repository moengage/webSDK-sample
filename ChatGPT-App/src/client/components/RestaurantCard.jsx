/**
 * @file widget/components/RestaurantCard.jsx
 * @description Individual restaurant card for the home listing.
 *
 * Displays the restaurant emoji, offer tag, name, rating badge, delivery
 * time, price range and cuisine tags.  The entire card is clickable.
 */

import React from 'react';

/**
 * @param {object}   props
 * @param {object}   props.restaurant - Restaurant data object from `constants/restaurants.js`.
 * @param {function} props.onClick    - Invoked with the restaurant object when clicked.
 * @returns {React.ReactElement}
 */
export default function RestaurantCard({ restaurant, onClick }) {
  return (
    <div
      className="restaurant-card"
      onClick={() => onClick(restaurant)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick(restaurant);
      }}
    >
      <div className="restaurant-img" style={{ background: restaurant.bg }}>
        {restaurant.emoji}
        {restaurant.offer && <span className="offer-tag">{restaurant.offer}</span>}
      </div>
      <div className="restaurant-info">
        <h3>{restaurant.name}</h3>
        <div className="restaurant-meta">
          <span className="rating">★ {restaurant.rating}</span>
          <span>{restaurant.deliveryTime}</span>
          <span>{restaurant.priceRange}</span>
        </div>
        <div className="restaurant-tags">{restaurant.cuisine}</div>
      </div>
    </div>
  );
}
