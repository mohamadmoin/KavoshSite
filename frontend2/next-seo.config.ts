import { DefaultSeoProps } from 'next-seo';

const config: DefaultSeoProps = {
  titleTemplate: '%s | KavoshSite Blog',
  defaultTitle: 'KavoshSite Blog - AI-Generated Tech Insights',
  description: 'Discover insightful tech articles generated with AI, covering programming, technology, and software development.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kavoshai.com/',
    siteName: 'KavoshSite Blog',
    images: [
      {
        url: 'https://kavoshai.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KavoshSite Blog',
      },
    ],
  },
  twitter: {
    handle: '@kavoshai',
    site: '@kavoshai',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'theme-color',
      content: '#ffffff',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'manifest',
      href: '/manifest.json',
    },
  ],
};

export default config; 