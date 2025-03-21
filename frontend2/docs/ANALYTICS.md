# Analytics Implementation Guide

This document outlines how analytics are implemented in the KavoshSite project.

## Overview

We use Google Tag Manager (GTM) as our tag management system, which allows us to deploy various tracking tools including Google Analytics 4 (GA4) without modifying the codebase.

## Setup

### Google Tag Manager

GTM is implemented in the Next.js app using the `GoogleTagManager` component:

- `GoogleTagManagerHead`: Added to the `<head>` section of the layout
- `GoogleTagManagerBody`: Added immediately after the opening `<body>` tag

The GTM ID is stored in the Django backend's SEO settings and can be updated through the admin panel.

### Google Analytics 4

GA4 is configured through Google Tag Manager. The GA4 measurement ID is: `G-BEBHH24NZP`.

## Tracking Implementation

### Page Views

Page views are automatically tracked using the `PageViewTracker` component, which is included in the root layout. This component:

1. Initializes the dataLayer
2. Tracks page views when the route changes
3. Includes the page path and title in the tracking data

### Custom Events

Custom events can be tracked using the `useAnalytics` hook:

```tsx
import { useAnalytics } from '../lib/useAnalytics';

function MyComponent() {
  const { trackButtonClick, trackFormSubmission, trackCustomEvent } = useAnalytics();
  
  const handleButtonClick = () => {
    // Track the button click
    trackButtonClick('signup_button', 'hero_section');
    
    // Your button click logic
  };
  
  return (
    <button onClick={handleButtonClick}>Sign Up</button>
  );
}
```

### Available Tracking Functions

The `useAnalytics` hook provides the following tracking functions:

- `trackButtonClick(buttonName, buttonLocation)`: Track button clicks
- `trackFormSubmission(formName, formLocation, success)`: Track form submissions
- `trackBlogPostView(postId, postTitle, postCategory)`: Track blog post views
- `trackCustomEvent(eventName, eventParams)`: Track any custom event

## Data Layer

The dataLayer is initialized in the `analytics.ts` file and is used to pass data to GTM. You can push custom events to the dataLayer using:

```javascript
window.dataLayer.push({
  event: 'custom_event',
  // Additional parameters
});
```

## Testing

To test that analytics are working correctly:

1. Install the [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-by-google/kejbdjndbnbjgmefkgdddjlbokphdefk) Chrome extension
2. Open your local development site
3. Click on the Tag Assistant icon to see if GTM and GA4 are firing correctly

## Adding New Events

To add new tracking events:

1. Add a new tracking function to the `useAnalytics` hook
2. Use the function in your components
3. Configure the event in Google Tag Manager to ensure it's sent to GA4

## Best Practices

- Always include descriptive event names and parameters
- Group related events with consistent naming conventions
- Avoid tracking personally identifiable information (PII)
- Test new tracking implementations before deploying to production 


Implementation Summary
1. Google Tag Manager Integration
Created a GoogleTagManager.tsx component with head and body parts
Added GTM to the Next.js layout file
Updated the Django backend to store the GTM ID
2. Analytics Tracking Framework
Created a comprehensive analytics utility library (analytics.ts)
Implemented automatic page view tracking with PageViewTracker component
Created a custom hook (useAnalytics.ts) for tracking various events
3. Demo and Examples
Created an example component showing how to use the analytics hooks
Added a demo page at /analytics-demo to showcase the implementation
4. Documentation
Created detailed documentation in frontend2/docs/ANALYTICS.md
Updated the main README with analytics information
5. Backend Integration
Updated the SEO settings in Django with the GTM and GA4 IDs
Created a script to easily update these settings
How to Test
Start your Next.js development server
Navigate to /analytics-demo
Install the Google Tag Assistant Chrome extension
Interact with the demo components
Check the Tag Assistant to see the events being tracked
Next Steps
Configure GTM in the Google Tag Manager Dashboard:
Log in to your GTM account
Create a GA4 tag with your measurement ID (G-BEBHH24NZP)
Set up triggers for the custom events we're tracking
Set Up Goals and Conversions in GA4:
Log in to your GA4 account
Create goals for important actions (form submissions, etc.)
Set up conversion tracking
Implement User Behavior Tracking:
Consider adding Hotjar for heatmaps and session recordings
This can be done through GTM without code changes
Create Custom Reports:
Set up custom reports in GA4 to track your KPIs
Create dashboards for easy monitoring
Additional Recommendations
Funnel Analysis:
Use GA4's funnel analysis to track user journeys
Identify drop-off points in your conversion process
A/B Testing:
Consider implementing Google Optimize for A/B testing
This can be integrated through GTM
Enhanced E-commerce Tracking:
If you plan to sell products, implement e-commerce tracking
Track product views, add-to-carts, and purchases
Would you like me to help with any specific aspect of the implementation or explain any part in more detail?