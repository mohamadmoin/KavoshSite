import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import Layout from '../components/Layout';

export const metadata: Metadata = {
  title: 'About Kavosh AI | Our Story and Mission',
  description: 'Learn about Kavosh AI, our mission to revolutionize task automation, and the team behind our innovative Flutter app powered by artificial intelligence.',
  openGraph: {
    title: 'About Kavosh AI | Our Story and Mission',
    description: 'Learn about Kavosh AI, our mission to revolutionize task automation, and the team behind our innovative Flutter app powered by artificial intelligence.',
    url: 'https://kavoshai.com/about',
    images: [
      {
        url: 'https://kavoshai.com/images/about-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Kavosh AI Team',
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Kavosh AI</h1>
            <p className="text-xl text-gray-600">
              We're on a mission to revolutionize task automation and empower people to do more 
              with less effort through innovative AI technology.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <Image 
                  src="/images/about-story.jpg" 
                  alt="Kavosh AI Origin Story" 
                  width={600} 
                  height={400}
                  className="w-full"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Kavosh AI began with a simple observation: people spend too much time on repetitive tasks 
                that could be automated. Our founder, an AI researcher with a background in mobile development, 
                set out to create a solution that would leverage the power of artificial intelligence to simplify daily workflows.
              </p>
              <p className="text-gray-700 mb-4">
                Founded in 2023, our team quickly grew to include experts in machine learning, UX design, 
                and mobile development. Together, we've built an application that learns from users' behaviors 
                and automates their routine tasks with remarkable accuracy.
              </p>
              <p className="text-gray-700">
                Today, Kavosh AI is used by thousands of people around the world who have discovered 
                the freedom that comes with intelligent automation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Mission & Values</h2>
            <p className="text-xl text-gray-600">
              At Kavosh AI, we're guided by a set of core principles that drive everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Value 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="bg-blue-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">User Privacy First</h3>
              <p className="text-gray-600">
                We believe that AI can be powerful without compromising privacy. Your data remains on your device 
                unless you explicitly choose to share it. We don't sell your information or use it for advertising.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="bg-blue-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Innovation Through Empathy</h3>
              <p className="text-gray-600">
                We build technology that understands and adapts to human needs, not the other way around. 
                Our innovations are guided by deep empathy for our users and their challenges.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="bg-blue-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Accessibility for All</h3>
              <p className="text-gray-600">
                We're committed to making AI technology accessible to everyone, regardless of technical expertise. 
                Our app is designed to be intuitive and inclusive for users of all backgrounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Team</h2>
            <p className="text-xl text-gray-600">
              Meet the passionate minds behind Kavosh AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md text-center">
              <div className="relative h-60 w-full">
                <Image 
                  src="/images/team-1.jpg" 
                  alt="Dr. Amir Kavosh" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-1">Dr. Amir Kavosh</h3>
                <p className="text-blue-600 mb-3">Founder & CEO</p>
                <p className="text-gray-600 text-sm">
                  AI researcher with a Ph.D. in Machine Learning and a vision to make AI accessible to everyone.
                </p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md text-center">
              <div className="relative h-60 w-full">
                <Image 
                  src="/images/team-2.jpg" 
                  alt="Leila Ahmadi" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-1">Leila Ahmadi</h3>
                <p className="text-blue-600 mb-3">CTO</p>
                <p className="text-gray-600 text-sm">
                  Flutter expert with over 10 years of experience in mobile development across multiple platforms.
                </p>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md text-center">
              <div className="relative h-60 w-full">
                <Image 
                  src="/images/team-3.jpg" 
                  alt="Mohammad Rezaei" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-1">Mohammad Rezaei</h3>
                <p className="text-blue-600 mb-3">Lead AI Engineer</p>
                <p className="text-gray-600 text-sm">
                  Specializes in natural language processing and creating adaptive learning algorithms.
                </p>
              </div>
            </div>

            {/* Team Member 4 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md text-center">
              <div className="relative h-60 w-full">
                <Image 
                  src="/images/team-4.jpg" 
                  alt="Sara Tehrani" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-1">Sara Tehrani</h3>
                <p className="text-blue-600 mb-3">UX Director</p>
                <p className="text-gray-600 text-sm">
                  Award-winning designer focused on creating intuitive and accessible user experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schema.org structured data for SEO */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Kavosh AI',
            url: 'https://kavoshai.com',
            logo: 'https://kavoshai.com/images/logo.svg',
            foundingDate: '2023',
            founders: [
              {
                '@type': 'Person',
                name: 'Dr. Amir Kavosh'
              }
            ],
            description: 'Kavosh AI is an innovative Flutter app using artificial intelligence to automate daily tasks, boost productivity, and simplify workflow.',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Tehran',
              addressCountry: 'Iran'
            }
          })
        }}
      />
    </Layout>
  );
} 