"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { AlertCircle, Loader2 } from "lucide-react";
import { loginAdmin, isAuthenticated } from "../../../lib/admin-api";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin/dashboard";
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showManualTokenInput, setShowManualTokenInput] = useState(false);
  const [manualToken, setManualToken] = useState("");

  // Check if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    console.log('Current auth state:', { 
      isAuthenticated: isAuthenticated(),
      hasToken: !!token,
      tokenFirstChars: token ? token.substring(0, 5) + '...' : 'none'
    });
    
    if (isAuthenticated()) {
      console.log('Already authenticated, redirecting to:', redirectPath);
      router.push(redirectPath);
    }
  }, [redirectPath, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Attempting login with username:', formData.username);
      
      // Login with token-based authentication
      const response = await loginAdmin(formData.username, formData.password);
      console.log('Login successful, received token:', response.token ? 'yes' : 'no');
      
      // Double check token was stored
      const storedToken = localStorage.getItem('auth_token');
      console.log('Token stored in localStorage:', storedToken ? 'yes' : 'no');
      
      if (!storedToken) {
        throw new Error('Token was not properly stored after login');
      }
      
      // Small delay to ensure token is stored before redirect
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('Redirecting to:', redirectPath);
      router.push(redirectPath);
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Invalid username or password. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  const handleManualTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) {
      setError("Please enter a token");
      return;
    }

    // Store the token in localStorage
    try {
      const cleanToken = manualToken.trim();
      localStorage.setItem('auth_token', cleanToken);
      console.log('Manual token stored:', cleanToken.substring(0, 5) + '...');
      
      // Verify token was stored
      const storedToken = localStorage.getItem('auth_token');
      if (!storedToken) {
        throw new Error('Token was not properly stored');
      }
      
      // Display success message temporarily
      setError(null);
      setIsSubmitting(true);
      
      // Add small delay before redirect to show success state
      setTimeout(() => {
        console.log('Redirecting to:', redirectPath);
        router.push(redirectPath);
      }, 1000);
    } catch (error) {
      console.error('Error storing token:', error);
      setError('Failed to store authentication token. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Image
                    src="/favicon.ico"
                    width={32}
                    height={32}
                    alt="Logo"
                  />
                </div>
              </div>
              <h1 className="text-2xl font-bold">Admin Login</h1>
              <p className="text-muted-foreground mt-1">
                Sign in to access the admin dashboard
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-600 flex items-start mb-6">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {showManualTokenInput ? (
              <form onSubmit={handleManualTokenSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="token"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    Authentication Token
                  </label>
                  <input
                    type="text"
                    id="token"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    placeholder="Paste your auth token here"
                    className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enter the token you generated using <code>drf_create_token</code>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  Use Token
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowManualTokenInput(false)}
                    className="text-sm text-primary hover:underline"
                  >
                    Go back to regular login
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>

                <div className="text-center text-sm text-muted-foreground mt-4">
                  <p>
                    Use your Django admin credentials to sign in.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowManualTokenInput(true)}
                    className="mt-2 text-primary hover:underline"
                  >
                    Or use a token directly
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 