/**
 * Utility functions for API communication
 */

/**
 * Performs a fetch request to the backend API with proper authentication
 * @param endpoint - The API endpoint to call
 * @param options - Fetch options including method, body, etc.
 * @returns The API response
 */
export async function backendFetch(endpoint: string, options: RequestInit = {}) {
  // Base API URL with fallback
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  
  // Get auth token from localStorage
  let token;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('auth_token');
  }

  // Default headers with auth token if available
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  // Build the full URL
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  // Perform the fetch with error handling
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle auth errors
    if (response.status === 401) {
      // Clear token and redirect to login if running in browser
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
      throw new Error('Authentication failed');
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
