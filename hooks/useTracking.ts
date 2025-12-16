import { useCallback } from 'react';
import { trackEvent, identifyUser, destroySession, updateUserId } from '@/lib/moengage';
import { aiDetection } from '@/lib/ai-detection';

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const useTracking = (onLog?: (log: LogEntry) => void) => {
  const log = useCallback(
    (message: string, type: LogEntry['type'] = 'info') => {
      const logEntry: LogEntry = {
        timestamp: new Date().toLocaleTimeString(),
        message,
        type,
      };
      onLog?.(logEntry);
    },
    [onLog]
  );

  const track = useCallback(
    (eventName: string, eventProperties: Record<string, any> = {}) => {
      if (aiDetection.shouldBlockTracking()) {
        log(`Event blocked (AI Bot detected): ${eventName}`, 'info');
        return;
      }

      const detectionResults = aiDetection.getDetectionResults();
      const enhancedProperties = {
        ...eventProperties,
        ai_platform: detectionResults.isGPTApp ? 'chatgpt' : 'web',
        is_ai_assisted: detectionResults.isAIAssisted,
        is_gpt_app: detectionResults.isGPTApp,
        timestamp: new Date().toISOString(),
      };

      trackEvent(eventName, enhancedProperties);
      log(`Event tracked: ${eventName}`, 'success');
    },
    [log]
  );

  const identify = useCallback(
    (userData: { uid?: string; u_fn?: string; u_em?: string; u_mb?: string; [key: string]: any }) => {
      if (!userData.uid && !userData.u_em) {
        log('Please provide User ID or Email', 'error');
        return;
      }

      try {
        identifyUser(userData);

        const detectionResults = aiDetection.getDetectionResults();
        if (detectionResults.isAIAssisted) {
          identifyUser({ ...userData, ai_assisted: true });
        }
        if (detectionResults.isGPTApp) {
          identifyUser({ ...userData, gpt_app_user: true });
        }

        log(`User identified: ${userData.uid || userData.u_em}`, 'success');
        track('user_identified', {
          has_name: !!userData.u_fn,
          has_email: !!userData.u_em,
          has_mobile: !!userData.u_mb,
        });
      } catch (error: any) {
        log(`Error identifying user: ${error.message}`, 'error');
      }
    },
    [log, track]
  );

  const destroy = useCallback(() => {
    try {
      destroySession();
      log('Session destroyed', 'success');
      track('session_destroyed', {
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      log(`Error destroying session: ${error.message}`, 'error');
    }
  }, [log, track]);

  const updateId = useCallback(
    (newUserId: string) => {
      try {
        updateUserId(newUserId);
        log(`User ID updated to: ${newUserId}`, 'success');
        track('user_id_updated', {
          new_user_id: newUserId,
          timestamp: new Date().toISOString(),
        });
      } catch (error: any) {
        log(`Error updating user ID: ${error.message}`, 'error');
      }
    },
    [log, track]
  );

  return {
    track,
    identify,
    destroy,
    updateId,
    log,
  };
};

