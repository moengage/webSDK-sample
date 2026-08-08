'use client';

import { useState } from 'react';
import { useTracking } from '@/hooks/useTracking';
import styles from './EventTracking.module.css';

export default function EventTracking() {
  const [eventName, setEventName] = useState('');
  const [eventProperties, setEventProperties] = useState('');
  const { track } = useTracking();

  const handleTrackCustom = () => {
    if (!eventName) {
      alert('Please provide event name');
      return;
    }

    try {
      const properties = eventProperties ? JSON.parse(eventProperties) : {};
      track(eventName, properties);
      setEventName('');
      setEventProperties('');
    } catch (error: any) {
      alert(`Invalid JSON: ${error.message}`);
    }
  };

  return (
    <div className={styles.section}>
      <h2>Event Tracking</h2>
      <div className={styles.buttonGroup}>
        <button onClick={() => track('page_view', { page_url: typeof window !== 'undefined' ? window.location.href : '' })} className={styles.btnSecondary}>
          Track Page View
        </button>
        <button onClick={() => track('button_click', { button_type: 'generic' })} className={styles.btnSecondary}>
          Track Button Click
        </button>
        <button
          onClick={() =>
            track('product_view', {
              product_id: 'sample_product_123',
              product_name: 'Sample Product',
              product_category: 'Electronics',
              product_price: 99.99,
              currency: 'USD',
            })
          }
          className={styles.btnSecondary}
        >
          Track Product View
        </button>
        <button
          onClick={() =>
            track('add_to_cart', {
              product_id: 'sample_product_123',
              product_name: 'Sample Product',
              quantity: 1,
              price: 99.99,
              currency: 'USD',
            })
          }
          className={styles.btnSecondary}
        >
          Track Add to Cart
        </button>
        <button
          onClick={() =>
            track('purchase', {
              order_id: 'order_' + Date.now(),
              product_id: 'sample_product_123',
              product_name: 'Sample Product',
              quantity: 1,
              total_amount: 99.99,
              currency: 'USD',
              payment_method: 'credit_card',
            })
          }
          className={styles.btnSecondary}
        >
          Track Purchase
        </button>
        <button
          onClick={() =>
            track('search', {
              search_query: 'sample search',
              search_category: 'all',
              results_count: 10,
            })
          }
          className={styles.btnSecondary}
        >
          Track Search
        </button>
      </div>

      <div className={styles.customEventSection}>
        <h3>Custom Event</h3>
        <div className={styles.formGroup}>
          <label htmlFor="eventName">Event Name:</label>
          <input
            type="text"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g., custom_action"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="eventProperties">Event Properties (JSON):</label>
          <textarea
            id="eventProperties"
            value={eventProperties}
            onChange={(e) => setEventProperties(e.target.value)}
            placeholder='{"key": "value"}'
            rows={3}
          />
        </div>
        <button onClick={handleTrackCustom} className={styles.btnPrimary}>
          Track Custom Event
        </button>
      </div>
    </div>
  );
}

