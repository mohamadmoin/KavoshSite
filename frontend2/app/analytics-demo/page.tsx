import { Metadata } from 'next';
import AnalyticsExample from '../../components/AnalyticsExample';

export const metadata: Metadata = {
  title: 'Analytics Demo',
  description: 'A demonstration of analytics tracking capabilities',
};

export default function AnalyticsDemoPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Analytics Demo</h1>
      
      <div className="max-w-2xl mx-auto">
        <p className="mb-8 text-muted-foreground">
          This page demonstrates how analytics tracking is implemented in the application.
          Interact with the components below to see how events are tracked.
        </p>
        
        <AnalyticsExample />
        
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-4">How to Check Tracking</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Install the <a href="https://chrome.google.com/webstore/detail/tag-assistant-by-google/kejbdjndbnbjgmefkgdddjlbokphdefk" className="text-primary underline" target="_blank" rel="noopener noreferrer">Google Tag Assistant</a> Chrome extension</li>
            <li>Refresh this page</li>
            <li>Open the Tag Assistant to see GTM and GA4 events</li>
            <li>Interact with the components above</li>
            <li>Check the Tag Assistant to see the tracked events</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 