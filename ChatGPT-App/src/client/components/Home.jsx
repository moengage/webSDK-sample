/**
 * @file widget/components/Home.jsx
 * @description Home view — category chips, offer banner, filter tabs and
 *   restaurant listing.
 *
 * Filtering and search are handled locally using the static `RESTAURANTS`
 * array from `constants/restaurants.js`.
 */

import React, { useMemo } from 'react';
import { CATEGORIES, RESTAURANTS } from '../constants/restaurants.js';
import RestaurantCard from './RestaurantCard.jsx';

/** Available filter tabs. */
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'fast-delivery', label: 'Fast Delivery' },
  { key: 'top-rated', label: 'Top Rated' },
  { key: 'offers', label: 'Offers' },
  { key: 'pure-veg', label: 'Pure Veg' },
];

/**
 * @param {object}   props
 * @param {function} props.onRestaurantClick - `(restaurant) => void`
 * @param {function} props.onCategoryClick   - `(categoryName: string) => void`
 * @param {function} props.onFilterChange    - `(filterKey: string) => void`
 * @param {string}   props.searchQuery       - Current search string.
 * @param {string}   props.activeFilter      - Active filter tab key.
 * @param {function} props.trackEvent        - MoEngage `trackEvent` helper.
 * @returns {React.ReactElement}
 */
export default function Home({
  onRestaurantClick,
  onCategoryClick,
  onFilterChange,
  searchQuery,
  activeFilter,
  trackEvent,
}) {
  /** Derive the filtered + sorted restaurant list. */
  const filteredRestaurants = useMemo(() => {
    let list = [...RESTAURANTS];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q),
      );
    }

    switch (activeFilter) {
      case 'fast-delivery':
        list.sort((a, b) => parseInt(a.deliveryTime, 10) - parseInt(b.deliveryTime, 10));
        break;
      case 'top-rated':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'pure-veg':
        list = list.filter((r) => r.pureVeg);
        break;
      case 'offers':
        list = list.filter((r) => r.offer);
        break;
      default:
        break;
    }

    return list;
  }, [searchQuery, activeFilter]);

  /** Handle filter tab click. */
  const handleFilterClick = (key) => {
    if (typeof trackEvent === 'function') {
      trackEvent('filter_applied', { filter: key });
    }
    onFilterChange(key);
  };

  /** Handle offer banner click. */
  const handleOfferBannerClick = () => {
    if (typeof trackEvent === 'function') {
      trackEvent('offer_banner_clicked', { code: 'WELCOME50' });
    }
  };

  return (
    <div className="home-view">
      {/* Filter Tabs */}
      <div className="nav-tabs">
        {FILTERS.map((f) => (
          <div
            key={f.key}
            className={`nav-tab${activeFilter === f.key ? ' active' : ''}`}
            onClick={() => handleFilterClick(f.key)}
            role="tab"
            aria-selected={activeFilter === f.key}
          >
            {f.label}
          </div>
        ))}
      </div>

      {/* Category Chips */}
      <div className="categories">
        {CATEGORIES.map((c) => (
          <div
            key={c.name}
            className="category-chip"
            onClick={() => onCategoryClick(c.name)}
          >
            <div className="category-icon" style={{ background: c.bg }}>
              {c.emoji}
            </div>
            <span>{c.name}</span>
          </div>
        ))}
      </div>

      {/* Offer Banner */}
      <div className="offer-banner" onClick={handleOfferBannerClick}>
        <h3>50% OFF up to ₹100</h3>
        <p>On your first order</p>
        <span className="offer-code">USE: WELCOME50</span>
      </div>

      {/* Section Header */}
      <div className="section-title">Popular Restaurants</div>
      <div className="section-subtitle">
        {filteredRestaurants.length} restaurants near you
      </div>

      {/* Restaurant List */}
      <div className="restaurant-list">
        {filteredRestaurants.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>No restaurants found. Try a different search.</p>
          </div>
        ) : (
          filteredRestaurants.map((r) => (
            <RestaurantCard
              key={r.id}
              restaurant={r}
              onClick={onRestaurantClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
