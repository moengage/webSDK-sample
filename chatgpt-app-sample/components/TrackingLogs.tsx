'use client';

import { LogEntry } from '@/hooks/useTracking';
import styles from './TrackingLogs.module.css';

interface TrackingLogsProps {
  logs: LogEntry[];
  onClear: () => void;
}

export default function TrackingLogs({ logs, onClear }: TrackingLogsProps) {
  return (
    <div className={styles.section}>
      <h2>Tracking Logs</h2>
      <div className={styles.logsContainer}>
        {logs.length === 0 ? (
          <p className={styles.emptyLogs}>No logs yet. Start tracking events to see logs here.</p>
        ) : (
          logs.slice(-50).map((log, index) => (
            <div key={index} className={`${styles.logEntry} ${styles[log.type]}`}>
              <span className={styles.logTimestamp}>[{log.timestamp}]</span> {log.message}
            </div>
          ))
        )}
      </div>
      <button onClick={onClear} className={styles.btnSecondary}>
        Clear Logs
      </button>
    </div>
  );
}

