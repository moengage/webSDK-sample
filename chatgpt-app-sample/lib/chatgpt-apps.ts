declare global {
  interface Window {
    OpenAI?: {
      Apps?: {
        init: (config: { theme?: string; onAction?: (action: any) => void }) => any;
      };
    };
    __OPENAI_APPS__?: boolean;
  }
}

export const initializeChatGPTApps = (onAction?: (action: any) => void) => {
  if (typeof window === 'undefined') return null;

  if (typeof window.OpenAI !== 'undefined' && window.OpenAI.Apps) {
    try {
      const app = window.OpenAI.Apps.init({
        theme: 'light',
        onAction: onAction || (() => {}),
      });

      console.log('ChatGPT Apps SDK initialized');
      return app;
    } catch (error) {
      console.error('Error initializing ChatGPT Apps SDK:', error);
      return null;
    }
  }

  return null;
};

export const isChatGPTApp = (): boolean => {
  if (typeof window === 'undefined') return false;

  return (
    window.location.href.includes('chat.openai.com') ||
    window.location.href.includes('chatgpt.com') ||
    window.__OPENAI_APPS__ !== undefined ||
    (window.parent !== window &&
      (window.parent.location.href.includes('chat.openai.com') ||
        window.parent.location.href.includes('chatgpt.com')))
  );
};

