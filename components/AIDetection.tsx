'use client';

import { useAIDetection } from '@/hooks/useAIDetection';
import styles from './AIDetection.module.css';

export default function AIDetection() {
  const { detectionResults, isDetecting, refreshDetection } = useAIDetection();

  if (isDetecting || !detectionResults) {
    return (
      <div className={styles.section}>
        <h2>AI Detection & Tracking</h2>
        <p>Detecting...</p>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <h2>AI Detection & Tracking</h2>
      <div className={styles.infoBox}>
        <p>
          <strong>User Agent:</strong> <span>{detectionResults.userAgent}</span>
        </p>
        <p>
          <strong>AI Bot Detected:</strong>{' '}
          <span className={detectionResults.isAIBot ? styles.detected : styles.notDetected}>
            {detectionResults.isAIBot ? 'Yes' : 'No'}
          </span>
        </p>
        <p>
          <strong>AI-Assisted Browser:</strong>{' '}
          <span className={detectionResults.isAIAssisted ? styles.detected : styles.notDetected}>
            {detectionResults.isAIAssisted ? 'Yes' : 'No'}
          </span>
        </p>
        <p>
          <strong>GPT App User:</strong>{' '}
          <span className={detectionResults.isGPTApp ? styles.detected : styles.notDetected}>
            {detectionResults.isGPTApp ? 'Yes' : 'No'}
          </span>
        </p>
      </div>
      <button onClick={refreshDetection} className={styles.btnSecondary}>
        Refresh Detection
      </button>
    </div>
  );
}

