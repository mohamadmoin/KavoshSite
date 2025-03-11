'use client';

import React, { useState } from 'react';
import Layout from '../components/Layout';
import BlogList from '../components/BlogList';
import { getBlogPosts } from '../services/api';
import Link from 'next/link';

export default function BlogPage() {
  // State for newsletter form
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');

  // Handle newsletter subscription
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    setSubscribeError('');
    
    try {
      // In a real app, you would send this data to your backend
      // await fetch('/api/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscribeSuccess(true);
      setEmail('');
    } catch (error) {
      setSubscribeError('There was an error subscribing. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  // Fetch blog posts with better error handling
  const [postsResponse, setPostsResponse] = useState<any>({ count: 0, next: null, previous: null, results: [] });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch posts on component mount
  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getBlogPosts();
        setPostsResponse(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);
  
  return (
    <Layout>
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Kavosh AI Blog</h1>
            <p className="text-xl text-gray-600">
              Insights, tips, and updates about AI automation and productivity
            </p>
          </div>
          
          {/* Featured Categories */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/category/productivity"
                className="px-6 py-3 bg-blue-100 text-blue-700 rounded-full font-medium hover:bg-blue-200 transition-colors"
              >
                Productivity
              </Link>
              <Link 
                href="/category/ai-tech"
                className="px-6 py-3 bg-blue-100 text-blue-700 rounded-full font-medium hover:bg-blue-200 transition-colors"
              >
                AI Technology
              </Link>
              <Link 
                href="/category/case-studies"
                className="px-6 py-3 bg-blue-100 text-blue-700 rounded-full font-medium hover:bg-blue-200 transition-colors"
              >
                Case Studies
              </Link>
              <Link 
                href="/category/app-updates"
                className="px-6 py-3 bg-blue-100 text-blue-700 rounded-full font-medium hover:bg-blue-200 transition-colors"
              >
                App Updates
              </Link>
            </div>
          </div>
          
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading posts...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-4xl mx-auto">
              <p className="font-bold">Error loading blog posts:</p>
              <p>{error}</p>
              <p className="mt-2 text-sm">
                Please make sure the backend API is running at http://127.0.0.1:8000
              </p>
            </div>
          )}
          
          {/* Blog Posts */}
          {!isLoading && postsResponse.results.length > 0 ? (
            <>
              <BlogList posts={postsResponse.results} />
              
              {/* Pagination */}
              {(postsResponse.next || postsResponse.previous) && (
                <div className="flex justify-center items-center mt-12 space-x-4">
                  <button 
                    className={`px-4 py-2 rounded border ${!postsResponse.previous ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-blue-500 text-blue-500 hover:bg-blue-50'}`}
                    disabled={!postsResponse.previous}
                  >
                    Previous
                  </button>
                  <button 
                    className={`px-4 py-2 rounded border ${!postsResponse.next ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-blue-500 text-blue-500 hover:bg-blue-50'}`}
                    disabled={!postsResponse.next}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : !isLoading && !error ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8 max-w-xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">No Posts Found</h2>
                <p className="text-gray-600 mb-6">
                  We're currently working on creating amazing content for you. Please check back soon!
                </p>
                <Link 
                  href="/"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          ) : null}
          
          {/* Newsletter Signup */}
          <div className="mt-20 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
              <p className="text-blue-100">
                Get the latest articles, updates, and tips delivered straight to your inbox.
              </p>
            </div>
            
            {subscribeSuccess ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-lg mx-auto text-center">
                <svg className="w-12 h-12 text-green-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="text-xl font-bold mb-2">Thank You for Subscribing!</h3>
                <p className="text-blue-100">
                  You've been added to our newsletter. Look out for exciting updates in your inbox!
                </p>
              </div>
            ) : (
              <form className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto" onSubmit={handleSubscribe}>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className={`bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors whitespace-nowrap ${isSubscribing ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
            
            {subscribeError && (
              <div className="mt-4 bg-red-500/20 text-white px-4 py-3 rounded max-w-lg mx-auto">
                <p>{subscribeError}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schema.org structured data for SEO */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Kavosh AI Blog',
            description: 'Insights, tips, and updates about AI automation and productivity',
            url: 'https://kavoshai.com/blog',
            publisher: {
              '@type': 'Organization',
              name: 'Kavosh AI',
              logo: {
                '@type': 'ImageObject',
                url: 'https://kavoshai.com/images/logo.svg'
              }
            },
            blogPost: postsResponse.results.map((post: any) => ({
              '@type': 'BlogPosting',
              headline: post.title,
              datePublished: post.published_at,
              author: {
                '@type': 'Person',
                name: post.author.username
              },
              image: post.featured_image,
              url: `https://kavoshai.com/blog/${post.slug}`
            }))
          })
        }}
      />
    </Layout>
  );
} 