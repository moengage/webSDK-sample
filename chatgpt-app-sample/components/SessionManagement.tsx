'use client';

import { useState } from 'react';
import { useTracking } from '@/hooks/useTracking';
import styles from './SessionManagement.module.css';

export default function SessionManagement() {
  const { destroy, updateId } = useTracking();
  const [newUserId, setNewUserId] = useState('');

  const handleUpdateUserId = () => {
    const userId = prompt('Enter new User ID:');
    if (userId) {
      updateId(userId);
    }
  };

  return (
    <div className={styles.section}>
      <h2>Session Management</h2>
      <div className={styles.buttonGroup}>
        <button onClick={destroy} className={styles.btnWarning}>
          Destroy Session
        </button>
        <button onClick={handleUpdateUserId} className={styles.btnSecondary}>
          Update User ID
        </button>
      </div>
    </div>
  );
}

