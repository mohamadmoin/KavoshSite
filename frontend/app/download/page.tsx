import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import Layout from '../components/Layout';

export const metadata: Metadata = {
  title: 'Download Kavosh AI | Get the App',
  description: 'Download Kavosh AI for iOS and Android. Our innovative AI-powered app automates your daily tasks, boosts productivity, and simplifies your workflow.',
  openGraph: {
    title: 'Download Kavosh AI | Get the App',
    description: 'Download Kavosh AI for iOS and Android. Our innovative AI-powered app automates your daily tasks, boosts productivity, and simplifies your workflow.',
    url: 'https://kavoshai.com/download',
    images: [
      {
        url: 'https://kavoshai.com/images/download-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Kavosh AI App Download',
      },
    ],
  },
};

export default function DownloadPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Download Kavosh AI</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Get our powerful AI task automation app on your device and start boosting your productivity today.
            </p>
            
            <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
              <a 
                href="https://apps.apple.com/app/kavosh-ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-xl font-semibold">App Store</div>
                </div>
              </a>
              
              <a 
                href="https://play.google.com/store/apps/details?id=com.kavosh.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.609 22.186c-.181.181-.29.423-.29.684v-.369c0-.26.109-.522.29-.703L13.323 12 3.609 2.186A.97.97 0 013.32 1.483c0 .261.109.523.29.703z" />
                  <path d="M14.4 12.8L16.85 10.4l-2.45-2.4L5.2 1.6c-.356-.383-.948-.383-1.304 0l10.503 11.2z" />
                  <path d="M16.85 10.4L14.4 12.8 13.6 13.6 3.918 24c.356.382.948.382 1.304 0L16.85 10.4z" />
                  <path d="M14.4 12.8l-9.2 9.6c-.33.351-.768.552-1.228.6h.142c.442 0 .872-.184 1.182-.516l9.2-9.6-.096-.084z" />
                </svg>
                <div>
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-xl font-semibold">Google Play</div>
                </div>
              </a>
            </div>
            
            <div className="relative max-w-md mx-auto">
              <div className="absolute -inset-1 bg-blue-500/20 rounded-3xl blur-lg"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-blue-900 p-1 rounded-3xl shadow-2xl">
                <Image
                  src="/images/app-preview.png"
                  alt="Kavosh AI App Preview"
                  width={300}
                  height={600}
                  className="rounded-2xl mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Download Kavosh AI?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience the benefits of AI-powered task automation on your device.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="bg-blue-100 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Save Time</h3>
              <p className="text-gray-600">
                Our app automates routine tasks, giving you back hours of your day for what's most important.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="bg-blue-100 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Privacy First</h3>
              <p className="text-gray-600">
                Your data stays on your device unless you choose to share it, ensuring your information remains private.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="bg-blue-100 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Continuous Learning</h3>
              <p className="text-gray-600">
                Our AI adapts to your preferences and habits, becoming more effective the more you use it.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* System Requirements */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">System Requirements</h2>
              <p className="text-lg text-gray-600">
                Check if your device is compatible with Kavosh AI.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <svg className="w-6 h-6 text-blue-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  iOS Requirements
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>iOS 14.0 or later</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Compatible with iPhone, iPad, and iPod touch</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>200 MB free space</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <svg className="w-6 h-6 text-blue-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.609 22.186c-.181.181-.29.423-.29.684v-.369c0-.26.109-.522.29-.703L13.323 12 3.609 2.186A.97.97 0 013.32 1.483c0 .261.109.523.29.703z" />
                    <path d="M14.4 12.8L16.85 10.4l-2.45-2.4L5.2 1.6c-.356-.383-.948-.383-1.304 0l10.503 11.2z" />
                    <path d="M16.85 10.4L14.4 12.8 13.6 13.6 3.918 24c.356.382.948.382 1.304 0L16.85 10.4z" />
                    <path d="M14.4 12.8l-9.2 9.6c-.33.351-.768.552-1.228.6h.142c.442 0 .872-.184 1.182-.516l9.2-9.6-.096-.084z" />
                  </svg>
                  Android Requirements
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Android 8.0 (Oreo) or later</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>4 GB RAM recommended</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>250 MB free space</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">
                Got questions about downloading or installing Kavosh AI? Find answers below.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2">Is Kavosh AI free to download?</h3>
                <p className="text-gray-600">
                  Yes, Kavosh AI is free to download. We offer a basic version with essential features at no cost, 
                  with optional premium features available through in-app purchases.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2">Will Kavosh AI work on my older device?</h3>
                <p className="text-gray-600">
                  While we optimize for performance on a wide range of devices, we recommend using devices that 
                  meet our minimum requirements for the best experience. Some advanced features may be limited on 
                  older hardware.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2">How often is Kavosh AI updated?</h3>
                <p className="text-gray-600">
                  We release updates approximately every 2-4 weeks, bringing new features, improvements, and bug fixes. 
                  We recommend keeping automatic updates enabled to ensure you always have the latest version.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2">Does Kavosh AI require an internet connection?</h3>
                <p className="text-gray-600">
                  Basic functionality works offline, with on-device AI processing. However, some advanced features, 
                  cloud syncing, and certain integrations require an internet connection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Boost Your Productivity?</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Join thousands of users who have transformed their workflow with Kavosh AI.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <a 
              href="https://apps.apple.com/app/kavosh-ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-white text-blue-700 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div>
                <div className="text-xs">Download on the</div>
                <div className="text-xl font-semibold">App Store</div>
              </div>
            </a>
            
            <a 
              href="https://play.google.com/store/apps/details?id=com.kavosh.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-white text-blue-700 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.609 22.186c-.181.181-.29.423-.29.684v-.369c0-.26.109-.522.29-.703L13.323 12 3.609 2.186A.97.97 0 013.32 1.483c0 .261.109.523.29.703z" />
                <path d="M14.4 12.8L16.85 10.4l-2.45-2.4L5.2 1.6c-.356-.383-.948-.383-1.304 0l10.503 11.2z" />
                <path d="M16.85 10.4L14.4 12.8 13.6 13.6 3.918 24c.356.382.948.382 1.304 0L16.85 10.4z" />
                <path d="M14.4 12.8l-9.2 9.6c-.33.351-.768.552-1.228.6h.142c.442 0 .872-.184 1.182-.516l9.2-9.6-.096-.084z" />
              </svg>
              <div>
                <div className="text-xs">GET IT ON</div>
                <div className="text-xl font-semibold">Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Schema.org structured data for SEO */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Kavosh AI',
            operatingSystem: 'iOS, ANDROID',
            applicationCategory: 'UtilitiesApplication',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock'
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '1042',
              bestRating: '5',
              worstRating: '1'
            },
            downloadUrl: 'https://kavoshai.com/download'
          })
        }}
      />
    </Layout>
  );
} 