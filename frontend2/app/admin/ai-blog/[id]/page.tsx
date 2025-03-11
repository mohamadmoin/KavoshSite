"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { getAIBlogRequest, getAIBlogGeneration } from "../../../../lib/admin-api";
import AIBlogRequestDetail from "../../../../components/admin/AIBlogRequestDetail";
import { AIBlogRequest, AIBlogGeneration } from "../../../../types/admin";

export default function AIBlogRequestPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [request, setRequest] = useState<AIBlogRequest | null>(null);
  const [generation, setGeneration] = useState<AIBlogGeneration | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const idParam = Array.isArray(params.id) ? params.id[0] : params.id as string;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      router.push("/404");
      return;
    }
    
    const fetchData = async () => {
      try {
        // Fetch the request
        const requestData = await getAIBlogRequest(id);
        setRequest(requestData);
        
        // If the request is completed, try to fetch the generation
        if (requestData.status === 'completed') {
          try {
            const generationData = await getAIBlogGeneration(id);
            setGeneration(generationData);
            // Clear any polling if we successfully fetch generation
            if (pollingInterval) {
              clearInterval(pollingInterval);
              setPollingInterval(null);
            }
          } catch (genError) {
            console.error(`Error fetching generation for request ${id}:`, genError);
            // Don't set error here, we'll just show that generation isn't available
          }
        } else if (requestData.status === 'pending' || requestData.status === 'processing') {
          // If request is still processing, set up polling to check status
          if (!pollingInterval) {
            const interval = setInterval(() => fetchData(), 5000); // Poll every 5 seconds
            setPollingInterval(interval);
          }
        } else if (pollingInterval && (requestData.status === 'failed' || requestData.status === 'completed')) {
          // Clear polling if request is in a final state
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
      } catch (err) {
        console.error(`Error fetching AI blog request ${id}:`, err);
        setError("Failed to load AI blog request. Please try again later.");
        
        // Check if it's an authentication error and provide more helpful message
        if (err instanceof Error && err.message.includes('Authentication required')) {
          setError("Authentication required. Please log in to view this content.");
          router.push('/admin/login?redirect=' + encodeURIComponent(window.location.pathname));
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Cleanup polling interval when component unmounts
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [params.id, router, pollingInterval]);

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Link
            href="/admin/ai-blog"
            className="mr-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            AI Blog Request Details
          </h1>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
          <Link href="/admin/ai-blog" className="block mt-4 text-primary font-medium">
            Back to AI Blog Dashboard
          </Link>
        </div>
      ) : loading ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">Loading request data...</p>
        </div>
      ) : !request ? (
        <div className="text-center py-8">
          <p className="text-lg">Request not found</p>
        </div>
      ) : (
        <AIBlogRequestDetail 
          request={request} 
          generation={generation}
        />
      )}
    </div>
  );
} 