'use client';

import { useState, useEffect } from 'react';
import { useTracking } from '@/hooks/useTracking';
import styles from './HotelSearch.module.css';

interface HotelSearchProps {
  onSearch: (params: { destination: string; checkIn: string; checkOut: string; guests: number }) => void;
}

export default function HotelSearch({ onSearch }: HotelSearchProps) {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const { track } = useTracking();

  useEffect(() => {
    track('search_form_viewed', {
      page: 'home',
      component: 'hotel_search',
    });
  }, [track]);

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !checkIn || !checkOut) {
      track('search_form_error', {
        error_type: 'missing_fields',
        has_destination: !!destination,
        has_check_in: !!checkIn,
        has_check_out: !!checkOut,
      });
      alert('Please fill in all fields');
      return;
    }

    track('search_form_submitted', {
      destination,
      check_in: checkIn,
      check_out: checkOut,
      guests,
      nights: Math.ceil(
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
      ),
    });

    onSearch({ destination, checkIn, checkOut, guests });
  };

  return (
    <div className={styles.searchContainer}>
      <h2 className={styles.title}>Find your perfect stay</h2>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="destination">Where are you going?</label>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="checkIn">Check-in date</label>
            <input
              type="date"
              id="checkIn"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={today}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="checkOut">Check-out date</label>
            <input
              type="date"
              id="checkOut"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || tomorrow}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="guests">Guests</label>
            <input
              type="number"
              id="guests"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
              min={1}
              max={10}
              required
            />
          </div>

          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

