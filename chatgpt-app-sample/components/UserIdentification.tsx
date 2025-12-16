'use client';

import { useState } from 'react';
import { useTracking } from '@/hooks/useTracking';
import styles from './UserIdentification.module.css';

export default function UserIdentification() {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const { identify } = useTracking();

  const handleIdentify = () => {
    identify({
      uid: userId || undefined,
      u_fn: userName || undefined,
      u_em: userEmail || undefined,
      u_mb: userMobile || undefined,
    });
  };

  return (
    <div className={styles.section}>
      <h2>User Identification</h2>
      <div className={styles.formGroup}>
        <label htmlFor="userId">User ID:</label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter user ID or email"
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="userName">Name:</label>
        <input
          type="text"
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="userEmail">Email:</label>
        <input
          type="email"
          id="userEmail"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="userMobile">Mobile:</label>
        <input
          type="tel"
          id="userMobile"
          value={userMobile}
          onChange={(e) => setUserMobile(e.target.value)}
          placeholder="Enter mobile number"
        />
      </div>
      <button onClick={handleIdentify} className={styles.btnPrimary}>
        Identify User
      </button>
    </div>
  );
}

