import React from 'react';
import { notFound } from 'next/navigation';
import Layout from '../../components/Layout';
import BlogList from '../../components/BlogList';
import { getPostsByCategory } from '../../services/api';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  
  // Fetch posts by category
  const posts = await getPostsByCategory(slug).catch(() => null);
  
  // If category not found, return 404
  if (!posts) {
    notFound();
  }
  
  // Get category name from the first post (if available)
  const categoryName = posts.length > 0 
    ? posts[0].categories.find(cat => cat.slug === slug)?.name 
    : slug;
  
  return (
    <Layout>
      <div className="py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Category: {categoryName}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse all posts in this category
          </p>
        </div>
        
        <BlogList posts={posts} />
      </div>
    </Layout>
  );
} 