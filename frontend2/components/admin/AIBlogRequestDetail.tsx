"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Check,
  Clock,
  Edit3,
  ExternalLink,
  RefreshCw,
  XCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { AIBlogRequest, AIBlogGeneration } from "../../types/admin";
import { regenerateAIBlogPost, getAIBlogRequest, getAIBlogGeneration } from "../../lib/admin-api";
import GeneratedBlogContent from "./GeneratedBlogContent";

interface AIBlogRequestDetailProps {
  request: AIBlogRequest;
  generation: AIBlogGeneration | null;
}

export default function AIBlogRequestDetail({
  request: initialRequest,
  generation: initialGeneration,
}: AIBlogRequestDetailProps) {
  const router = useRouter();
  const [request, setRequest] = useState<AIBlogRequest>(initialRequest);
  const [generation, setGeneration] = useState<AIBlogGeneration | null>(initialGeneration);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update local state when props change
  useEffect(() => {
    setRequest(initialRequest);
    setGeneration(initialGeneration);
  }, [initialRequest, initialGeneration]);

  // Set up polling for pending or processing requests
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout | null = null;
    
    const pollForUpdates = async () => {
      if (request.status !== 'pending' && request.status !== 'processing') {
        return;
      }
      
      setIsPolling(true);
      
      try {
        // Fetch the latest request status
        const updatedRequest = await getAIBlogRequest(request.id);
        setRequest(updatedRequest);
        
        // If completed, fetch the generation
        if (updatedRequest.status === 'completed') {
          try {
            const newGeneration = await getAIBlogGeneration(request.id);
            setGeneration(newGeneration);
          } catch (genError) {
            console.error('Error fetching generation:', genError);
          }
          
          // Stop polling if completed or failed
          if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
          }
        } else if (updatedRequest.status === 'failed') {
          // Stop polling on failure
          if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
          }
        }
      } catch (err) {
        console.error('Error polling for updates:', err);
      } finally {
        setIsPolling(false);
      }
    };
    
    // Start polling if request is pending or processing
    if (request.status === 'pending' || request.status === 'processing') {
      // Poll immediately first
      pollForUpdates();
      
      // Then set up interval
      pollingInterval = setInterval(pollForUpdates, 5000); // Poll every 5 seconds
    }
    
    // Clean up
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [request.id, request.status]);
  
  const createdAt = new Date(request.created_at);
  const updatedAt = new Date(request.updated_at);
  
  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setError(null);
    
    try {
      await regenerateAIBlogPost(request.id);
      
      // Update the request to show it's pending again
      const updatedRequest = await getAIBlogRequest(request.id);
      setRequest(updatedRequest);
      setGeneration(null);
    } catch (err) {
      console.error('Error regenerating blog post:', err);
      setError(err instanceof Error ? err.message : 'Failed to regenerate blog post');
    } finally {
      setIsRegenerating(false);
    }
  };
  
  const handleManualRefresh = async () => {
    setIsPolling(true);
    setError(null);
    
    try {
      const updatedRequest = await getAIBlogRequest(request.id);
      setRequest(updatedRequest);
      
      if (updatedRequest.status === 'completed') {
        try {
          const newGeneration = await getAIBlogGeneration(request.id);
          setGeneration(newGeneration);
        } catch (genError) {
          console.error('Error fetching generation:', genError);
        }
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setIsPolling(false);
    }
  };
  
  // Determine status indicator
  const getStatusIndicator = () => {
    switch (request.status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Pending
        </span>;
      case 'processing':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Processing
        </span>;
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Completed</span>;
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Failed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Unknown</span>;
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}
      
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 className="text-xl font-bold">{request.topic}</h2>
          <div className="flex items-center gap-2">
            {getStatusIndicator()}
            
            <button
              onClick={handleManualRefresh}
              disabled={isPolling || isRegenerating}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium transition-colors inline-flex items-center"
            >
              {isPolling ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3 mr-1" /> Refresh
                </>
              )}
            </button>
            
            {(request.status === 'completed' || request.status === 'failed') && (
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-md text-sm font-medium transition-colors inline-flex items-center"
              >
                {isRegenerating ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1" /> Regenerate
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium mb-2">Request Details</h3>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Created {formatDistanceToNow(createdAt, { addSuffix: true })}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>Updated {formatDistanceToNow(updatedAt, { addSuffix: true })}</span>
              </div>
              
              <div className="mt-4">
                <div className="font-medium text-foreground">Keywords:</div>
                <div className="mt-1">
                  {request.keywords ? (
                    <div className="flex flex-wrap gap-1">
                      {request.keywords.split(',').map((keyword, index) => (
                        <span key={index} className="px-2 py-0.5 bg-muted rounded-full text-xs">
                          {keyword.trim()}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">No keywords specified</span>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="font-medium text-foreground">Web Search:</div>
                <div className="mt-1">
                  {request.allow_web_search ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Generation Prompt</h3>
            <div className="p-3 bg-muted rounded-md whitespace-pre-wrap text-muted-foreground">
              {request.prompt}
            </div>
          </div>
        </div>
        
        {request.status === 'failed' && request.error_message && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-md flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-red-800 mb-1">Generation Failed</div>
              <div className="text-sm text-red-700 whitespace-pre-wrap">{request.error_message}</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Auto-refresh info for pending/processing statuses */}
      {(request.status === 'pending' || request.status === 'processing') && (
        <div className="p-4 border border-blue-200 bg-blue-50 rounded-md text-sm text-blue-700">
          <p className="flex items-center">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generation in progress. This page will automatically update when complete.
          </p>
        </div>
      )}
      
      {request.status === 'completed' && generation && (
        <GeneratedBlogContent generation={generation} requestId={request.id} />
      )}
      
      {request.status === 'completed' && !generation && (
        <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md flex items-start">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-yellow-800">Generated Content Not Found</div>
            <p className="text-sm text-yellow-700 mt-1">
              The generation was marked as completed, but the content couldn't be retrieved.
              Try refreshing the page or regenerating the content.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 