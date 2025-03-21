import { useEffect, useState } from 'react';
import { GoogleTagManagerHead, GoogleTagManagerBody } from './GoogleTagManager';
import { getSEOSettings } from '../lib/api';

export function AnalyticsHead() {
  const [gtmId, setGtmId] = useState<string>('');
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSEOSettings();
        if (settings.google_tag_manager_id) {
          setGtmId(settings.google_tag_manager_id);
        }
      } catch (error) {
        console.error('Error fetching analytics settings:', error);
        // Fallback to hardcoded ID if API fails
        setGtmId('GTM-PWP4Z4FG');
      }
    };
    
    fetchSettings();
  }, []);
  
  if (!gtmId) return null;
  
  return <GoogleTagManagerHead gtmId={gtmId} />;
}

export function AnalyticsBody() {
  const [gtmId, setGtmId] = useState<string>('');
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSEOSettings();
        if (settings.google_tag_manager_id) {
          setGtmId(settings.google_tag_manager_id);
        }
      } catch (error) {
        console.error('Error fetching analytics settings:', error);
        // Fallback to hardcoded ID if API fails
        setGtmId('GTM-PWP4Z4FG');
      }
    };
    
    fetchSettings();
  }, []);
  
  if (!gtmId) return null;
  
  return <GoogleTagManagerBody gtmId={gtmId} />;
} 