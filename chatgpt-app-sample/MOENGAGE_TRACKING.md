# MoEngage Tracking Implementation Guide

This document details all MoEngage events and user attributes tracked in the hotel booking app.

## Event Tracking Overview

The app tracks comprehensive user interactions throughout the entire booking journey, from initial search to booking completion.

---

## Core Events

### 1. App Lifecycle Events

#### `app_loaded`
**Triggered**: When the app initializes and MoEngage SDK is ready

**Properties**:
```javascript
{
  load_time: number,        // Time taken to load (ms)
  page: 'home',            // Current page
  ai_platform: 'chatgpt' | 'web',
  is_ai_assisted: boolean,
  is_gpt_app: boolean,
  timestamp: string
}
```

#### `chatgpt_app_initialized`
**Triggered**: When ChatGPT Apps SDK is successfully initialized

**Properties**:
```javascript
{
  ai_platform: 'chatgpt',
  is_gpt_app: true,
  timestamp: string
}
```

#### `chatgpt_action`
**Triggered**: When user interacts with ChatGPT app interface

**Properties**:
```javascript
{
  action_type: string,     // Type of ChatGPT action
  action_data: string,     // JSON stringified action data
  timestamp: string
}
```

#### `session_end`
**Triggered**: When user leaves/closes the app

**Properties**:
```javascript
{
  session_duration: number, // Session duration in ms
  timestamp: string
}
```

---

### 2. Search Events

#### `search_form_viewed`
**Triggered**: When search form is displayed

**Properties**:
```javascript
{
  page: 'home',
  component: 'hotel_search',
  timestamp: string
}
```

#### `search_form_submitted`
**Triggered**: When user submits search form

**Properties**:
```javascript
{
  destination: string,     // Search destination
  check_in: string,       // Check-in date (YYYY-MM-DD)
  check_out: string,       // Check-out date (YYYY-MM-DD)
  guests: number,          // Number of guests
  nights: number,         // Calculated number of nights
  timestamp: string
}
```

#### `search_form_error`
**Triggered**: When search form submission fails validation

**Properties**:
```javascript
{
  error_type: 'missing_fields',
  has_destination: boolean,
  has_check_in: boolean,
  has_check_out: boolean,
  timestamp: string
}
```

#### `hotel_search`
**Triggered**: When search is executed (after form submission)

**Properties**:
```javascript
{
  destination: string,
  check_in: string,
  check_out: string,
  guests: number,
  ai_platform: 'chatgpt' | 'web',
  is_ai_assisted: boolean,
  is_gpt_app: boolean,
  timestamp: string
}
```

#### `hotel_search_results`
**Triggered**: When search results are displayed

**Properties**:
```javascript
{
  destination: string,
  results_count: number,   // Number of hotels found
  timestamp: string
}
```

---

### 3. Hotel Listing Events

#### `hotel_results_viewed`
**Triggered**: When hotel results page is displayed

**Properties**:
```javascript
{
  destination: string,
  results_count: number,
  check_in: string,
  check_out: string,
  nights: number,
  guests: number,
  timestamp: string
}
```

#### `hotel_impression`
**Triggered**: For each hotel displayed in results (one per hotel)

**Properties**:
```javascript
{
  hotel_id: string,
  hotel_name: string,
  hotel_price: number,
  hotel_rating: number,
  position: number,        // Position in results (1, 2, 3...)
  destination: string,
  timestamp: string
}
```

#### `hotel_card_clicked`
**Triggered**: When user clicks on a hotel card

**Properties**:
```javascript
{
  hotel_id: string,
  hotel_name: string,
  hotel_price: number,
  hotel_rating: number,
  position: number,        // Position in results
  destination: string,
  timestamp: string
}
```

#### `hotel_viewed`
**Triggered**: When user views hotel details (selects a hotel)

**Properties**:
```javascript
{
  hotel_id: string,
  hotel_name: string,
  hotel_price: number,
  hotel_rating: number,
  hotel_location: string,
  hotel_amenities: string,  // Comma-separated amenities
  destination: string,
  check_in: string,
  check_out: string,
  nights: number,
  guests: number,
  estimated_total: number,  // Price × nights
  timestamp: string
}
```

---

### 4. Booking Flow Events

#### `booking_flow_started`
**Triggered**: When user starts booking process

**Properties**:
```javascript
{
  hotel_id: string,
  hotel_name: string,
  step: 'hotel_selected',
  timestamp: string
}
```

#### `booking_page_viewed`
**Triggered**: When booking form page is displayed

**Properties**:
```javascript
{
  hotel_id: string,
  hotel_name: string,
  hotel_price: number,
  check_in: string,
  check_out: string,
  guests: number,
  nights: number,
  total_amount: number,
  timestamp: string
}
```

#### `booking_form_field_changed`
**Triggered**: When user types in any booking form field

**Properties**:
```javascript
{
  field_name: 'first_name' | 'last_name' | 'email' | 'phone',
  has_value: boolean,
  hotel_id: string,
  timestamp: string
}
```

#### `payment_method_selected`
**Triggered**: When user selects payment method

**Properties**:
```javascript
{
  payment_method: 'credit_card' | 'paypal',
  hotel_id: string,
  timestamp: string
}
```

#### `booking_started`
**Triggered**: When user submits booking form

**Properties**:
```javascript
{
  hotel_id: string,
  hotel_name: string,
  hotel_price: number,
  total_amount: number,
  subtotal: number,
  tax: number,
  nights: number,
  guests: number,
  check_in: string,
  check_out: string,
  payment_method: string,
  has_email: boolean,
  has_phone: boolean,
  timestamp: string
}
```

#### `booking_completed`
**Triggered**: When booking is successfully completed

**Properties**:
```javascript
{
  hotel_id: string,
  hotel_name: string,
  hotel_price: number,
  hotel_rating: number,
  booking_id: string,      // Unique booking ID
  total_amount: number,
  subtotal: number,
  tax: number,
  nights: number,
  check_in: string,
  check_out: string,
  guests: number,
  destination: string,
  currency: 'USD',
  booking_timestamp: string,
  timestamp: string
}
```

#### `conversion`
**Triggered**: When booking is completed (revenue event)

**Properties**:
```javascript
{
  conversion_type: 'hotel_booking',
  booking_id: string,
  revenue: number,         // Total booking amount
  hotel_id: string,
  timestamp: string
}
```

#### `booking_cancelled`
**Triggered**: When user cancels booking process

**Properties**:
```javascript
{
  hotel_id: string,
  hotel_name: string,
  total_amount: number,
  form_progress: {
    has_first_name: boolean,
    has_last_name: boolean,
    has_email: boolean,
    has_phone: boolean
  },
  timestamp: string
}
```

#### `booking_flow_exited`
**Triggered**: When user exits booking flow

**Properties**:
```javascript
{
  hotel_id: string,
  step: 'booking_form',
  timestamp: string
}
```

---

### 5. User Identification Events

#### `user_identified`
**Triggered**: When user is identified via UserProfile component

**Properties**:
```javascript
{
  has_name: boolean,
  has_email: boolean,
  has_mobile: boolean,
  timestamp: string
}
```

#### `user_id_updated`
**Triggered**: When user ID is updated

**Properties**:
```javascript
{
  new_user_id: string,
  timestamp: string
}
```

#### `session_destroyed`
**Triggered**: When session is destroyed/logged out

**Properties**:
```javascript
{
  timestamp: string
}
```

---

### 6. AI Detection Events

#### `ai_detection_performed`
**Triggered**: When AI detection runs on app load

**Properties**:
```javascript
{
  is_ai_bot: boolean,
  is_ai_assisted: boolean,
  is_gpt_app: boolean,
  detection_details: string,  // JSON stringified details
  timestamp: string
}
```

#### `gpt_app_session_start`
**Triggered**: When app detects it's running in ChatGPT

**Properties**:
```javascript
{
  app_url: string,
  timestamp: string
}
```

---

## User Attributes

The following user attributes are automatically set:

### AI Detection Attributes
- `ai_bot_detected`: boolean
- `ai_assisted_browser`: boolean
- `gpt_app_user`: boolean
- `user_agent`: string
- `detection_timestamp`: string

### Conditional Attributes
- `ai_assisted`: true (if AI-assisted browser detected)
- `gpt_app_user`: true (if running in ChatGPT)

### User Profile Attributes
Set via `identifyUser()`:
- `uid`: string (User ID)
- `u_fn`: string (First Name)
- `u_em`: string (Email)
- `u_mb`: string (Mobile)

---

## Event Properties Enhancement

All events automatically include these properties (via `useTracking` hook):

```javascript
{
  ai_platform: 'chatgpt' | 'web',
  is_ai_assisted: boolean,
  is_gpt_app: boolean,
  timestamp: string
}
```

---

## AI Bot Blocking

Events are automatically blocked if AI bot is detected:
- `aiDetection.shouldBlockTracking()` returns `true`
- Event tracking is skipped
- Log entry shows: "Event blocked (AI Bot detected): {event_name}"

---

## Tracking Flow Example

### Complete Booking Journey:

1. **App Loads**
   - `app_loaded`
   - `ai_detection_performed`
   - `gpt_app_session_start` (if in ChatGPT)

2. **User Searches**
   - `search_form_viewed`
   - `search_form_submitted`
   - `hotel_search`
   - `hotel_search_results`
   - `hotel_results_viewed`
   - `hotel_impression` (for each hotel)

3. **User Views Hotel**
   - `hotel_card_clicked`
   - `hotel_viewed`
   - `booking_flow_started`
   - `booking_page_viewed`

4. **User Fills Booking Form**
   - `booking_form_field_changed` (multiple times)
   - `payment_method_selected`

5. **User Completes Booking**
   - `booking_started`
   - `booking_completed`
   - `conversion`

---

## MoEngage Dashboard Usage

### Key Metrics to Monitor:

1. **Search Metrics**:
   - `hotel_search` count
   - Average `results_count` from `hotel_search_results`
   - Search-to-view conversion rate

2. **Engagement Metrics**:
   - `hotel_impression` count
   - `hotel_viewed` count
   - Click-through rate (CTR)

3. **Conversion Metrics**:
   - `booking_started` count
   - `booking_completed` count
   - Booking completion rate
   - Revenue from `conversion` events

4. **AI Platform Metrics**:
   - Events with `is_gpt_app: true`
   - Events with `is_ai_assisted: true`
   - Platform comparison (ChatGPT vs Web)

### Segmentation:

Create segments based on:
- `gpt_app_user == true` (ChatGPT users)
- `ai_assisted == true` (AI-assisted browser users)
- `booking_completed` events (Converted users)
- `destination` property (Geographic segments)

---

## Testing Tracking

1. **Open Browser DevTools** (F12)
2. **Go to Network Tab**
3. **Filter by "moengage"**
4. **Perform actions** in the app
5. **Verify events** are being sent
6. **Check MoEngage Dashboard** for events

---

## Troubleshooting

### Events Not Appearing:

1. Check MoEngage SDK initialization
2. Verify App ID and Data Center
3. Check browser console for errors
4. Verify CSP allows MoEngage domains
5. Check AI bot detection isn't blocking

### Missing Properties:

1. Verify event tracking calls include all properties
2. Check `useTracking` hook is adding AI detection properties
3. Verify user identification is set

---

## Best Practices

1. **Always include context**: Add destination, dates, hotel info where relevant
2. **Track user journey**: Track each step of the booking flow
3. **Use consistent naming**: Follow event naming conventions
4. **Include timestamps**: All events include automatic timestamps
5. **Track conversions**: Always track revenue events for bookings
6. **Monitor AI detection**: Use AI detection attributes for segmentation

---

For more information, see:
- [MoEngage Documentation](https://docs.moengage.com/)
- [ChatGPT Testing Guide](./CHATGPT_TESTING_GUIDE.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)

