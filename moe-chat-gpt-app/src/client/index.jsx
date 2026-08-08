import { createRoot } from 'react-dom/client';
import moengage from '@moengage/web-sdk';
import App from './components/App.jsx';

// Promise that resolves when SDK is fully initialized
window.moeSDKReady = new Promise((resolve) => {
  window._resolveMoeSDK = resolve;
});

function initializeMoEngage() {
  const appId = window.__MOENGAGE_APP_ID__;
  const dataCenter = window.__MOENGAGE_DATA_CENTER__;

  if (!appId || appId.includes('PLACEHOLDER')) {
    console.warn('[MoEngage] App ID not configured');
    return;
  }

  const cards = {
    enable: true,
    placeholder: "#moe_inbox",
    overLayColor: "rgba(0, 0, 0, 0.6)",
    backgroundColor: "#525a5c",
    navigationBar: {
      backgroundColor: "#b4c0e0",
      text: "Inbox",
      color: "#fff",
      fontSize: "16px",
      fontFamily: "monospace"
    },
    closeButton: {
      mWebIcon: "https://app-cdn.moengage.com/sdk/back-icon.svg",
      webIcon: "https://app-cdn.moengage.com/sdk/cross-icon.svg"
    },
    tab: {
      inactiveTabFontColor: "#7C7C7C",
      fontSize: "14px",
      fontFamily: "inherit",
      backgroundColor: "#F6FBFC",
      active: {
        color: "#06A6B7",
        underlineColor: "#06A6B7",
        backgroundColor: "transparent"
      }
    },
    cardDismiss: {
      color: "red",
      enable: false
    },
    optionButtonColor: "#C4C4C4",
    dateTimeColor: "#8E8E8E",
    unclickedCardIndicatorColor: "blue",
    pinIcon: "https://app-cdn.moengage.com/sdk/pin-icon.svg",
    refreshIcon: "https://app-cdn.moengage.com/sdk/refresh-icon.svg",
    webFloating: {
      enable: true,
      icon: "https://app-cdn.moengage.com/sdk/bell-icon.svg",
      postion: "0px 10px 40px 0",
      countBackgroundColor: "#FF5A5F",
      countColor: "#fff",
      zIndex: "999998",
      iconBackgroundColor: "#D9DFED",
      fontFamily: "inherit"
    },
    mWebFloating: {
      enable: true,
      icon: "https://app-cdn.moengage.com/sdk/bell-icon.svg",
      postion: "0px 10px 40px 0",
      countBackgroundColor: "#FF5A5F",
      countColor: "#fff",
      zIndex: "999998",
      iconBackgroundColor: "#D9DFED",
      fontFamily: "inherit"
    },
    card: {
      headerFontSize: "16px",
      descriptionFontSize: "14px",
      ctaFontSize: "12px",
      fontFamily: "monospace",
      horizontalRowColor: "#D9DFED"
    },
    errorContent: {
      img: "https://app-cdn.moengage.com/sdk/cards-error.svg",
      text: "Error something went wrong <button onclick=\"window.location.reload();\" style=\"color: #06A6B7; display: contents;\" class=\"btn-icon pointer-cursor\" >Refresh</button>"
    },
    noDataContent: {
      img: "https://app-cdn.moengage.com/sdk/cards-no-result.svg",
      text: "No notifications to show, check again later."
    },
    zIndex: "999999",
    fontFaces: []
  };

  try {
    moengage.initialize({ appId, cluster: dataCenter, env: 'LIVE', logLevel: 0, cards });
    console.log('[MoEngage] Init called:', appId);
    window.moengage = moengage;

    // Listen for SDK initialization completion event
    const handleLifecycle = (e) => {
      if (e.detail?.name === 'SDK_INITIALIZATION_COMPLETED') {
        console.log('[MoEngage] SDK_INITIALIZATION_COMPLETED event fired');
        window._resolveMoeSDK?.();
        window.removeEventListener('MOE_LIFECYCLE', handleLifecycle);
      }
    };

    window.addEventListener('MOE_LIFECYCLE', handleLifecycle);

    // Fallback: Check initialized flag every 100ms for max 5 seconds
    const checkInitialized = setInterval(() => {
      if (window.moengage?.initialized === true) {
        console.log('[MoEngage] SDK initialized flag detected');
        window._resolveMoeSDK?.();
        clearInterval(checkInitialized);
        window.removeEventListener('MOE_LIFECYCLE', handleLifecycle);
      }
    }, 100);

    setTimeout(() => clearInterval(checkInitialized), 5000);
  } catch (err) {
    console.error('[MoEngage] Init failed:', err.message);
  }
}

initializeMoEngage();
const root = createRoot(document.getElementById('app'));
root.render(<App />);
