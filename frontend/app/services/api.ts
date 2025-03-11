import { BlogPost, BlogPostDetail, PaginatedResponse } from '../types/blog';

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

// Get all blog posts (paginated)
export async function getBlogPosts(): Promise<PaginatedResponse<BlogPost>> {
  console.log(`Fetching blog posts from: ${API_URL}/posts/`);
  try {
    const response = await fetch(`${API_URL}/posts/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      mode: 'cors',
    });
    return handleResponse<PaginatedResponse<BlogPost>>(response);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

// Get a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetail> {
  const response = await fetch(`${API_URL}/posts/${slug}/`, {
    cache: 'no-store',
    mode: 'cors',
  });
  return handleResponse<BlogPostDetail>(response);
}

// Get featured blog posts
export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const response = await fetch(`${API_URL}/posts/featured/`, {
    cache: 'no-store',
    mode: 'cors',
  });
  return handleResponse<BlogPost[]>(response);
}

// Get recent blog posts
export async function getRecentPosts(): Promise<BlogPost[]> {
  const response = await fetch(`${API_URL}/posts/recent/`, {
    cache: 'no-store',
    mode: 'cors',
  });
  return handleResponse<BlogPost[]>(response);
}

// Get posts by category
export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  const response = await fetch(`${API_URL}/categories/${categorySlug}/posts/`);
  return handleResponse<BlogPost[]>(response);
}

// Get posts by tag
export async function getPostsByTag(tagSlug: string): Promise<BlogPost[]> {
  const response = await fetch(`${API_URL}/tags/${tagSlug}/posts/`);
  return handleResponse<BlogPost[]>(response);
} 