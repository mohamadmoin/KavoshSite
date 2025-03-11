"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { isAuthenticated } from "../../lib/admin-api";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Skip authentication check for login page
    if (pathname === '/admin/login') {
      setIsLoading(false);
      return;
    }
    
    // Check if authenticated using the token
    if (isAuthenticated()) {
      setIsLoading(false);
    } else {
      // Not authenticated, redirect to login
      router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router]);

  if (isLoading && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 