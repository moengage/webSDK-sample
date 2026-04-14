/**
 * @file widget/components/App.jsx
 * @description Root application component.
 *
 * Orchestrates view routing, hooks into the MCP Apps Bridge for tool-result
 * handling, wires up MoEngage event tracking, and manages top-level state
 * (current view, selected restaurant, search, filter, order).
 *
 * View routing is intentionally kept as simple state rather than a router
 * library — the widget runs inside an MCP widget iframe where URL changes are
 * neither possible nor meaningful.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { findRestaurant, flattenMenu } from '../utils/menuUtils.js';

import useCart from '../hooks/useCart.js';
import useMoEngage from '../hooks/useMoEngage.js';
import useMCPBridge from '../hooks/useMCPBridge.js';

import Header from './Header.jsx';
import Home from './Home.jsx';
import Menu from './Menu.jsx';
import Cart from './Cart.jsx';
import OrderConfirmation from './OrderConfirmation.jsx';
import FloatingCart from './FloatingCart.jsx';

/**
 * @returns {React.ReactElement}
 */
export default function App() {
  // ── Hooks ─────────────────────────────────────────────────────────────────
  const {
    cart,
    addToCart: rawAddToCart,
    updateQty,
    clearCart,
    cartTotals,
    syncCart,
  } = useCart();

  const moe = useMoEngage();

  // ── Top-level state ───────────────────────────────────────────────────────
  /** @type {['home'|'menu'|'cart'|'order', Function]} */
  const [currentView, setCurrentView] = useState('home');
  const [currentRestaurant, setCurrentRestaurant] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [cartClearPending, setCartClearPending] = useState(null);

  /** Ref to the previous restaurant so Cart "back" can return to menu. */
  const lastRestaurantRef = useRef(null);

  // Keep the ref in sync with state
  useEffect(() => {
    if (currentRestaurant) {
      lastRestaurantRef.current = currentRestaurant;
    }
  }, [currentRestaurant]);

  // ── Tool-result handler ───────────────────────────────────────────────────
  /**
   * Central dispatcher for structured content returned by MCP tools.
   *
   * Each `data.action` maps to a UI navigation + an optional MoEngage event.
   * The function must be stable across renders so it is wrapped in
   * `useCallback` with exhaustive deps provided by the hooks.
   */
  const handleToolResult = useCallback(
    (result) => {
      if (!result) {
        console.warn('[MCP Bridge] handleToolResult received null/undefined');
        console.warn('Stack trace:', new Error().stack);
        return;
      }

      // Normalise the response envelope
      let data =
        result?.structuredContent ||
        result?.result?.structuredContent ||
        result?.content?.structuredContent ||
        null;
      if (!data && result?.action) data = result;

      if (!data) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[MCP Bridge] No structuredContent or action in result:', result);
        }
        return;
      }

      switch (data.action) {
        // ── Food Delivery Actions ──────────────────────────────────────────

        case 'show_restaurants':
          setCurrentView('home');
          setCurrentRestaurant(null);
          if (data.restaurants) {
            moe.trackEvent('restaurants_browsed', {
              count: data.restaurants.length,
              source: 'mcp_tool',
            });
          }
          break;

        case 'show_menu': {
          if (data.restaurant) {
            const r = findRestaurant(data.restaurant.id);
            if (r) {
              setCurrentRestaurant(r);
              setCurrentView('menu');
              moe.trackEvent('restaurant_viewed', {
                restaurant_id: r.id,
                restaurant_name: r.name,
                cuisine: r.cuisine,
                rating: r.rating,
                delivery_time: r.deliveryTime,
                price_range: r.priceRange,
                pure_veg: r.pureVeg,
                offer: r.offer || '',
                source: 'mcp_tool',
              });
            }
          }
          break;
        }

        case 'update_cart':
          if (data.cart) {
            syncCart(data.cart);
            if (data.addedItem) {
              moe.trackEvent('item_added_to_cart', {
                item_id: data.addedItem.item_id,
                item_name: data.addedItem.item_name,
                price: data.addedItem.price,
                restaurant_id: data.addedItem.restaurant_id,
                restaurant_name: data.addedItem.restaurant_name,
                quantity: data.addedItem.quantity,
                source: 'mcp_tool',
              });
            }
          }
          break;

        case 'show_cart':
          if (data.cart) syncCart(data.cart);
          setCurrentView('cart');
          moe.trackEvent('cart_viewed', {
            items_count: cart.length,
            total: cart.reduce((s, c) => s + c.price * c.qty, 0),
            source: 'mcp_tool',
          });
          break;

        case 'show_order':
          if (data.order) {
            setCurrentOrder(data.order);
            setCurrentView('order');
            clearCart();
            moe.trackEvent('order_placed', {
              order_id: data.order.orderId,
              restaurant_name: data.order.restaurant,
              items_count: data.order.itemCount || 0,
              total: data.order.total || 0,
              source: 'mcp_tool',
            });
          }
          break;

        // ── MoEngage SDK Actions ───────────────────────────────────────────

        case 'moe_track_event':
          if (data.eventName) {
            moe.trackEvent(data.eventName, data.properties || {});
          }
          break;

        case 'moe_identify_user':
          if (data.userId) {
            moe.identifyUser(data.userId, data.attributes || {});
          }
          break;

        case 'moe_set_attribute':
          if (data.attributeName) {
            moe.setAttribute(data.attributeName, data.attributeValue);
          }
          break;

        case 'moe_logout':
          moe.logout();
          break;

        case 'moe_get_cards':
          moe.openCardsInbox();
          break;

        case 'moe_track_page_view':
          moe.trackPageView();
          break;

        case 'moe_get_user_attribute':
          moe.getAttribute(data.attributeName);
          break;

        case 'moe_sdk_control':
          if (data.sdkAction) {
            moe.sdkControl(data.sdkAction);
          }
          break;

        case 'moe_get_cards_info':
          if (data.query) {
            moe.getCardsInfo(data.query);
          }
          break;

        // ── Legacy / unknown fallback ──────────────────────────────────────
        default:
          if (data.restaurants) {
            setCurrentView('home');
            setCurrentRestaurant(null);
          }
          if (data.restaurant && data.menu) {
            const r = findRestaurant(data.restaurant.id);
            if (r) {
              setCurrentRestaurant(r);
              setCurrentView('menu');
            }
          }
          if (data.cart) syncCart(data.cart);
          if (data.order) {
            setCurrentOrder(data.order);
            setCurrentView('order');
          }
          break;
      }
    },
    [cart, clearCart, moe, syncCart],
  );

  // ── MCP Bridge (registered after handleToolResult is defined) ─────────────
  const { callTool } = useMCPBridge({ onToolResult: handleToolResult });

  // ── MoEngage SDK readiness check ──────────────────────────────────────────
  useEffect(() => {
    let moeLoaded = false;
    let timerId;

    function check() {
      if (moeLoaded) return;

      if (
        typeof window.Moengage !== 'undefined' &&
        window.Moengage.onsite
      ) {
        moeLoaded = true;
        moe.trackEvent('app_opened', { source: 'moe_widget' });
        return;
      }

      timerId = setTimeout(check, 500);
    }

    check();

    // Fallback: fire event after 3 s even if SDK never loads
    const fallbackId = setTimeout(() => {
      if (!moeLoaded) {
        console.warn('[MoEngage] SDK not loaded after 3s, continuing without');
      }
    }, 3000);

    return () => {
      clearTimeout(timerId);
      clearTimeout(fallbackId);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Navigation helpers ────────────────────────────────────────────────────

  /** Navigate to home view. */
  const goHome = useCallback(() => {
    setCurrentView('home');
    setCurrentRestaurant(null);
  }, []);

  /** Navigate to cart view. */
  const goCart = useCallback(() => {
    setCurrentView('cart');
    callTool('view_cart', {});
  }, [callTool]);

  /** Navigate back from cart — returns to menu if a restaurant was open. */
  const cartBack = useCallback(() => {
    if (lastRestaurantRef.current) {
      setCurrentRestaurant(lastRestaurantRef.current);
      setCurrentView('menu');
    } else {
      goHome();
    }
  }, [goHome]);

  // ── Restaurant interactions ───────────────────────────────────────────────

  /** Open a restaurant's menu. */
  const openRestaurant = useCallback(
    (restaurant) => {
      setCurrentRestaurant(restaurant);
      setCurrentView('menu');
      callTool('view_menu', { restaurant_id: restaurant.id });
    },
    [callTool],
  );

  // ── Cart interactions ─────────────────────────────────────────────────────

  /** Handle confirmation of cart clear (from dialog). */
  const confirmCartClear = useCallback(
    (confirm) => {
      if (!cartClearPending) return;
      setCartClearPending(null);

      if (!confirm) return;

      const { restaurantId, itemId } = cartClearPending;
      rawAddToCart(restaurantId, itemId);

      const restaurant = findRestaurant(restaurantId);
      if (!restaurant) return;

      const item = flattenMenu(restaurant).find((m) => m.id === itemId);
      if (!item) return;

      const existing = cart.find((c) => c.id === itemId);
      const qty = existing ? existing.qty + 1 : 1;

      callTool('add_to_cart', {
        restaurant_id: restaurantId,
        item_id: itemId,
        item_name: item.name,
        price: item.price,
        quantity: qty,
      });
    },
    [cartClearPending, rawAddToCart, cart, callTool],
  );

  /** Add an item to the cart (local + server sync). */
  const handleAddToCart = useCallback(
    (restaurantId, itemId) => {
      const restaurant = findRestaurant(restaurantId);
      if (!restaurant) return;

      // Multi-restaurant guard — show dialog instead of window.confirm
      if (cart.length > 0 && cart[0].restaurantId !== restaurantId) {
        setCartClearPending({ restaurantId, itemId });
        return;
      }

      rawAddToCart(restaurantId, itemId);

      const item = flattenMenu(restaurant).find((m) => m.id === itemId);
      if (!item) return;

      const existing = cart.find((c) => c.id === itemId);
      const qty = existing ? existing.qty + 1 : 1;

      callTool('add_to_cart', {
        restaurant_id: restaurantId,
        item_id: itemId,
        item_name: item.name,
        price: item.price,
        quantity: qty,
      });
    },
    [cart, rawAddToCart, callTool],
  );

  /** Update quantity for a cart item. */
  const handleUpdateQty = useCallback(
    (itemId, delta) => {
      const item = cart.find((c) => c.id === itemId);
      if (!item) return;

      const newQty = item.qty + delta;
      if (newQty <= 0) {
        moe.trackEvent('item_removed_from_cart', {
          item_id: itemId,
          item_name: item.name,
        });
      } else {
        moe.trackEvent('item_quantity_changed', {
          item_id: itemId,
          item_name: item.name,
          quantity: newQty,
        });
      }

      updateQty(itemId, delta);
    },
    [cart, updateQty, moe],
  );

  /** Place the order. */
  const handlePlaceOrder = useCallback(() => {
    if (cart.length === 0) return;

    const totals = cartTotals();
    const orderId = 'FD' + Date.now().toString(36).toUpperCase();
    const itemCount = cart.reduce((s, c) => s + c.qty, 0);

    callTool('place_order', {
      items: cart.map((c) => ({
        id: c.id,
        name: c.name,
        qty: c.qty,
        price: c.price,
      })),
      restaurant: cart[0]?.restaurantName,
      total: totals.total,
    });

    setCurrentOrder({
      orderId,
      restaurant: cart[0]?.restaurantName,
      total: totals.total,
      itemCount,
    });
    setCurrentView('order');
    clearCart();
  }, [cart, cartTotals, clearCart, callTool]);

  // ── Search / filter ───────────────────────────────────────────────────────

  /** Handle search from Header. */
  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);
      if (query) {
        moe.trackEvent('search_performed', { query });
        callTool('search_food', { query });
      }
    },
    [moe, callTool],
  );

  /** Handle category chip click (sets the search query). */
  const handleCategoryClick = useCallback(
    (categoryName) => {
      setSearchQuery(categoryName);
      moe.trackEvent('category_selected', { category: categoryName });
    },
    [moe],
  );

  /** Handle filter tab change. */
  const handleFilterChange = useCallback((filterKey) => {
    setActiveFilter(filterKey);
  }, []);

  // ── Derived values ────────────────────────────────────────────────────────
  const totals = cartTotals();
  const cartItemCount = totals.itemCount;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      {/* Confirmation dialog for multi-restaurant cart clear */}
      {cartClearPending && (
        <div className="modal-overlay" onClick={() => confirmCartClear(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Clear Cart?</h3>
            <p>Adding items from a different restaurant will clear your cart. Continue?</p>
            <div className="modal-actions">
              <button onClick={() => confirmCartClear(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={() => confirmCartClear(true)} className="btn-primary">
                Clear & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header is always visible except on order confirmation */}
      {currentView !== 'order' && (
        <Header
          cartItemCount={cartItemCount}
          onCartClick={goCart}
          onSearch={handleSearch}
        />
      )}

      {/* Conditional view rendering */}
      {currentView === 'home' && (
        <Home
          onRestaurantClick={openRestaurant}
          onCategoryClick={handleCategoryClick}
          onFilterChange={handleFilterChange}
          searchQuery={searchQuery}
          activeFilter={activeFilter}
          trackEvent={moe.trackEvent}
        />
      )}

      {currentView === 'menu' && (
        <Menu
          restaurant={currentRestaurant}
          cart={cart}
          onBack={goHome}
          onCartClick={goCart}
          onAddToCart={handleAddToCart}
          cartItemCount={cartItemCount}
        />
      )}

      {currentView === 'cart' && (
        <Cart
          cart={cart}
          totals={totals}
          onBack={cartBack}
          onUpdateQty={handleUpdateQty}
          onPlaceOrder={handlePlaceOrder}
          onGoHome={goHome}
        />
      )}

      {currentView === 'order' && (
        <OrderConfirmation order={currentOrder} onNewOrder={goHome} />
      )}

      {/* Floating cart bar */}
      <FloatingCart cart={cart} currentView={currentView} onClick={goCart} />
    </div>
  );
}
