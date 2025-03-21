'use client';

import { useCallback } from 'react';
import { trackEvent } from './analytics';

/**
 * Custom hook for tracking events
 * @returns Object with tracking functions
 */
export function useAnalytics() {
  /**
   * Track a button click
   * @param buttonName The name of the button
   * @param buttonLocation The location of the button (e.g., 'header', 'footer')
   */
  const trackButtonClick = useCallback((buttonName: string, buttonLocation: string) => {
    trackEvent('button_click', {
      button_name: buttonName,
      button_location: buttonLocation,
    });
  }, []);

  /**
   * Track a form submission
   * @param formName The name of the form
   * @param formLocation The location of the form
   * @param success Whether the submission was successful
   */
  const trackFormSubmission = useCallback((formName: string, formLocation: string, success: boolean) => {
    trackEvent('form_submission', {
      form_name: formName,
      form_location: formLocation,
      success: success,
    });
  }, []);

  /**
   * Track a blog post view
   * @param postId The ID of the blog post
   * @param postTitle The title of the blog post
   * @param postCategory The category of the blog post
   */
  const trackBlogPostView = useCallback((postId: string, postTitle: string, postCategory: string) => {
    trackEvent('blog_post_view', {
      post_id: postId,
      post_title: postTitle,
      post_category: postCategory,
    });
  }, []);

  /**
   * Track a custom event
   * @param eventName The name of the event
   * @param eventParams Additional parameters for the event
   */
  const trackCustomEvent = useCallback((eventName: string, eventParams: Record<string, any> = {}) => {
    trackEvent(eventName, eventParams);
  }, []);

  return {
    trackButtonClick,
    trackFormSubmission,
    trackBlogPostView,
    trackCustomEvent,
  };
} 