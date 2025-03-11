import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from './components/Layout';
import BlogList from './components/BlogList';
import { getFeaturedPosts, getRecentPosts } from './services/api';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kavosh AI - Innovative Task Automation App',
  description: 'Kavosh AI is an innovative Flutter app using artificial intelligence to automate your daily tasks, boost productivity, and simplify your workflow.',
  openGraph: {
    title: 'Kavosh AI - Innovative Task Automation App',
    description: 'Kavosh AI is an innovative Flutter app using artificial intelligence to automate your daily tasks, boost productivity, and simplify your workflow.',
    url: 'https://kavoshai.com',
    siteName: 'Kavosh AI',
    images: [
      {
        url: 'https://kavoshai.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kavosh AI App Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default async function Home() {
  // Fetch featured and recent posts with better error handling
  let featuredPosts = [];
  let recentPosts = [];
  let error = null;
  
  try {
    console.log('Attempting to fetch featured and recent posts...');
    
    // Use Promise.allSettled to fetch both in parallel and handle errors individually
    const [featuredResult, recentResult] = await Promise.allSettled([
      getFeaturedPosts(),
      getRecentPosts()
    ]);
    
    if (featuredResult.status === 'fulfilled') {
      featuredPosts = featuredResult.value;
      console.log(`Successfully fetched ${featuredPosts.length} featured posts`);
    } else {
      console.error('Error fetching featured posts:', featuredResult.reason);
    }
    
    if (recentResult.status === 'fulfilled') {
      recentPosts = recentResult.value;
      console.log(`Successfully fetched ${recentPosts.length} recent posts`);
    } else {
      console.error('Error fetching recent posts:', recentResult.reason);
    }
    
    // If both failed, set an error message
    if (featuredResult.status === 'rejected' && recentResult.status === 'rejected') {
      error = 'Failed to connect to the API. Please make sure the backend is running.';
    }
  } catch (err) {
    console.error('Error in home page data fetching:', err);
    error = err instanceof Error ? err.message : 'Unknown error';
  }

  return (
    <Layout>
      <div className="py-8">
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Welcome to Kavosh Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the latest insights, tutorials, and news on our blog.
            </p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-bold">Error loading content:</p>
              <p>{error}</p>
              <p className="mt-2 text-sm">
                Please make sure the backend API is running at http://127.0.0.1:8000
              </p>
            </div>
          )}
          
          {featuredPosts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Featured Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPosts.map(post => (
                  <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {post.featured_image && (
                      <div className="relative h-48 w-full">
                        <Image 
                          src={post.featured_image} 
                          alt={post.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">
                        <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-gray-700 mb-3">{post.excerpt}</p>
                      <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800 font-medium">
                        Read more →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {recentPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
              <BlogList posts={recentPosts} />
              <div className="text-center mt-8">
                <Link 
                  href="/blog" 
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
                >
                  View All Posts
                </Link>
              </div>
            </div>
          )}
          
          {featuredPosts.length === 0 && recentPosts.length === 0 && !error && (
            <div className="text-center py-10">
              <p className="text-gray-500">No posts found. Please check the API connection.</p>
              <p className="text-sm text-gray-400 mt-2">API URL: {process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}</p>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
