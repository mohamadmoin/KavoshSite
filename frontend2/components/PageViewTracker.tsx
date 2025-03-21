'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView, initDataLayer } from '../lib/analytics';

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Initialize dataLayer
    initDataLayer();
    
    // Function to track page view
    const handlePageView = () => {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      trackPageView(url, document.title);
    };
    
    // Track page view on mount and when route changes
    handlePageView();
  }, [pathname, searchParams]);
  
  // This component doesn't render anything
  return null;
} 