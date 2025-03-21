'use client';

import { useState } from 'react';
import { useAnalytics } from '../lib/useAnalytics';

/**
 * Example component demonstrating how to use the analytics hook
 * This is for demonstration purposes only and should not be used in production
 */
export default function AnalyticsExample() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { trackButtonClick, trackFormSubmission, trackCustomEvent } = useAnalytics();
  
  const handleButtonClick = () => {
    // Track the button click
    trackButtonClick('example_button', 'analytics_example');
    
    // Your button click logic
    alert('Button clicked! This event was tracked.');
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track the form submission
    trackFormSubmission('newsletter_form', 'analytics_example', true);
    
    // Your form submission logic
    setSubmitted(true);
    
    // Track a custom event
    trackCustomEvent('newsletter_signup', {
      email_domain: email.split('@')[1] || 'unknown',
    });
  };
  
  return (
    <div className="p-6 bg-card rounded-lg border border-border">
      <h2 className="text-xl font-semibold mb-4">Analytics Example</h2>
      
      <div className="mb-6">
        <button
          onClick={handleButtonClick}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Track Button Click
        </button>
        <p className="mt-2 text-sm text-muted-foreground">
          Clicking this button will track a 'button_click' event.
        </p>
      </div>
      
      {!submitted ? (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Subscribe & Track Form Submission
          </button>
          <p className="text-sm text-muted-foreground">
            Submitting this form will track a 'form_submission' event and a custom 'newsletter_signup' event.
          </p>
        </form>
      ) : (
        <div className="p-4 bg-green-100 text-green-800 rounded-md">
          Thanks for subscribing! The form submission was tracked.
        </div>
      )}
      
      <div className="mt-6 p-4 bg-muted rounded-md">
        <h3 className="font-medium mb-2">How It Works</h3>
        <p className="text-sm">
          This component demonstrates how to use the <code>useAnalytics</code> hook to track:
        </p>
        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
          <li>Button clicks with <code>trackButtonClick</code></li>
          <li>Form submissions with <code>trackFormSubmission</code></li>
          <li>Custom events with <code>trackCustomEvent</code></li>
        </ul>
      </div>
    </div>
  );
} 