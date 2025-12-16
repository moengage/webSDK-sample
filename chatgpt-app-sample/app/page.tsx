'use client';

import { useEffect, useState, useCallback } from 'react';
import { useMoEngage } from '@/hooks/useMoEngage';
import { useTracking, LogEntry } from '@/hooks/useTracking';
import { initializeChatGPTApps } from '@/lib/chatgpt-apps';
import { trackEvent } from '@/lib/moengage';
import HotelSearch from '@/components/HotelSearch';
import HotelResults from '@/components/HotelResults';
import HotelBooking from '@/components/HotelBooking';
import UserProfile from '@/components/UserProfile';
import TrackingLogs from '@/components/TrackingLogs';
import styles from './page.module.css';

const MOENGAGE_CONFIG = {
  dataCenter: process.env.NEXT_PUBLIC_MOENGAGE_DATACENTER || 'dc_01',
  appId: process.env.NEXT_PUBLIC_MOENGAGE_APP_ID || '3RADPYNEBZ2MCOJ43EEW5FWV',
  sdkVersion: '2',
  debugLogs: 0,
};

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  image: string;
  amenities: string[];
  description: string;
}

export default function Home() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchParams, setSearchParams] = useState<{
    destination: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  } | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const { isReady } = useMoEngage(MOENGAGE_CONFIG);

  const handleLog = useCallback((log: LogEntry) => {
    setLogs((prev) => [...prev, log]);
  }, []);

  const { track } = useTracking(handleLog);

  useEffect(() => {
    if (isReady) {
      track('app_loaded', {
        load_time: typeof window !== 'undefined' ? performance.now() : 0,
        page: 'home',
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

  const handleSearch = (params: { destination: string; checkIn: string; checkOut: string; guests: number }) => {
    setSearchParams(params);
    track('hotel_search', {
      destination: params.destination,
      check_in: params.checkIn,
      check_out: params.checkOut,
      guests: params.guests,
    });

    const mockHotels: Hotel[] = [
      {
        id: '1',
        name: 'Grand Plaza Hotel',
        location: params.destination,
        rating: 4.5,
        price: 129,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant'],
        description: 'Luxurious hotel in the heart of the city with stunning views and world-class amenities.',
      },
      {
        id: '2',
        name: 'Oceanview Resort',
        location: params.destination,
        rating: 4.8,
        price: 199,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
        amenities: ['Beach Access', 'Pool', 'Spa', 'Free WiFi', 'Parking'],
        description: 'Beachfront resort with direct access to pristine beaches and tropical paradise.',
      },
      {
        id: '3',
        name: 'City Center Inn',
        location: params.destination,
        rating: 4.2,
        price: 89,
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        amenities: ['Free WiFi', 'Breakfast', 'Gym'],
        description: 'Comfortable and affordable hotel located in the bustling city center.',
      },
      {
        id: '4',
        name: 'Mountain View Lodge',
        location: params.destination,
        rating: 4.6,
        price: 149,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
        amenities: ['Mountain Views', 'Hiking Trails', 'Spa', 'Restaurant'],
        description: 'Scenic mountain retreat with breathtaking views and outdoor activities.',
      },
    ];

    setTimeout(() => {
      setHotels(mockHotels);
      track('hotel_search_results', {
        destination: params.destination,
        results_count: mockHotels.length,
      });
    }, 500);
  };

  const handleHotelSelect = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setShowBooking(true);
    const nights = searchParams
      ? Math.ceil(
          (new Date(searchParams.checkOut).getTime() - new Date(searchParams.checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

    track('hotel_viewed', {
      hotel_id: hotel.id,
      hotel_name: hotel.name,
      hotel_price: hotel.price,
      hotel_rating: hotel.rating,
      hotel_location: hotel.location,
      hotel_amenities: hotel.amenities.join(', '),
      destination: searchParams?.destination,
      check_in: searchParams?.checkIn,
      check_out: searchParams?.checkOut,
      nights,
      guests: searchParams?.guests,
      estimated_total: hotel.price * nights,
    });

    track('booking_flow_started', {
      hotel_id: hotel.id,
      hotel_name: hotel.name,
      step: 'hotel_selected',
    });
  };

  const handleBookingComplete = (bookingData: any) => {
    const nights = searchParams
      ? Math.ceil(
          (new Date(searchParams.checkOut).getTime() - new Date(searchParams.checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

    track('booking_completed', {
      hotel_id: selectedHotel?.id,
      hotel_name: selectedHotel?.name,
      hotel_price: selectedHotel?.price,
      hotel_rating: selectedHotel?.rating,
      booking_id: bookingData.bookingId,
      total_amount: bookingData.totalAmount,
      subtotal: selectedHotel ? selectedHotel.price * nights : 0,
      tax: bookingData.totalAmount * 0.1,
      nights,
      check_in: searchParams?.checkIn,
      check_out: searchParams?.checkOut,
      guests: searchParams?.guests,
      destination: searchParams?.destination,
      currency: 'USD',
      booking_timestamp: new Date().toISOString(),
    });

    track('conversion', {
      conversion_type: 'hotel_booking',
      booking_id: bookingData.bookingId,
      revenue: bookingData.totalAmount,
      hotel_id: selectedHotel?.id,
    });

    alert(`Booking confirmed! Booking ID: ${bookingData.bookingId}`);
    setShowBooking(false);
    setSelectedHotel(null);
    setSearchParams(null);
    setHotels([]);
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>Booking.com</h1>
          <div className={styles.headerStatus}>
            {!isReady && <span className={styles.statusBadge}>Initializing MoEngage...</span>}
            {isReady && <span className={styles.statusBadgeReady}>MoEngage Ready ✓</span>}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {!showBooking ? (
          <>
            <HotelSearch onSearch={handleSearch} />
            {hotels.length > 0 && (
              <HotelResults
                hotels={hotels}
                searchParams={searchParams!}
                onHotelSelect={handleHotelSelect}
              />
            )}
          </>
        ) : (
          <HotelBooking
            hotel={selectedHotel!}
            searchParams={searchParams!}
            onComplete={handleBookingComplete}
            onCancel={() => {
              track('booking_flow_exited', {
                hotel_id: selectedHotel?.id,
                step: 'booking_form',
              });
              setShowBooking(false);
              setSelectedHotel(null);
            }}
          />
        )}
      </main>

      <aside className={styles.sidebar}>
        <UserProfile />
        <TrackingLogs logs={logs} onClear={() => setLogs([])} />
      </aside>
    </div>
  );
}
