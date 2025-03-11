"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '../types/blog';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
        <h2 className="text-xl font-semibold mb-2">
          <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800">
            {post.title}
          </Link>
        </h2>
        <div className="text-sm text-gray-500 mb-2">
          {new Date(post.published_at).toLocaleDateString()} • By {post.author.username}
        </div>
        <p className="text-gray-700 mb-3">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {post.categories.map(category => (
            <Link 
              key={category.id} 
              href={`/category/${category.slug}`}
              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
            >
              {category.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <Link 
              key={tag.id} 
              href={`/tag/${tag.slug}`}
              className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogCard; 