import { useEffect, useState } from 'react';
import { aiDetection, DetectionResults } from '@/lib/ai-detection';
import { addUserAttribute, trackEvent } from '@/lib/moengage';

export const useAIDetection = () => {
  const [detectionResults, setDetectionResults] = useState<DetectionResults | null>(null);
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    const results = aiDetection.performFullDetection();
    setDetectionResults(results);
    setIsDetecting(false);

    trackDetectionResults(results);
  }, []);

  const refreshDetection = () => {
    setIsDetecting(true);
    const results = aiDetection.performFullDetection();
    setDetectionResults(results);
    setIsDetecting(false);
    trackDetectionResults(results);
  };

  const trackDetectionResults = (results: DetectionResults) => {
    const attributes = {
      ai_bot_detected: results.isAIBot,
      ai_assisted_browser: results.isAIAssisted,
      gpt_app_user: results.isGPTApp,
      user_agent: results.userAgent,
      detection_timestamp: new Date().toISOString(),
    };

    addUserAttribute(attributes);

    if (results.isAIAssisted) {
      addUserAttribute({ ai_assisted: true });
    }

    if (results.isGPTApp) {
      addUserAttribute({ gpt_app_user: true });
      trackEvent('gpt_app_session_start', {
        app_url: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
      });
    }

    trackEvent('ai_detection_performed', {
      is_ai_bot: results.isAIBot,
      is_ai_assisted: results.isAIAssisted,
      is_gpt_app: results.isGPTApp,
      detection_details: JSON.stringify(results.detectionDetails),
    });
  };

  return {
    detectionResults,
    isDetecting,
    refreshDetection,
    shouldBlockTracking: aiDetection.shouldBlockTracking(),
  };
};

