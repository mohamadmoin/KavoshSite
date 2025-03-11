"use client";

import React from 'react';
import { BlogPost } from '../types/blog';
import BlogCard from './BlogCard';

interface BlogListProps {
  posts: BlogPost[];
  title?: string;
}

const BlogList: React.FC<BlogListProps> = ({ posts, title }) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">{title || 'Blog Posts'}</h2>
        <p className="text-gray-500">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default BlogList; 