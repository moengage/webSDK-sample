'use client';

import { useState, useEffect } from 'react';
import { Hotel } from '@/app/page';
import { useTracking } from '@/hooks/useTracking';
import styles from './HotelBooking.module.css';

interface HotelBookingProps {
  hotel: Hotel;
  searchParams: { destination: string; checkIn: string; checkOut: string; guests: number };
  onComplete: (bookingData: { bookingId: string; totalAmount: number }) => void;
  onCancel: () => void;
}

export default function HotelBooking({ hotel, searchParams, onComplete, onCancel }: HotelBookingProps) {
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const { track } = useTracking();

  const nights = Math.ceil(
    (new Date(searchParams.checkOut).getTime() - new Date(searchParams.checkIn).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const subtotal = hotel.price * nights;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  useEffect(() => {
    track('booking_page_viewed', {
      hotel_id: hotel.id,
      hotel_name: hotel.name,
      hotel_price: hotel.price,
      check_in: searchParams.checkIn,
      check_out: searchParams.checkOut,
      guests: searchParams.guests,
      nights,
      total_amount: total,
    });
  }, [hotel.id, hotel.name, hotel.price, searchParams.checkIn, searchParams.checkOut, searchParams.guests, nights, total, track]);

  const handleFieldChange = (field: string, value: string) => {
    track('booking_form_field_changed', {
      field_name: field,
      has_value: !!value,
      hotel_id: hotel.id,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
      alert('Please fill in all guest information');
      return;
    }

    track('booking_started', {
      hotel_id: hotel.id,
      hotel_name: hotel.name,
      hotel_price: hotel.price,
      total_amount: total,
      subtotal,
      tax,
      nights,
      guests: searchParams.guests,
      check_in: searchParams.checkIn,
      check_out: searchParams.checkOut,
      payment_method: paymentMethod,
      has_email: !!guestInfo.email,
      has_phone: !!guestInfo.phone,
    });

    const bookingId = `BK${Date.now()}`;
    onComplete({ bookingId, totalAmount: total });
  };

  const handleCancel = () => {
    track('booking_cancelled', {
      hotel_id: hotel.id,
      hotel_name: hotel.name,
      total_amount: total,
      form_progress: {
        has_first_name: !!guestInfo.firstName,
        has_last_name: !!guestInfo.lastName,
        has_email: !!guestInfo.email,
        has_phone: !!guestInfo.phone,
      },
    });
    onCancel();
  };

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.bookingMain}>
        <div className={styles.hotelSummary}>
          <img src={hotel.image} alt={hotel.name} className={styles.summaryImage} />
          <div className={styles.summaryInfo}>
            <h2>{hotel.name}</h2>
            <p>{hotel.location}</p>
            <div className={styles.summaryDetails}>
              <div>
                <strong>Check-in:</strong> {new Date(searchParams.checkIn).toLocaleDateString()}
              </div>
              <div>
                <strong>Check-out:</strong> {new Date(searchParams.checkOut).toLocaleDateString()}
              </div>
              <div>
                <strong>Guests:</strong> {searchParams.guests}
              </div>
              <div>
                <strong>Nights:</strong> {nights}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.bookingForm}>
          <h3>Guest Information</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                value={guestInfo.firstName}
                onChange={(e) => {
                  setGuestInfo({ ...guestInfo, firstName: e.target.value });
                  handleFieldChange('first_name', e.target.value);
                }}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                value={guestInfo.lastName}
                onChange={(e) => {
                  setGuestInfo({ ...guestInfo, lastName: e.target.value });
                  handleFieldChange('last_name', e.target.value);
                }}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                value={guestInfo.email}
                onChange={(e) => {
                  setGuestInfo({ ...guestInfo, email: e.target.value });
                  handleFieldChange('email', e.target.value);
                }}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone *</label>
              <input
                type="tel"
                id="phone"
                value={guestInfo.phone}
                onChange={(e) => {
                  setGuestInfo({ ...guestInfo, phone: e.target.value });
                  handleFieldChange('phone', e.target.value);
                }}
                required
              />
            </div>
          </div>

          <h3>Payment Method</h3>
          <div className={styles.paymentOptions}>
            <label>
              <input
                type="radio"
                name="payment"
                value="credit_card"
                checked={paymentMethod === 'credit_card'}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  track('payment_method_selected', {
                    payment_method: e.target.value,
                    hotel_id: hotel.id,
                  });
                }}
              />
              Credit Card
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  track('payment_method_selected', {
                    payment_method: e.target.value,
                    hotel_id: hotel.id,
                  });
                }}
              />
              PayPal
            </label>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={handleCancel} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Complete Booking
            </button>
          </div>
        </form>
      </div>

      <div className={styles.bookingSidebar}>
        <div className={styles.priceSummary}>
          <h3>Price Summary</h3>
          <div className={styles.priceRow}>
            <span>${hotel.price} × {nights} nights</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.priceRow}>
            <span>Taxes & Fees</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className={styles.priceTotal}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

