import React from 'react';
import { notFound } from 'next/navigation';
import Layout from '../../components/Layout';
import BlogList from '../../components/BlogList';
import { getPostsByTag } from '../../services/api';

interface TagPageProps {
  params: {
    slug: string;
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = params;
  
  // Fetch posts by tag
  const posts = await getPostsByTag(slug).catch(() => null);
  
  // If tag not found, return 404
  if (!posts) {
    notFound();
  }
  
  // Get tag name from the first post (if available)
  const tagName = posts.length > 0 
    ? posts[0].tags.find(tag => tag.slug === slug)?.name 
    : slug;
  
  return (
    <Layout>
      <div className="py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Tag: {tagName}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse all posts with this tag
          </p>
        </div>
        
        <BlogList posts={posts} />
      </div>
    </Layout>
  );
} 