/**
 * @file widget/utils/menuUtils.js
 * @description Utility functions for restaurant and menu data lookup.
 */

import { RESTAURANTS } from '../constants/restaurants.js';

/**
 * Find a restaurant by ID.
 * @param {string} id - Restaurant ID (e.g. 'r1', 'r2')
 * @returns {object|undefined} Restaurant object or undefined if not found
 */
export function findRestaurant(id) {
  return RESTAURANTS.find(r => r.id === id);
}

/**
 * Get all menu items for a restaurant as a flat array.
 * Combines recommended and sides sections into a single list.
 * @param {object} restaurant - Restaurant object with menu property
 * @returns {Array<object>} Flat array of all menu items
 */
export function flattenMenu(restaurant) {
  return [...(restaurant.menu?.recommended || []), ...(restaurant.menu?.sides || [])];
}
