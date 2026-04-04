'use client';

import { useEffect } from 'react';
import { Hotel } from '@/app/page';
import { useTracking } from '@/hooks/useTracking';
import styles from './HotelResults.module.css';

interface HotelResultsProps {
  hotels: Hotel[];
  searchParams: { destination: string; checkIn: string; checkOut: string; guests: number };
  onHotelSelect: (hotel: Hotel) => void;
}

export default function HotelResults({ hotels, searchParams, onHotelSelect }: HotelResultsProps) {
  const { track } = useTracking();
  const nights = Math.ceil(
    (new Date(searchParams.checkOut).getTime() - new Date(searchParams.checkIn).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  useEffect(() => {
    if (hotels.length > 0) {
      track('hotel_results_viewed', {
        destination: searchParams.destination,
        results_count: hotels.length,
        check_in: searchParams.checkIn,
        check_out: searchParams.checkOut,
        nights,
        guests: searchParams.guests,
      });

      hotels.forEach((hotel, index) => {
        track('hotel_impression', {
          hotel_id: hotel.id,
          hotel_name: hotel.name,
          hotel_price: hotel.price,
          hotel_rating: hotel.rating,
          position: index + 1,
          destination: searchParams.destination,
        });
      });
    }
  }, [hotels, searchParams, nights, track]);

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.resultsHeader}>
        <h2>
          {hotels.length} properties found in {searchParams.destination}
        </h2>
        <p className={styles.dates}>
          {new Date(searchParams.checkIn).toLocaleDateString()} -{' '}
          {new Date(searchParams.checkOut).toLocaleDateString()} • {nights} nights • {searchParams.guests} guest
          {searchParams.guests > 1 ? 's' : ''}
        </p>
      </div>

      <div className={styles.hotelsList}>
        {hotels.map((hotel, index) => (
          <div
            key={hotel.id}
            className={styles.hotelCard}
            onClick={() => {
              track('hotel_card_clicked', {
                hotel_id: hotel.id,
                hotel_name: hotel.name,
                hotel_price: hotel.price,
                hotel_rating: hotel.rating,
                position: index + 1,
                destination: searchParams.destination,
              });
              onHotelSelect(hotel);
            }}
          >
            <div className={styles.hotelImage}>
              <img src={hotel.image} alt={hotel.name} />
              <div className={styles.ratingBadge}>
                <span className={styles.ratingValue}>{hotel.rating}</span>
              </div>
            </div>
            <div className={styles.hotelInfo}>
              <h3 className={styles.hotelName}>{hotel.name}</h3>
              <p className={styles.hotelLocation}>{hotel.location}</p>
              <p className={styles.hotelDescription}>{hotel.description}</p>
              <div className={styles.amenities}>
                {hotel.amenities.map((amenity, index) => (
                  <span key={index} className={styles.amenity}>
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.hotelPrice}>
              <div className={styles.priceContainer}>
                <span className={styles.priceLabel}>Price per night</span>
                <span className={styles.price}>${hotel.price}</span>
                <span className={styles.totalPrice}>${hotel.price * nights} total</span>
              </div>
              <button className={styles.selectButton}>Select</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

