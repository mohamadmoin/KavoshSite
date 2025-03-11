'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '../utils/dateUtils';

interface BlogPostContentProps {
  post: any;
  recentPosts: any[];
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ post, recentPosts }) => {
  // Format the date
  const formattedDate = formatDate(post.published_at);
  
  // State for newsletter form
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');

  // Handle newsletter subscription
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setSubscribeError('Please enter your email address');
      return;
    }
    
    try {
      setIsSubscribing(true);
      setSubscribeError('');
      
      // Call your API to subscribe the user
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }
      
      setSubscribeSuccess(true);
      setEmail('');
    } catch (error) {
      setSubscribeError('Failed to subscribe. Please try again later.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Post header */}
      <header className="mb-12">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories.map((category: any) => (
            <Link 
              key={category.id} 
              href={`/category/${category.slug}`}
              className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
        
        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{post.title}</h1>
        
        {/* Author and Date */}
        <div className="flex items-center mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3 overflow-hidden">
              <span className="text-xl font-bold">{post.author.username.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="font-medium">
                {post.author.first_name && post.author.last_name 
                  ? `${post.author.first_name} ${post.author.last_name}` 
                  : post.author.username}
              </p>
              <p className="text-gray-500 text-sm">{formattedDate}</p>
            </div>
          </div>
        </div>
        
        {/* Featured image */}
        {post.featured_image && (
          <div className="relative aspect-video w-full mb-8 overflow-hidden rounded-xl">
            <Image 
              src={post.featured_image} 
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
              className="rounded-xl"
            />
          </div>
        )}
      </header>
      
      {/* Post content */}
      <div className="prose prose-lg max-w-none mb-12">
        {post.content_format === 'html' && (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        )}
        {post.content_format === 'markdown' && (
          <div className="markdown-content">
            {/* You would need to add a markdown renderer here */}
            {/* For example: <ReactMarkdown>{post.content}</ReactMarkdown> */}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        )}
        {post.content_format === 'rich_text' && (
          <div className="rich-text-content">
            {/* You would need to add a rich text renderer here */}
            {/* This is a placeholder that falls back to HTML rendering */}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        )}
      </div>

      {/* SEO Stats for admins - you might want to hide this for regular users */}
      {post.internal_links_count !== undefined && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg text-sm">
          <h3 className="font-medium mb-2">SEO Information</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-gray-600">Internal Links:</span> {post.internal_links_count}
            </div>
            <div>
              <span className="text-gray-600">External Links:</span> {post.external_links_count}
            </div>
            {post.focus_keywords && (
              <div className="col-span-2">
                <span className="text-gray-600">Focus Keywords:</span> {post.focus_keywords}
              </div>
            )}
            {post.canonical_url && (
              <div className="col-span-2">
                <span className="text-gray-600">Canonical URL:</span> 
                <a href={post.canonical_url} className="text-blue-600 ml-1" target="_blank" rel="noopener noreferrer">
                  {post.canonical_url}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: any) => (
              <Link 
                key={tag.id} 
                href={`/tag/${tag.slug}`}
                className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Social sharing */}
      <div className="border-t border-b border-gray-200 py-6 my-12">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Share this article:</h3>
          <div className="flex space-x-4">
            <a 
              href={`https://twitter.com/intent/tweet?url=https://kavoshai.com/blog/${post.slug}&text=${encodeURIComponent(post.title)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=https://kavoshai.com/blog/${post.slug}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href={`https://www.linkedin.com/shareArticle?mini=true&url=https://kavoshai.com/blog/${post.slug}&title=${encodeURIComponent(post.title)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      {/* Related posts */}
      {recentPosts.length > 0 && (
        <section className="my-16">
          <h2 className="text-2xl font-bold mb-8">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentPosts.slice(0, 3).map((recentPost: any) => (
              <div key={recentPost.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
                {recentPost.featured_image && (
                  <div className="relative h-48 w-full">
                    <Image 
                      src={recentPost.featured_image} 
                      alt={recentPost.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {recentPost.categories.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {recentPost.categories[0].name}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">
                    <Link href={`/blog/${recentPost.slug}`} className="text-gray-900 hover:text-blue-600">
                      {recentPost.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {new Date(recentPost.published_at).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 line-clamp-2 mb-4">{recentPost.excerpt}</p>
                  <Link href={`/blog/${recentPost.slug}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
                    Read article
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Newsletter Signup */}
      <div className="bg-blue-50 rounded-2xl p-8 my-16">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Subscribe to our newsletter</h3>
          <p className="text-gray-600 mb-6">Get the latest articles, resources and updates right in your inbox.</p>
          
          {subscribeSuccess ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded max-w-lg mx-auto">
              <p>Thank you for subscribing!</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}
          
          {subscribeError && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-lg mx-auto">
              <p>{subscribeError}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogPostContent; 