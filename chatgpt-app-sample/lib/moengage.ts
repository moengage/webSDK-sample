declare global {
  interface Window {
    moe?: any;
    Moengage?: any;
    moeDataCenter?: string;
    moeAppID?: string;
    moengage_object?: {
      initialised?: number;
      invoked?: number;
    };
    moengage_q?: Array<{ f: string; a: any[] }>;
  }
}

export interface MoEngageConfig {
  dataCenter: string;
  appId: string;
  sdkVersion?: string;
  debugLogs?: number;
}

export const initializeMoEngage = (config: MoEngageConfig) => {
  if (typeof window === 'undefined') return;

  const { dataCenter, appId, sdkVersion = '2', debugLogs = 1 } = config;

  if (!dataCenter || !dataCenter.match(/^dc_[0-9]+$/)) {
    console.error('Data center has not been passed correctly.');
    return;
  }

  if (
    window.moengage_object &&
    ((window.moengage_object.initialised && window.moengage_object.initialised > 0) ||
      (window.moengage_object.invoked && window.moengage_object.invoked > 0))
  ) {
    console.error('MoEngage Web SDK initialised multiple times.');
    return;
  }

  window.moeDataCenter = dataCenter;
  window.moeAppID = appId;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://js.moengage.com/staging/versions/5.02.45/sdk.js`;
  script.onload = () => {
    if (window.moe && typeof window.moe === 'function') {
      window.Moengage = window.moe({
        app_id: appId,
        cluster: dataCenter.toUpperCase(),
        debug_logs: debugLogs,
      });
    } else if (window.moengage_object) {
      window.Moengage = window.moengage_object;
    }
  };
  script.onerror = () => {
    console.error('Moengage Web SDK loading failed.');
  };

  document.head.appendChild(script);
};

export const isMoEngageReady = (): boolean => {
  if (typeof window === 'undefined') return false;
  return typeof window.Moengage !== 'undefined' && window.Moengage !== null;
};

export const identifyUser = (userData: {
  uid?: string;
  u_fn?: string;
  u_em?: string;
  u_mb?: string;
  [key: string]: any;
}) => {
  if (!isMoEngageReady()) {
    console.warn('MoEngage SDK not initialized');
    return;
  }

  try {
    if (userData.uid) {
      window.Moengage.add_unique_user_id(userData.uid);
    }
    if (userData.u_fn) {
      window.Moengage.add_user_name(userData.u_fn);
    }
    if (userData.u_em) {
      window.Moengage.add_email(userData.u_em);
    }
    if (userData.u_mb) {
      window.Moengage.add_mobile(userData.u_mb);
    }

    window.Moengage.identifyUser(userData);
  } catch (error) {
    console.error('Error identifying user:', error);
  }
};

export const trackEvent = (eventName: string, eventProperties: Record<string, any> = {}) => {
  if (!isMoEngageReady()) {
    console.warn('MoEngage SDK not initialized');
    return;
  }

  try {
    window.Moengage.track_event(eventName, {
      ...eventProperties,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

export const addUserAttribute = (attributes: Record<string, any>) => {
  if (!isMoEngageReady()) {
    console.warn('MoEngage SDK not initialized');
    return;
  }

  try {
    window.Moengage.add_user_attribute(attributes);
  } catch (error) {
    console.error('Error adding user attribute:', error);
  }
};

export const destroySession = () => {
  if (!isMoEngageReady()) {
    console.warn('MoEngage SDK not initialized');
    return;
  }

  try {
    window.Moengage.destroy_session();
  } catch (error) {
    console.error('Error destroying session:', error);
  }
};

export const updateUserId = (newUserId: string) => {
  if (!isMoEngageReady()) {
    console.warn('MoEngage SDK not initialized');
    return;
  }

  try {
    window.Moengage.update_unique_user_id(newUserId);
  } catch (error) {
    console.error('Error updating user ID:', error);
  }
};

