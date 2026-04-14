/**
 * @file widget/components/Header.jsx
 * @description Top header bar with logo, cart button and search input.
 *
 * The search input has a 300 ms debounce — the `onSearch` callback is only
 * fired after the user stops typing for 300 ms.
 */

import React, { useRef, useCallback, useEffect } from 'react';

/** Debounce delay for search input (in milliseconds). */
const SEARCH_DEBOUNCE_MS = 300;

/**
 * @param {object}   props
 * @param {number}   props.cartItemCount - Total quantity badge value.
 * @param {function} props.onCartClick   - Invoked when the cart button is pressed.
 * @param {function} props.onSearch      - Invoked with the trimmed search string (debounced).
 * @returns {React.ReactElement}
 */
export default function Header({ cartItemCount, onCartClick, onSearch }) {
  const timerRef = useRef(null);

  /**
   * Handle keystrokes in the search input with a debounce.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const handleInput = useCallback(
    (e) => {
      const value = e.target.value;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (typeof onSearch === 'function') {
          onSearch(value.trim());
        }
      }, SEARCH_DEBOUNCE_MS);
    },
    [onSearch],
  );

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="header">
      <div className="header-top">
        <div className="logo">
          Foodie<span>.</span>
        </div>
        <button className="cart-btn" onClick={onCartClick} type="button">
          🛒{' '}
          <span className={`cart-badge${cartItemCount > 0 ? ' visible' : ''}`}>
            {cartItemCount}
          </span>
        </button>
      </div>
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search for restaurants, cuisines..."
          onChange={handleInput}
        />
      </div>
    </div>
  );
}
