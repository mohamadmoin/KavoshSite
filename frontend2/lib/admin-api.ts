import { Category, Tag } from '@/types/blog';
import { AIBlogRequest, AIBlogGeneration } from '../types/admin';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  console.log(`Admin API Response: ${response.url} - Status: ${response.status}`);
  
  if (!response.ok) {
    console.error(`Admin API error: ${response.status} - ${response.statusText}`);
    
    if (response.status === 403 || response.status === 401) {
      // Handle authentication errors
      const token = getAuthToken();
      console.log(`Auth error with token present: ${!!token}`);
      
      if (typeof window !== 'undefined') {
        // Only redirect if in browser context and not already on login page
        if (!window.location.pathname.includes('/admin/login')) {
          console.log('Redirecting to login page due to auth error');
          window.location.href = '/admin/login?redirect=' + encodeURIComponent(window.location.pathname);
        }
      }
      throw new Error('Authentication required. Please log in.');
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API error: ${response.status}`);
  }
  
  const data = await response.json() as T;
  return data;
}

// Authentication functions
export async function loginAdmin(username: string, password: string): Promise<{ token: string }> {
  try {
    console.log(`Attempting to login with username: ${username} to endpoint: ${API_URL}/auth-token/`);
    
    // Clear any existing token before attempting login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    
    // This assumes you have a token-based auth endpoint
    const response = await fetch(`${API_URL}/auth-token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    // Log the response status
    console.log(`Login response status: ${response.status}`);
    
    // Get the response body regardless of success/failure for debugging
    const responseData = await response.json();
    console.log('Login response data:', responseData);
    
    if (!response.ok) {
      // Handle specific error messages from the backend
      if (responseData.non_field_errors) {
        throw new Error(responseData.non_field_errors[0]);
      } else if (responseData.detail) {
        throw new Error(responseData.detail);
      } else {
        throw new Error('Login failed. Please check your credentials and try again.');
      }
    }
    
    // Store the token in localStorage
    if (typeof window !== 'undefined' && responseData.token) {
      localStorage.setItem('auth_token', responseData.token);
      console.log('Token stored successfully');
      
      // Also store the timestamp when the token was received
      localStorage.setItem('auth_token_timestamp', Date.now().toString());
    } else {
      console.warn('No token received in the response');
    }
    
    return responseData;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export function logoutAdmin() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_token_timestamp');
  }
}

// Get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    console.log('Retrieved token:', token ? '(token exists)' : 'none'); // Don't log the full token for security
    return token;
  }
  return null;
}

// Get authenticated request headers
function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    // Make sure we're using the exact format Django expects for token auth
    headers['Authorization'] = `Token ${token}`;
    console.log('Added Authorization header for request'); // Log that we added the auth header
  } else {
    console.warn('No auth token available for request');
  }
  
  return headers;
}

// Create a fetch wrapper that handles authentication
async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  // Add auth headers if not already present
  if (!options.headers || !('Authorization' in options.headers)) {
    options.headers = {
      ...options.headers,
      ...getAuthHeaders(),
    };
  }
  
  // Set cache: 'no-store' for all requests to prevent caching
  options.cache = 'no-store';
  
  const response = await fetch(url, options);
  
  // If response is 401 or 403 and we're not already on the login page, redirect
  if ((response.status === 401 || response.status === 403) && 
      typeof window !== 'undefined' && 
      !window.location.pathname.includes('/admin/login')) {
    console.log('Auth error, redirecting to login');
    window.location.href = '/admin/login?redirect=' + encodeURIComponent(window.location.pathname);
  }
  
  return response;
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

// For debugging - check authentication status
export function getAuthStatus(): { authenticated: boolean, token: string | null } {
  const token = getAuthToken();
  return {
    authenticated: !!token,
    token: token ? token.substring(0, 5) + '...' : null // Only show first few chars for security
  };
}

// AI Blog Generation API

// Get all AI blog requests
export async function getAIBlogRequests(): Promise<{ results: AIBlogRequest[] }> {
  try {
    console.log('Fetching AI blog requests with auth headers:', getAuthStatus());
    
    const response = await authenticatedFetch(`${API_URL}/ai-blog/requests/`);
    return handleResponse<{ results: AIBlogRequest[] }>(response);
  } catch (error) {
    console.error('Error fetching AI blog requests:', error);
    throw error;
  }
}

// Get a single AI blog request
export async function getAIBlogRequest(id: number): Promise<AIBlogRequest> {
  try {
    console.log(`Fetching AI blog request ${id} with auth:`, getAuthStatus());
    
    const response = await authenticatedFetch(`${API_URL}/ai-blog/requests/${id}/`);
    return handleResponse<AIBlogRequest>(response);
  } catch (error) {
    console.error(`Error fetching AI blog request ${id}:`, error);
    throw error;
  }
}

// Create a new AI blog request
export async function createAIBlogRequest(data: {
  prompt: string;
  topic: string;
  keywords?: string;
  allow_web_search?: boolean;
}): Promise<AIBlogRequest> {
  try {
    console.log('Creating AI blog request with auth:', getAuthStatus());
    
    const response = await authenticatedFetch(`${API_URL}/ai-blog/requests/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return handleResponse<AIBlogRequest>(response);
  } catch (error) {
    console.error('Error creating AI blog request:', error);
    throw error;
  }
}

// Get the generation for a specific request
export async function getAIBlogGeneration(requestId: number): Promise<AIBlogGeneration> {
  try {
    console.log(`Fetching AI blog generation for request ${requestId} with auth:`, getAuthStatus());
    
    const response = await authenticatedFetch(`${API_URL}/ai-blog/requests/${requestId}/generation/`);
    return handleResponse<AIBlogGeneration>(response);
  } catch (error) {
    console.error(`Error fetching AI blog generation for request ${requestId}:`, error);
    throw error;
  }
}

// Regenerate a blog post
export async function regenerateAIBlogPost(requestId: number): Promise<{ detail: string }> {
  try {
    console.log(`Regenerating AI blog post for request ${requestId} with auth:`, getAuthStatus());
    
    const response = await authenticatedFetch(`${API_URL}/ai-blog/requests/${requestId}/regenerate/`, {
      method: 'POST',
    });
    return handleResponse<{ detail: string }>(response);
  } catch (error) {
    console.error(`Error regenerating AI blog post for request ${requestId}:`, error);
    throw error;
  }
}

// Publish a generated blog post
export async function publishAIBlogPost(generationId: number): Promise<{ detail: string }> {
  try {
    console.log(`Publishing AI blog post for generation ${generationId} with auth:`, getAuthStatus());
    
    const response = await authenticatedFetch(`${API_URL}/ai-blog/generations/${generationId}/publish/`, {
      method: 'POST',
    });
    return handleResponse<{ detail: string }>(response);
  } catch (error) {
    console.error(`Error publishing AI blog post for generation ${generationId}:`, error);
    throw error;
  }
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/api/admin/categories`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return response.json();
}

export async function getTags(): Promise<Tag[]> {
  const response = await fetch(`${API_URL}/api/admin/tags`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tags');
  }

  return response.json();
}

// Batch AI Blog Generation API

// Create a new batch AI blog request
export async function createAIBlogBatchRequest(data: {
  topic: string;
  description: string;
  prompt: string;
  keywords?: string;
  num_posts?: number;
  allow_web_search?: boolean;
}): Promise<any> {
  try {
    console.log('Creating AI blog batch request with auth:', getAuthStatus());
    
    const response = await authenticatedFetch(`${API_URL}/ai-blog/batch-requests/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return handleResponse<any>(response);
  } catch (error) {
    console.error('Error creating AI blog batch request:', error);
    throw error;
  }
}

// Get all AI blog batch requests
export async function getAIBlogBatchRequests(): Promise<{ results: any[] }> {
  try {
    console.log('Fetching AI blog batch requests with auth headers:', getAuthStatus());
    
    const response = await authenticatedFetch(`${API_URL}/ai-blog/batch-requests/`);
    return handleResponse<{ results: any[] }>(response);
  } catch (error) {
    console.error('Error fetching AI blog batch requests:', error);
    throw error;
  }
}

// Get a single AI blog batch request
export async function getAIBlogBatchRequest(id: number): Promise<any> {
  try {
    console.log(`Fetching AI blog batch request ${id} with auth:`, getAuthStatus());
    
    const response = await authenticatedFetch(`${API_URL}/ai-blog/batch-requests/${id}/`);
    return handleResponse<any>(response);
  } catch (error) {
    console.error(`Error fetching AI blog batch request ${id}:`, error);
    throw error;
  }
}

// Regenerate a batch of blog posts
export async function regenerateAIBlogBatchPosts(batchId: number): Promise<{ detail: string }> {
  try {
    console.log(`Regenerating AI blog batch for request ${batchId} with auth:`, getAuthStatus());
    
    const response = await authenticatedFetch(`${API_URL}/ai-blog/batch-requests/${batchId}/regenerate/`, {
      method: 'POST',
    });
    return handleResponse<{ detail: string }>(response);
  } catch (error) {
    console.error(`Error regenerating AI blog batch for request ${batchId}:`, error);
    throw error;
  }
} 