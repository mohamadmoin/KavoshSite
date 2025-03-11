import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Layout from '../../components/Layout';
import BlogPostContent from '../../components/BlogPostContent';
import { getBlogPostBySlug, getRecentPosts } from '../../services/api';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
}

// Generate metadata for the page
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = params;
  
  try {
    // Fetch the blog post
    const post = await getBlogPostBySlug(slug);
    
    return {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      openGraph: {
        title: post.meta_title || post.title,
        description: post.meta_description || post.excerpt,
        url: `https://kavoshai.com/blog/${post.slug}`,
        type: 'article',
        publishedTime: post.published_at,
        authors: [`https://kavoshai.com/author/${post.author.username}`],
        images: [
          {
            url: post.featured_image,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        tags: post.tags.map(tag => tag.name),
      },
      ...(post.canonical_url && { 
        alternates: {
          canonical: post.canonical_url
        }
      })
    };
  } catch (error) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  
  try {
    // Fetch the blog post and recent posts
    const post = await getBlogPostBySlug(slug);
    const recentPosts = await getRecentPosts();
    
    // Filter out the current post from recent posts
    const filteredRecentPosts = recentPosts.filter(recentPost => recentPost.id !== post.id);
    
    return (
      <Layout>
        <div className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <BlogPostContent post={post} recentPosts={filteredRecentPosts} />
          </div>
        </div>

        {/* Schema.org structured data for SEO */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              image: post.featured_image,
              datePublished: post.published_at,
              dateModified: post.updated_at,
              author: {
                '@type': 'Person',
                name: post.author.username,
                url: `https://kavoshai.com/author/${post.author.username}`
              },
              publisher: {
                '@type': 'Organization',
                name: 'Kavosh AI',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://kavoshai.com/images/logo.svg'
                }
              },
              description: post.excerpt,
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `https://kavoshai.com/blog/${post.slug}`
              },
              keywords: post.tags.map((tag: any) => tag.name).join(', ')
            })
          }}
        />
      </Layout>
    );
  } catch (error) {
    notFound();
  }
} 