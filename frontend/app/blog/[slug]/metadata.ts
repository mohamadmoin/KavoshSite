import { Metadata } from 'next';
import { getBlogPostBySlug } from '../../services/api';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

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
      // Add canonical URL if it exists
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