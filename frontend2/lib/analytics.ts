/**
 * Analytics utility functions for tracking page views and events
 */

// Define the dataLayer type
declare global {
  interface Window {
    dataLayer: any[];
  }
}

/**
 * Track a page view in Google Analytics
 * @param url The URL of the page
 * @param title The title of the page
 */
export function trackPageView(url: string, title: string) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'page_view',
      page: {
        path: url,
        title: title,
      },
    });
  }
}

/**
 * Track a custom event in Google Analytics
 * @param eventName The name of the event
 * @param eventParams Additional parameters for the event
 */
export function trackEvent(eventName: string, eventParams: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventParams,
    });
  }
}

/**
 * Initialize the dataLayer
 */
export function initDataLayer() {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
}

/**
 * Hook to track page views
 * Should be used in _app.js or a layout component
 */
export function usePageViewTracking() {
  if (typeof window !== 'undefined') {
    // Initialize dataLayer if it doesn't exist
    initDataLayer();
    
    // Track the current page view
    const url = window.location.pathname + window.location.search;
    const title = document.title;
    trackPageView(url, title);
  }
} 