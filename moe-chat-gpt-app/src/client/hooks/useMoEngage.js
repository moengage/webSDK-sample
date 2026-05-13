import { useMemo } from 'react';

export default function useMoEngage() {
  const safeCall = (method, ...args) => {
    try {
      if (typeof window.moengage?.[method] === 'function') {
        window.moengage[method](...args);
        console.log(`[MoEngage] ${method}:`, ...args);
      }
    } catch (err) {
      console.error(`[MoEngage] ${method} error:`, err.message);
    }
  };

  return useMemo(() => ({
    trackEvent: (name, props = {}) => safeCall('trackEvent', name, props),
    identifyUser: (id, attrs = {}) => safeCall('identifyUser', { uid: id, ...attrs }),
    setAttribute: (name, val) => safeCall('setUserAttribute', name, val),
    fetchCards: () => safeCall('fetchCards'),
    recordCardImpression: (id) => safeCall('cardImpression', id),
    recordCardClick: (id) => safeCall('cardClicked', id),
    logout: () => safeCall('logoutUser'),
  }), []);
}
