import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import Layout from '../components/Layout';

export const metadata: Metadata = {
  title: 'Features | Kavosh AI Task Automation App',
  description: 'Explore the powerful features of Kavosh AI: task automation, intelligent learning, data privacy, service integrations, and a beautiful interface.',
  openGraph: {
    title: 'Features | Kavosh AI Task Automation App',
    description: 'Explore the powerful features of Kavosh AI: task automation, intelligent learning, data privacy, service integrations, and a beautiful interface.',
    url: 'https://kavoshai.com/features',
    images: [
      {
        url: 'https://kavoshai.com/images/features-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Kavosh AI Features',
      },
    ],
  },
};

export default function FeaturesPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Powerful AI Features</h1>
            <p className="text-xl text-gray-600">
              Discover how Kavosh AI's powerful features can transform your workflow, boost your productivity, 
              and give you back valuable time.
            </p>
          </div>
        </div>
      </div>

      {/* Feature 1 */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-4">Intelligent Task Automation</h2>
              <p className="text-gray-700 mb-4">
                Let our advanced AI handle your routine tasks. From scheduling meetings to summarizing emails, 
                Kavosh AI can automate a wide range of activities that would otherwise consume your valuable time.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Automated email sorting and response suggestions</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Smart scheduling and calendar management</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Intelligent reminder system based on your habits</span>
                </li>
              </ul>
              <Link href="/download" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Try it Now
              </Link>
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <Image 
                  src="/images/feature-automation.jpg" 
                  alt="Intelligent Task Automation" 
                  width={600} 
                  height={400}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <Image 
                  src="/images/feature-learning.jpg" 
                  alt="Adaptive Learning" 
                  width={600} 
                  height={400}
                  className="w-full"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Adaptive Learning</h2>
              <p className="text-gray-700 mb-4">
                Unlike standard apps that need constant configuration, Kavosh AI learns from your behavior patterns 
                and adapts to your preferences, becoming more effective the more you use it.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Personalized suggestions based on usage patterns</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Continuous improvement through machine learning</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Adapts to changing work patterns and priorities</span>
                </li>
              </ul>
              <Link href="/download" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Experience Adaptive AI
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3 */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-4">Privacy By Design</h2>
              <p className="text-gray-700 mb-4">
                Your data never leaves your device unless you choose to share it. Our on-device AI processing 
                ensures your information stays private while still delivering powerful automation capabilities.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>On-device AI processing</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>End-to-end encryption for any data transfer</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Transparent privacy controls</span>
                </li>
              </ul>
              <Link href="/privacy-policy" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Read Our Privacy Policy
              </Link>
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <Image 
                  src="/images/feature-privacy.jpg" 
                  alt="Privacy By Design" 
                  width={600} 
                  height={400}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Features in Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">More Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kavosh AI comes packed with features designed to make your digital life more efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="bg-blue-100 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Seamless Integrations</h3>
              <p className="text-gray-600">
                Connect with your favorite apps and services. Kavosh AI works with tools like Gmail, 
                Google Calendar, Slack, Trello, and many more.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="bg-blue-100 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Scheduling</h3>
              <p className="text-gray-600">
                Let Kavosh AI handle your calendar. It learns your preferences for meeting times and 
                automatically suggests optimal slots for new appointments.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="bg-blue-100 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Intelligent Suggestions</h3>
              <p className="text-gray-600">
                Get smart recommendations for email responses, task prioritization, and content creation 
                based on your past behavior and preferences.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="bg-blue-100 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Time Tracking & Analysis</h3>
              <p className="text-gray-600">
                See where your time goes with intelligent tracking that categorizes your activities and 
                offers insights to improve productivity.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="bg-blue-100 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Natural Language Processing</h3>
              <p className="text-gray-600">
                Interact with Kavosh AI using natural language. Ask questions, give commands, and receive 
                responses in a conversational format.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="bg-blue-100 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Cross-Platform Support</h3>
              <p className="text-gray-600">
                Use Kavosh AI across all your devices. Your data synchronizes securely so you can switch 
                between phone, tablet, and desktop seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Kavosh AI?</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Join thousands of users who have revolutionized their productivity with Kavosh AI.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/download"
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg inline-block"
            >
              Download Now
            </Link>
            <Link
              href="/blog"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-4 rounded-lg text-lg transition-colors inline-block"
            >
              Read Our Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Schema.org structured data for SEO */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Intelligent Task Automation',
                description: 'Advanced AI that handles routine tasks automatically.'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Adaptive Learning',
                description: 'AI that learns from your behavior patterns and adapts to your preferences.'
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: 'Privacy By Design',
                description: 'On-device AI processing that keeps your data private.'
              },
              {
                '@type': 'ListItem',
                position: 4,
                name: 'Seamless Integrations',
                description: 'Connect with your favorite apps and services.'
              },
              {
                '@type': 'ListItem',
                position: 5,
                name: 'Smart Scheduling',
                description: 'AI-powered calendar management.'
              },
              {
                '@type': 'ListItem',
                position: 6,
                name: 'Cross-Platform Support',
                description: 'Use Kavosh AI across all your devices.'
              }
            ]
          })
        }}
      />
    </Layout>
  );
} 