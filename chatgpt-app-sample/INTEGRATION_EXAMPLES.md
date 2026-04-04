# Integration Examples

## Example 1: E-commerce Product Tracking

```javascript
// Track product view
trackingManager.trackEvent('product_view', {
    product_id: 'PROD123',
    product_name: 'Wireless Headphones',
    product_category: 'Electronics',
    product_price: 199.99,
    currency: 'USD',
    brand: 'TechBrand'
});

// Track add to cart
trackingManager.trackEvent('add_to_cart', {
    product_id: 'PROD123',
    product_name: 'Wireless Headphones',
    quantity: 2,
    price: 199.99,
    currency: 'USD',
    cart_value: 399.98
});

// Track purchase
trackingManager.trackEvent('purchase', {
    order_id: 'ORD789',
    product_id: 'PROD123',
    product_name: 'Wireless Headphones',
    quantity: 2,
    total_amount: 399.98,
    currency: 'USD',
    payment_method: 'credit_card',
    shipping_method: 'express'
});
```

## Example 2: User Journey Tracking

```javascript
// Identify user on login
trackingManager.handleIdentifyUser();

// Track key milestones
trackingManager.trackEvent('user_signed_up', {
    signup_method: 'email',
    referral_source: 'organic'
});

trackingManager.trackEvent('onboarding_completed', {
    steps_completed: 5,
    time_taken: 120
});

trackingManager.trackEvent('feature_used', {
    feature_name: 'advanced_search',
    usage_count: 3
});
```

## Example 3: AI-Assisted User Segmentation

```javascript
// The app automatically detects AI-assisted browsers
// You can use this in MoEngage to create segments:

// Segment 1: AI-Assisted Users
// Condition: ai_assisted_browser == true

// Segment 2: GPT App Users
// Condition: gpt_app_user == true

// Segment 3: High-Intent AI Users
// Condition: ai_assisted_browser == true AND purchase_count > 0

// Track specific events for AI-assisted users
if (aiDetection.getDetectionResults().isAIAssisted) {
    trackingManager.trackEvent('ai_assisted_interaction', {
        interaction_type: 'product_search',
        ai_features_used: ['voice_search', 'smart_suggestions']
    });
}
```

## Example 4: Custom Event with Rich Properties

```javascript
// Track a custom event with detailed properties
trackingManager.trackEvent('content_engagement', {
    content_type: 'article',
    content_id: 'ART456',
    content_title: 'How to Use AI in Marketing',
    reading_time: 180,
    scroll_depth: 85,
    shares: 3,
    likes: 12,
    comments: 5
});
```

## Example 5: Form Tracking

```javascript
// Track form submissions
trackingManager.trackEvent('form_submitted', {
    form_type: 'contact',
    form_id: 'contact_form_1',
    fields_completed: 5,
    time_to_complete: 45,
    submission_successful: true
});

// Track form abandonment
trackingManager.trackEvent('form_abandoned', {
    form_type: 'checkout',
    form_id: 'checkout_form',
    fields_completed: 3,
    total_fields: 8,
    abandonment_reason: 'timeout'
});
```

## Example 6: Search and Discovery

```javascript
// Track search queries
trackingManager.trackEvent('search', {
    search_query: 'wireless headphones',
    search_category: 'electronics',
    results_count: 24,
    filters_applied: ['price_range', 'brand'],
    search_source: 'header'
});

// Track search result clicks
trackingManager.trackEvent('search_result_clicked', {
    search_query: 'wireless headphones',
    result_position: 3,
    result_id: 'PROD123',
    click_through: true
});
```

## Example 7: Campaign Engagement

```javascript
// MoEngage automatically tracks campaign events
// But you can also track custom campaign interactions:

trackingManager.trackEvent('campaign_interaction', {
    campaign_id: 'SUMMER_SALE_2024',
    campaign_type: 'banner',
    interaction_type: 'click',
    campaign_name: 'Summer Sale 2024'
});
```

## Example 8: Error and Performance Tracking

```javascript
// Track errors
trackingManager.trackEvent('error_occurred', {
    error_type: 'javascript_error',
    error_message: 'Failed to load product data',
    error_location: 'product_page',
    user_agent: navigator.userAgent
});

// Track performance
trackingManager.trackEvent('performance_metric', {
    metric_name: 'page_load_time',
    metric_value: 1250,
    page_url: window.location.href
});
```

## Example 9: Multi-Step Process Tracking

```javascript
// Track multi-step processes
const steps = ['view_product', 'add_to_cart', 'checkout', 'payment', 'confirmation'];

steps.forEach((step, index) => {
    trackingManager.trackEvent('checkout_step', {
        step_name: step,
        step_number: index + 1,
        total_steps: steps.length,
        timestamp: new Date().toISOString()
    });
});
```

## Example 10: Conditional Tracking Based on AI Detection

```javascript
// Track differently based on AI detection
const detection = aiDetection.getDetectionResults();

if (detection.isAIBot) {
    // Don't track - already handled by shouldBlockTracking()
    console.log('Bot detected - tracking blocked');
} else if (detection.isGPTApp) {
    // Enhanced tracking for GPT app users
    trackingManager.trackEvent('gpt_app_interaction', {
        interaction_type: 'product_inquiry',
        gpt_context: 'user_asked_about_product',
        response_provided: true
    });
} else if (detection.isAIAssisted) {
    // Track AI-assisted features
    trackingManager.trackEvent('ai_feature_used', {
        feature_type: 'smart_suggestions',
        user_satisfaction: 'high'
    });
} else {
    // Standard tracking for regular users
    trackingManager.trackEvent('standard_interaction', {
        interaction_type: 'page_view'
    });
}
```

## Example 11: User Attribute Updates

```javascript
// Update user attributes
if (typeof Moengage !== 'undefined' && Moengage) {
    Moengage.add_user_attribute({
        subscription_status: 'premium',
        subscription_tier: 'pro',
        last_purchase_date: '2024-01-15',
        total_purchases: 5,
        lifetime_value: 499.95,
        favorite_category: 'electronics'
    });
}
```

## Example 12: Session-Based Tracking

```javascript
// Track session start
trackingManager.trackEvent('session_start', {
    referrer: document.referrer,
    landing_page: window.location.href,
    device_type: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
});

// Track session end (automatically handled on beforeunload)
// But you can also track manually:
window.addEventListener('beforeunload', () => {
    trackingManager.trackEvent('session_end_manual', {
        session_duration: performance.now(),
        pages_viewed: 5
    });
});
```

## Best Practices

1. **Always identify users before tracking events** - This ensures proper attribution
2. **Use consistent event names** - Follow a naming convention (e.g., snake_case)
3. **Include relevant context** - Add properties that help with analysis
4. **Respect AI bot detection** - Don't override the blocking mechanism
5. **Track user journey** - Track key milestones in user flows
6. **Use custom events wisely** - Don't over-track, focus on meaningful events
7. **Test in MoEngage dashboard** - Verify events appear correctly
8. **Monitor event volume** - Be mindful of event limits

## Integration with MoEngage Dashboard

After tracking events, you can:

1. **Create Segments** - Use event properties and user attributes
2. **Build Journeys** - Create user journey flows based on events
3. **Set up Campaigns** - Target users based on behavior
4. **Analyze Funnels** - Track conversion funnels
5. **Create Reports** - Build custom reports with tracked events

