export interface DetectionResults {
  isAIBot: boolean;
  isAIAssisted: boolean;
  isGPTApp: boolean;
  userAgent: string;
  detectionDetails: {
    botDetection?: {
      detected: boolean;
      matchedBots: string[];
    };
    aiAssistedDetection?: {
      detected: boolean;
      matchedBrowsers: string[];
      hasAIMarkers: boolean;
    };
    gptAppDetection?: {
      detected: boolean;
      inIframe: boolean;
      parentUrl: string | null;
    };
  };
}

export class AIDetection {
  private knownAIBots = [
    'GPTBot',
    'ChatGPT-User',
    'CCBot',
    'anthropic-ai',
    'ClaudeBot',
    'PerplexityBot',
    'YouBot',
    'Google-Extended',
    'Bingbot',
    'Googlebot',
    'facebookexternalhit',
    'Twitterbot',
    'LinkedInBot',
    'Slackbot',
    'Discordbot',
    'Applebot-Extended',
  ];

  private aiAssistedBrowsers = ['Arc', 'Arc Browser', 'Opera GX', 'Brave', 'Vivaldi'];

  private aiAssistedMarkers = ['arc', 'ai-assistant', 'ai-powered', 'copilot', 'assistant'];

  private detectionResults: DetectionResults = {
    isAIBot: false,
    isAIAssisted: false,
    isGPTApp: false,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    detectionDetails: {},
  };

  detectAIBot(): boolean {
    if (typeof navigator === 'undefined') return false;

    const userAgent = navigator.userAgent;
    const isBot = this.knownAIBots.some(
      (bot) => userAgent.includes(bot) || userAgent.toLowerCase().includes(bot.toLowerCase())
    );

    this.detectionResults.isAIBot = isBot;
    this.detectionResults.detectionDetails.botDetection = {
      detected: isBot,
      matchedBots: this.knownAIBots.filter(
        (bot) => userAgent.includes(bot) || userAgent.toLowerCase().includes(bot.toLowerCase())
      ),
    };

    return isBot;
  }

  detectAIAssistedBrowser(): boolean {
    if (typeof navigator === 'undefined') return false;

    const userAgent = navigator.userAgent;
    const isAIAssisted =
      this.aiAssistedBrowsers.some(
        (browser) => userAgent.includes(browser) || userAgent.toLowerCase().includes(browser.toLowerCase())
      ) ||
      this.aiAssistedMarkers.some((marker) => userAgent.toLowerCase().includes(marker.toLowerCase()));

    const hasAIMarkers = this.checkAIMarkers();

    this.detectionResults.isAIAssisted = isAIAssisted || hasAIMarkers;
    this.detectionResults.detectionDetails.aiAssistedDetection = {
      detected: isAIAssisted || hasAIMarkers,
      matchedBrowsers: this.aiAssistedBrowsers.filter(
        (browser) => userAgent.includes(browser) || userAgent.toLowerCase().includes(browser.toLowerCase())
      ),
      hasAIMarkers: hasAIMarkers,
    };

    return isAIAssisted || hasAIMarkers;
  }

  private checkAIMarkers(): boolean {
    if (typeof window === 'undefined') return false;

    const windowObj = window as any;
    const navigatorObj = navigator as any;

    const markers = [
      windowObj.arc !== undefined,
      windowObj.copilot !== undefined,
      navigatorObj.aiAssistant !== undefined,
      windowObj.__ai_assistant__ !== undefined,
      navigatorObj.userAgentData &&
        navigatorObj.userAgentData.brands &&
        navigatorObj.userAgentData.brands.some(
          (brand: any) => brand.brand && brand.brand.toLowerCase().includes('ai')
        ),
    ];

    return markers.some((marker) => marker === true);
  }

  detectGPTApp(): boolean {
    if (typeof window === 'undefined') return false;

    const isGPTApp =
      window.location.href.includes('chat.openai.com') ||
      window.location.href.includes('chatgpt.com') ||
      (window as any).__OPENAI_APPS__ !== undefined ||
      (window.parent !== window &&
        (window.parent.location.href.includes('chat.openai.com') ||
          window.parent.location.href.includes('chatgpt.com')));

    this.detectionResults.isGPTApp = isGPTApp;
    this.detectionResults.detectionDetails.gptAppDetection = {
      detected: isGPTApp,
      inIframe: window.parent !== window,
      parentUrl: window.parent !== window ? window.parent.location.href : null,
    };

    return isGPTApp;
  }

  performFullDetection(): DetectionResults {
    this.detectAIBot();
    this.detectAIAssistedBrowser();
    this.detectGPTApp();

    return this.detectionResults;
  }

  shouldBlockTracking(): boolean {
    return this.detectionResults.isAIBot;
  }

  getDetectionResults(): DetectionResults {
    return this.detectionResults;
  }
}

export const aiDetection = new AIDetection();

