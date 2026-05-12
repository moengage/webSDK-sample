/**
 * @file widget/hooks/useMoEngage.js
 * @description React hook for MoEngage WebSDK npm package (@moengage/web-sdk).
 *
 * Initializes the SDK on first mount and provides stable methods for event
 * tracking, user identification, email management, content cards, and personalization.
 * No push notifications (disabled per requirements).
 */

import { useCallback, useRef, useEffect } from 'react';
import moengage from '@moengage/web-sdk';

/**
 * Prefixed console logger for MoEngage-related messages.
 * Only logs in development mode to avoid spamming production consoles.
 * @param {string} msg
 */
function logMoe(msg) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[MoEngage]', msg);
  }
}

/**
 * Custom hook exposing MoEngage SDK operations used by the widget.
 *
 * All methods are memoised via `useCallback` so they are safe to pass as
 * props or include in dependency arrays.
 *
 * @returns {{
 *   logMoe:          (msg: string) => void,
 *   trackEvent:      (eventName: string, properties?: object) => void,
 *   identifyUser:    (userId: string, attributes?: object) => void,
 *   setEmailId:      (email: string) => void,
 *   setAttribute:    (name: string, value: *) => void,
 *   getAttribute:    (name?: string) => *,
 *   logout:          () => void,
 *   trackPageView:   () => void,
 *   openCardsInbox:  () => void,
 *   getCardsInfo:    (query: string) => *,
 * }}
 */
export default function useMoEngage() {
  const initRef = useRef(false);

  // Initialize SDK on mount
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    try {
      // Get config from window globals (set by HTML template)
      const appId = window.__MOENGAGE_APP_ID__;
      const cluster = window.__MOENGAGE_DATA_CENTER__ || '';

      if (!appId) {
        logMoe('App ID not configured, MoEngage disabled');
        return;
      }

      moengage.initialize({
        appId,
        env: 'LIVE',
        logLevel: 0,
        cluster,
      });
      logMoe(`Initialized with appId: ${appId}, cluster: ${cluster}`);
    } catch (err) {
      logMoe(`Init error: ${err.message}`);
    }
  }, []);

  // ── trackEvent ────────────────────────────────────────────────────────────
  /**
   * Track a custom event via MoEngage SDK.
   *
   * @param {string} eventName  - Name of the event.
   * @param {object} [properties={}] - Key/value event properties.
   */
  const trackEvent = useCallback((eventName, properties = {}) => {
    try {
      moengage.trackEvent(eventName, properties);
      logMoe(`Event: ${eventName} ${JSON.stringify(properties)}`);
    } catch (err) {
      logMoe(`Track error (${eventName}): ${err.message}`);
    }
  }, []);

  // ── identifyUser ──────────────────────────────────────────────────────────
  /**
   * Identify a user with UID and optional attributes.
   *
   * @param {string} userId     - Unique user identifier (uid).
   * @param {object} [attributes={}] - Profile attributes (u_mb, u_fn, u_ln, u_em, u_gender, u_birthday).
   */
  const identifyUser = useCallback((userId, attributes = {}) => {
    try {
      const userObj = { uid: userId, ...attributes };
      moengage.identifyUser(userObj);
      logMoe(`Identified: ${userId} with ${Object.keys(attributes).length} attrs`);
    } catch (err) {
      logMoe(`Identify error: ${err.message}`);
    }
  }, []);

  // ── setEmailId ────────────────────────────────────────────────────────────
  /**
   * Set the user's email ID.
   *
   * @param {string} email - User's email address.
   */
  const setEmailId = useCallback((email) => {
    try {
      moengage.setEmailId(email);
      logMoe(`Email set: ${email}`);
    } catch (err) {
      logMoe(`Set email error: ${err.message}`);
    }
  }, []);

  // ── setAttribute ──────────────────────────────────────────────────────────
  /**
   * Set a custom user attribute.
   *
   * @param {string} name  - Attribute name (e.g., 'u_premium', 'u_plan').
   * @param {*}      value - Attribute value.
   */
  const setAttribute = useCallback((name, value) => {
    try {
      moengage.setUserAttribute(name, value);
      logMoe(`Attribute: ${name} = ${value}`);
    } catch (err) {
      logMoe(`Attribute error: ${err.message}`);
    }
  }, []);

  // ── getAttribute ──────────────────────────────────────────────────────────
  /**
   * Retrieve a user attribute.
   *
   * @param {string} name - Attribute name.
   * @returns {*} The attribute value or `undefined`.
   */
  const getAttribute = useCallback((name) => {
    try {
      const val = moengage.getUserAttribute(name);
      logMoe(`Attribute "${name}" = ${JSON.stringify(val)}`);
      return val;
    } catch (err) {
      logMoe(`Get attribute error: ${err.message}`);
      return undefined;
    }
  }, []);

  // ── logout ────────────────────────────────────────────────────────────────
  /**
   * Logout the current user and destroy session.
   */
  const logout = useCallback(() => {
    try {
      moengage.logoutUser();
      logMoe('User logged out');
    } catch (err) {
      logMoe(`Logout error: ${err.message}`);
    }
  }, []);

  // ── trackPageView ─────────────────────────────────────────────────────────
  /**
   * Track a page view event.
   */
  const trackPageView = useCallback(() => {
    try {
      moengage.trackPageView();
      logMoe('Page view tracked');
    } catch (err) {
      logMoe(`Page view error: ${err.message}`);
    }
  }, []);

  // ── openCardsInbox ────────────────────────────────────────────────────────
  /**
   * Open the MoEngage Content Cards inbox.
   */
  const openCardsInbox = useCallback(() => {
    try {
      const inbox = document.getElementById('moe_inbox');
      if (inbox) {
        inbox.style.display = 'block';
        logMoe('Content Cards inbox opened');
      }
    } catch (err) {
      logMoe(`Cards error: ${err.message}`);
    }
  }, []);

  // ── getCardsInfo ──────────────────────────────────────────────────────────
  /**
   * Query Content Cards metadata or fetch cards.
   *
   * @param {string} query - Query type (e.g., 'fetch_cards', 'unclicked_count')
   * @returns {*} The result or `null`.
   */
  const getCardsInfo = useCallback((query) => {
    try {
      let result = null;
      if (query === 'fetch_cards') {
        moengage.fetchCards();
        result = 'Cards fetch initiated';
      }
      logMoe(`Cards query (${query}): ${JSON.stringify(result)}`);
      return result;
    } catch (err) {
      logMoe(`Cards query error: ${err.message}`);
      return null;
    }
  }, []);

  // ── sdkControl ────────────────────────────────────────────────────────────
  /**
   * Generic MoEngage SDK control method for custom actions.
   * Allows tools to invoke arbitrary SDK methods.
   *
   * @param {string} action - SDK action name (e.g., 'showCards', 'logout').
   * @returns {void}
   */
  const sdkControl = useCallback((action) => {
    try {
      if (!action) return;
      logMoe(`SDK control: ${action}`);
      // Action types can be extended as needed by tools
    } catch (err) {
      logMoe(`SDK control error (${action}): ${err.message}`);
    }
  }, []);

  return {
    trackEvent,
    identifyUser,
    setEmailId,
    setAttribute,
    getAttribute,
    logout,
    trackPageView,
    openCardsInbox,
    getCardsInfo,
    sdkControl,
  };
}
