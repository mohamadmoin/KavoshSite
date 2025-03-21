import { backendFetch } from './api-utils';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  token: string;
}

// Regular user registration
export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await backendFetch('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  const errorData = await response.json();
  
  if (!response.ok) {
    // Handle Django REST Framework validation errors
    if (errorData.password) {
      throw new Error(Array.isArray(errorData.password) ? errorData.password[0] : errorData.password);
    }
    if (errorData.username) {
      throw new Error(Array.isArray(errorData.username) ? errorData.username[0] : errorData.username);
    }
    if (errorData.email) {
      throw new Error(Array.isArray(errorData.email) ? errorData.email[0] : errorData.email);
    }
    throw new Error(errorData.detail || 'Registration failed');
  }

  // Store the token
  if (typeof window !== 'undefined' && errorData.token) {
    localStorage.setItem('auth_token', errorData.token);
    localStorage.setItem('auth_token_timestamp', Date.now().toString());
  }

  return errorData;
}

// Regular user login
export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await backendFetch('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Login failed');
  }

  const responseData = await response.json();
  
  // Store the token
  if (typeof window !== 'undefined' && responseData.token) {
    localStorage.setItem('auth_token', responseData.token);
    localStorage.setItem('auth_token_timestamp', Date.now().toString());
  }

  return responseData;
}

// CMS Admin login - uses different endpoint
export async function loginAdmin(data: LoginData): Promise<{ token: string }> {
  const response = await backendFetch('/auth-token/', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Admin login failed');
  }

  const responseData = await response.json();
  
  // Store the token
  if (typeof window !== 'undefined' && responseData.token) {
    localStorage.setItem('auth_token', responseData.token);
    localStorage.setItem('auth_token_timestamp', Date.now().toString());
  }

  return responseData;
}

// Regenerate token for CMS Admin
export async function regenerateAdminToken(): Promise<{ token: string }> {
  const response = await backendFetch('/auth/token/regenerate/', {
    method: 'POST',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Token regeneration failed');
  }

  const responseData = await response.json();
  
  // Store the new token
  if (typeof window !== 'undefined' && responseData.token) {
    localStorage.setItem('auth_token', responseData.token);
    localStorage.setItem('auth_token_timestamp', Date.now().toString());
  }

  return responseData;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_token_timestamp');
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('auth_token');
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
} 