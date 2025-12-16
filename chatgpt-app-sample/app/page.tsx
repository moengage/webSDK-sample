'use client';

import { useEffect, useState, useCallback } from 'react';
import { useMoEngage } from '@/hooks/useMoEngage';
import { useTracking, LogEntry } from '@/hooks/useTracking';
import { initializeChatGPTApps } from '@/lib/chatgpt-apps';
import { trackEvent } from '@/lib/moengage';
import UserIdentification from '@/components/UserIdentification';
import EventTracking from '@/components/EventTracking';
import AIDetection from '@/components/AIDetection';
import SessionManagement from '@/components/SessionManagement';
import TrackingLogs from '@/components/TrackingLogs';

const MOENGAGE_CONFIG = {
  dataCenter: process.env.NEXT_PUBLIC_MOENGAGE_DATACENTER || 'dc_01',
  appId: process.env.NEXT_PUBLIC_MOENGAGE_APP_ID || '3RADPYNEBZ2MCOJ43EEW5FWV',
  sdkVersion: '2',
  debugLogs: 0,
};

export default function Home() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const { isReady } = useMoEngage(MOENGAGE_CONFIG);

  const handleLog = useCallback((log: LogEntry) => {
    setLogs((prev) => [...prev, log]);
  }, []);

  const { track } = useTracking(handleLog);

  useEffect(() => {
    if (isReady) {
      track('app_loaded', {
        load_time: typeof window !== 'undefined' ? performance.now() : 0,
      });

      const chatGPTApp = initializeChatGPTApps((action) => {
        track('chatgpt_action', {
          action_type: action.type,
          action_data: JSON.stringify(action.data || {}),
        });
      });

      if (chatGPTApp) {
        track('chatgpt_app_initialized', {});
      }
    }
  }, [isReady, track]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeUnload = () => {
      trackEvent('session_end', {
        session_duration: performance.now(),
        timestamp: new Date().toISOString(),
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [track]);

  return (
    <div className="container">
      <header>
        <h1>MoEngage Sample App</h1>
        <p className="subtitle">ChatGPT Integration with Full Tracking</p>
        {!isReady && <p style={{ color: '#f56565', marginTop: '10px' }}>Initializing MoEngage SDK...</p>}
        {isReady && <p style={{ color: '#48bb78', marginTop: '10px' }}>MoEngage SDK Ready ✓</p>}
      </header>

      <UserIdentification />
      <EventTracking />
      <AIDetection />
      <SessionManagement />
      <TrackingLogs logs={logs} onClear={() => setLogs([])} />
    </div>
  );
}

