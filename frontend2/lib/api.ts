import { Author, BlogPost, BlogPostDetail, Category, Tag } from '../types/blog';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  console.log(`API Response: ${response.url} - Status: ${response.status}`);
  
  if (!response.ok) {
    console.error(`API error: ${response.status} - ${response.statusText}`);
    throw new Error(`API error: ${response.status}`);
  }
  
  const data = await response.json() as T;
  console.log('API Response Data:', data);
  return data;
}

// Get paginated blog posts
export async function getBlogPosts(page = 1, size = 10): Promise<{ data: BlogPost[], total: number, totalPages: number }> {
  try {
    console.log(`Attempting to fetch blog posts from: ${API_URL}/posts/?page=${page}&page_size=${size}`);
    
    const response = await fetch(`${API_URL}/posts/?page=${page}&page_size=${size}`, {
      cache: 'no-store',
      next: { revalidate: 0 }, // Force revalidation
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    const result = await handleResponse<{ results: BlogPost[], count: number }>(response);
    return {
      data: result.results,
      total: result.count,
      totalPages: Math.ceil(result.count / size)
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    // Fallback data - will be removed once backend integration is complete
    const fallbackData = getFallbackPosts();
    return {
      data: fallbackData,
      total: fallbackData.length,
      totalPages: 1
    };
  }
}

// Get a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  try {
    console.log(`Attempting to fetch blog post with slug ${slug} from: ${API_URL}/posts/${slug}/`);
    
    const response = await fetch(`${API_URL}/posts/${slug}/`, {
      cache: 'no-store',
      next: { revalidate: 0 }, // Force revalidation
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return await handleResponse<BlogPostDetail>(response);
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    // Fallback to static data for demo purposes - will be removed once backend integration is complete
    const fallbackPost = getFallbackPostBySlug(slug);
    return fallbackPost;
  }
}

// Get featured blog posts
export async function getFeaturedPosts(): Promise<BlogPost[]> {
  try {
    console.log(`Attempting to fetch featured posts from: ${API_URL}/posts/featured/`);
    
    const response = await fetch(`${API_URL}/posts/featured/`, {
      cache: 'no-store',
      next: { revalidate: 0 }, // Force revalidation
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return await handleResponse<BlogPost[]>(response);
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    // Fallback for demo/development
    return getFallbackPosts().filter(post => post.is_featured);
  }
}

// Get recent blog posts
export async function getRecentPosts(): Promise<BlogPost[]> {
  try {
    console.log(`Attempting to fetch recent posts from: ${API_URL}/posts/recent/`);
    
    const response = await fetch(`${API_URL}/posts/recent/`, {
      cache: 'no-store',
      next: { revalidate: 0 }, // Force revalidation
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return await handleResponse<BlogPost[]>(response);
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    // Fallback for demo/development
    return getFallbackPosts().slice(0, 5);
  }
}

// Get posts by category
export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  try {
    console.log(`Attempting to fetch posts for category ${categorySlug} from: ${API_URL}/categories/${categorySlug}/posts/`);
    
    const response = await fetch(`${API_URL}/categories/${categorySlug}/posts/`, {
      cache: 'no-store',
      next: { revalidate: 0 }, // Force revalidation
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return await handleResponse<BlogPost[]>(response);
  } catch (error) {
    console.error(`Error fetching posts for category ${categorySlug}:`, error);
    // Fallback for demo/development
    return [];
  }
}

// Get posts by tag
export async function getPostsByTag(tagSlug: string): Promise<BlogPost[]> {
  try {
    console.log(`Attempting to fetch posts for tag ${tagSlug} from: ${API_URL}/tags/${tagSlug}/posts/`);
    
    const response = await fetch(`${API_URL}/tags/${tagSlug}/posts/`, {
      cache: 'no-store',
      next: { revalidate: 0 }, // Force revalidation
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return await handleResponse<BlogPost[]>(response);
  } catch (error) {
    console.error(`Error fetching posts for tag ${tagSlug}:`, error);
    // Fallback for demo/development
    return [];
  }
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  try {
    console.log(`Attempting to fetch categories from: ${API_URL}/categories/`);
    
    const response = await fetch(`${API_URL}/categories/`, {
      cache: 'no-store',
      next: { revalidate: 0 }, // Force revalidation
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return await handleResponse<Category[]>(response);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Get all tags
export async function getTags(): Promise<Tag[]> {
  try {
    console.log(`Attempting to fetch tags from: ${API_URL}/tags/`);
    
    const response = await fetch(`${API_URL}/tags/`, {
      cache: 'no-store',
      next: { revalidate: 0 }, // Force revalidation
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return await handleResponse<Tag[]>(response);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

// Temporary fallback data (will be removed once backend integration is complete)
function getFallbackPosts(): BlogPost[] {
  // Create some minimal placeholder data
  return [
    {
      id: 1,
      title: "Sample Blog Post",
      slug: "sample-blog-post",
      author: {
        id: 1,
        username: "admin",
        first_name: "Admin",
        last_name: "User"
      },
      excerpt: "This is a sample blog post that appears when the backend connection fails.",
      featured_image: null,
      published_at: new Date().toISOString(),
      status: "published",
      categories: [{ id: 1, name: "Sample", slug: "sample", description: "Sample category" }],
      tags: [{ id: 1, name: "Sample", slug: "sample" }],
      is_featured: false,
      meta_title: "Sample Blog Post",
      meta_description: "This is a sample blog post"
    }
  ];
}

function getFallbackPostBySlug(slug: string): BlogPostDetail | null {
  const post = getFallbackPosts().find(p => p.slug === slug);
  if (!post) return null;
  
  return {
    ...post,
    content: "<p>This is a sample blog post content that appears when the backend connection fails.</p>",
    content_format: "html",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    canonical_url: "",
    focus_keywords: "sample, blog",
    internal_links_count: 0,
    external_links_count: 0
  };
} 