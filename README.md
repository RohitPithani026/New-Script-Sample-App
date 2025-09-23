# Sample App with ThriveStack Analytics

A simple web application with comprehensive analytics tracking using ThriveStack.

## Features

### App Features
- **Home Page**: Welcome page with features showcase
- **Dashboard Page**: Analytics dashboard with stats and quick actions
- **Responsive Design**: Works on all devices
- **Modern UI**: Clean, professional interface

### Analytics Features
- **Page Views**: Automatic tracking of page visits
- **User Interactions**: Click tracking on buttons, links, and cards
- **Navigation Tracking**: Track movement between pages
- **Advanced Metrics**: Time on page, scroll depth, exit intent
- **User Identification**: Support for user and group identification
- **Real-time Updates**: Live dashboard data updates

## Setup Instructions

### 1. Get Your ThriveStack API Key
1. Sign up for a ThriveStack account at [thrivestack.ai](https://thrivestack.ai)
2. Create a new project
3. Copy your API key from the dashboard

### 2. Configure Analytics
1. Open `analytics-config.js`
2. Replace `'your-api-key-here'` with your actual API key:
   ```javascript
   apiKey: 'your-actual-api-key-here',
   ```

### 3. Run the App
1. Open `index.html` in your web browser
2. Navigate between pages to see analytics in action
3. Check your ThriveStack dashboard for incoming data

## Analytics Events Tracked

### Automatic Events
- `app_initialized` - When the app loads
- `page_view` - Every page visit
- `home_viewed` - Home page specific tracking
- `dashboard_viewed` - Dashboard page specific tracking
- `navigation_click` - Navigation between pages
- `time_on_page` - Time spent on each page (every 30 seconds)
- `scroll_depth` - How far users scroll (25%, 50%, 75%, 90%, 100%)
- `exit_intent` - When users try to leave the page
- `visibility_change` - When users switch tabs
- `window_resize` - When users resize their browser

### User Interaction Events
- `cta_click` - Call-to-action button clicks
- `card_hover` - Hovering over feature/stat cards
- `feature_card_click` - Clicking on feature cards
- `dashboard_action_click` - Dashboard action button clicks

## Customization

### Adding Custom Events
You can track custom events anywhere in your code:

```javascript
// Track a custom event
trackEvent('custom_event_name', {
    property1: 'value1',
    property2: 'value2'
});
```

### User Identification
Identify users when they log in:

```javascript
// Identify a user
identifyUser('user123', 'user@example.com', {
    name: 'John Doe',
    plan: 'premium'
});
```

### Group Identification
Set group information for multi-tenant apps:

```javascript
// Set group information
setGroup('company123', 'Acme Corp', {
    industry: 'Technology',
    size: '50-100 employees'
});
```

### Configuration Options
Edit `analytics-config.js` to customize tracking:

```javascript
window.ThriveStackConfig = {
    apiKey: 'your-api-key-here',
    source: 'sample-app',
    trackClicks: true,        // Track click events
    trackForms: true,         // Track form interactions
    enableDeveloperLogs: true, // Show debug logs
    customEvents: {
        trackTimeOnPage: true,     // Track time spent on pages
        trackScrollDepth: true,    // Track scroll behavior
        trackExitIntent: true      // Track exit intent
    }
};
```

## File Structure

```
sample-app/
├── index.html              # Home page
├── dashboard.html          # Dashboard page
├── styles.css             # CSS styles
├── script.js              # Main JavaScript with analytics
├── thrivestack.min.js     # ThriveStack analytics library
├── analytics-config.js    # Analytics configuration
└── README.md              # This file
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Privacy & GDPR

The analytics implementation includes:
- IP address tracking (for geolocation)
- Device fingerprinting (for unique identification)
- Cookie usage (for session management)
- User behavior tracking

Make sure to comply with your local privacy laws and include appropriate privacy notices in your app.

## Troubleshooting

### Analytics Not Working
1. Check that your API key is correct
2. Open browser developer tools and look for console errors
3. Verify that `thrivestack.min.js` is loading correctly
4. Check your ThriveStack dashboard for data

### Debug Mode
Enable debug mode to see detailed logging:

```javascript
// In browser console
window.thriveStack.enableDebugMode();
```

### Common Issues
- **CORS errors**: Make sure you're serving the files from a web server (not file://)
- **API key errors**: Verify your API key is correct and active
- **No data**: Check that tracking is enabled in your ThriveStack dashboard

## Support

For ThriveStack-specific issues, check the [ThriveStack documentation](https://docs.thrivestack.ai) or contact their support team.

For app-specific issues, check the browser console for error messages.
