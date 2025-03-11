import { MetadataRoute } from 'next';

// This file replaces the static favicon.ico in the app directory
// and avoids the conflict with the one in the public directory
export default function favicon(): MetadataRoute.Favicon {
  return [
    {
      rel: 'icon',
      url: '/favicon.ico',
      sizes: 'any',
    },
  ];
} 