"use client";

import { useState, useEffect } from 'react';
import { getAuthStatus, logoutAdmin } from '../../lib/admin-api';
import { AlertCircle, Check, AlertTriangle, LogOut, RefreshCw } from 'lucide-react';

interface AuthStatus {
  authenticated: boolean;
  token: string | null;
}

interface AuthTestResult {
  success: boolean;
  message: string;
}

interface AuthDetails {
  is_authenticated: boolean;
  username: string;
  [key: string]: any;
}

export default function AuthDebugger() {
  const [status, setStatus] = useState<AuthStatus>({ authenticated: false, token: null });
  const [testApiCall, setTestApiCall] = useState<AuthTestResult | null>(null);
  const [authDetails, setAuthDetails] = useState<AuthDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Update status every second to show current state
    const interval = setInterval(() => {
      setStatus(getAuthStatus());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const testAuth = async () => {
    setLoading(true);
    setTestApiCall(null);
    setAuthDetails(null);
    
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setTestApiCall({
          success: false,
          message: 'No token found in localStorage',
        });
        setLoading(false);
        return;
      }
      
      // Test auth by making a call to our debug endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai-blog/requests/auth_test/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAuthDetails(data); // Store the detailed auth info
        
        setTestApiCall({
          success: data.is_authenticated,
          message: data.is_authenticated 
            ? `Authentication successful. User: ${data.username}`
            : `Authentication failed. Token may be invalid.`,
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setTestApiCall({
          success: false,
          message: `API call failed with status ${response.status}: ${JSON.stringify(errorData)}`,
        });
      }
    } catch (error) {
      setTestApiCall({
        success: false,
        message: `Error making test API call: ${error instanceof Error ? error.message : String(error)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    window.location.href = '/admin/login';
  };

  const updateToken = () => {
    const newToken = prompt('Enter your authentication token:');
    if (newToken && newToken.trim()) {
      localStorage.setItem('auth_token', newToken.trim());
      setStatus(getAuthStatus());
      // Clear previous test results when token is updated
      setTestApiCall(null);
      setAuthDetails(null);
    }
  };

  const regenerateToken = async () => {
    if (!confirm('This will invalidate your current token and create a new one. Continue?')) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token/regenerate/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
          setStatus(getAuthStatus());
          alert(`New token generated successfully: ${data.token.substring(0, 10)}...`);
        } else {
          alert('No token received in response');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to regenerate token: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      alert(`Error regenerating token: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h3 className="font-medium text-yellow-800 flex items-center mb-2">
        <AlertTriangle className="h-4 w-4 mr-2" />
        Authentication Debugger
      </h3>
      
      <div className="text-sm text-yellow-700 space-y-2">
        <div className="flex items-center">
          <span className="font-medium mr-2">Status:</span>
          {status.authenticated ? (
            <span className="flex items-center text-green-600">
              <Check className="h-4 w-4 mr-1" /> Authenticated
            </span>
          ) : (
            <span className="flex items-center text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" /> Not authenticated
            </span>
          )}
        </div>
        
        {status.token && (
          <div>
            <span className="font-medium mr-2">Token (first chars):</span>
            {status.token}
          </div>
        )}
        
        <div className="pt-2 flex flex-wrap gap-2">
          <button
            onClick={testAuth}
            disabled={loading}
            className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-md hover:bg-blue-200 transition-colors flex items-center"
          >
            {loading ? 'Testing...' : (
              <>
                <RefreshCw className="h-3 w-3 mr-1" /> Test Auth
              </>
            )}
          </button>
          
          <button
            onClick={updateToken}
            className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-md hover:bg-green-200 transition-colors"
          >
            Update Token
          </button>
          
          <button
            onClick={regenerateToken}
            disabled={loading || !status.authenticated}
            className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-md hover:bg-purple-200 transition-colors disabled:opacity-50"
          >
            Regenerate Token
          </button>
          
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-md hover:bg-red-200 transition-colors flex items-center"
          >
            <LogOut className="h-3 w-3 mr-1" /> Logout
          </button>
        </div>
        
        {testApiCall && (
          <div className={`mt-2 p-2 rounded ${testApiCall.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {testApiCall.message}
          </div>
        )}
        
        {authDetails && (
          <div className="mt-4 border-t border-yellow-200 pt-2">
            <h4 className="font-medium mb-1">Authentication Details:</h4>
            <pre className="bg-white/50 p-2 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(authDetails, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 