"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, AlertCircle, Clock, RefreshCw, Loader2, ExternalLink, Check } from "lucide-react";
import { getAIBlogBatchRequest, regenerateAIBlogBatchPosts } from "../../../../../lib/admin-api";

export default function AIBlogBatchRequestDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [batchRequest, setBatchRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  // Fetch the batch request data
  const fetchBatchRequest = async () => {
    try {
      setLoading(true);
      const data = await getAIBlogBatchRequest(parseInt(params.id));
      setBatchRequest(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching batch request:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load batch request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle regeneration
  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      await regenerateAIBlogBatchPosts(parseInt(params.id));
      
      // Refresh the data
      await fetchBatchRequest();
    } catch (err) {
      console.error("Error regenerating batch:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to regenerate batch. Please try again."
      );
    } finally {
      setRegenerating(false);
    }
  };

  // Fetch the batch request on mount and periodically refresh if processing
  useEffect(() => {
    fetchBatchRequest();

    // Set up polling if the batch is processing
    let interval: NodeJS.Timeout;
    if (batchRequest && batchRequest.status === 'processing') {
      interval = setInterval(fetchBatchRequest, 5000); // Poll every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [params.id, batchRequest?.status]);

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="py-8 px-4 max-w-6xl mx-auto flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 px-4 max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 text-red-500 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => router.push('/admin/ai-blog')}
              className="mt-2 text-red-700 underline"
            >
              Return to AI Blog Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!batchRequest) return null;

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto">
      {/* Header section */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Link
            href="/admin/ai-blog"
            className="mr-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{batchRequest.topic}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(batchRequest.status)}`}>
            {batchRequest.status.charAt(0).toUpperCase() + batchRequest.status.slice(1)}
          </span>
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {formatDate(batchRequest.created_at)}
          </span>
          <span>{batchRequest.num_posts} Posts</span>
        </div>
      </div>

      {/* Error message if any */}
      {batchRequest.error_message && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 text-red-500 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-medium">Error Occurred</h3>
              <p className="text-red-700">{batchRequest.error_message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Batch details section */}
      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/50">
            <h2 className="font-medium">Batch Request Details</h2>
          </div>
          <div className="p-4">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                <dd className="mt-1">{batchRequest.description}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Instructions</dt>
                <dd className="mt-1 whitespace-pre-wrap">{batchRequest.prompt}</dd>
              </div>
              {batchRequest.keywords && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Keywords</dt>
                  <dd className="mt-1">
                    {batchRequest.keywords.split(',').map((keyword: string, i: number) => (
                      <span key={i} className="inline-block bg-muted rounded-full px-2 py-1 text-xs mr-2 mb-2">
                        {keyword.trim()}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>
          <div className="px-6 py-4 border-t border-border flex justify-end">
            <button
              onClick={handleRegenerate}
              disabled={regenerating || batchRequest.status === 'processing'}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center"
            >
              {regenerating || batchRequest.status === 'processing' ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  {regenerating ? 'Regenerating...' : 'Processing...'}
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate All
                </>
              )}
            </button>
          </div>
        </div>

        {/* Processing status visualization */}
        {(batchRequest.status === 'processing' || batchRequest.status === 'pending') && (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/50">
              <h2 className="font-medium">Processing Status</h2>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center h-48">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <h3 className="text-lg font-medium">Generating Blog Series</h3>
              <p className="text-muted-foreground max-w-sm mt-2">
                {batchRequest.status === 'processing' 
                  ? "We're currently generating your blog posts. This may take 5-10 minutes depending on the number of posts."
                  : "Your request is queued and will begin processing shortly."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Generated blog post ideas */}
      {batchRequest.generated_ideas && batchRequest.generated_ideas.length > 0 && (
        <div className="mb-6">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/50">
              <h2 className="font-medium">Generated Blog Post Ideas</h2>
            </div>
            <div className="divide-y divide-border">
              {batchRequest.generated_ideas.map((idea: any, index: number) => (
                <div key={index} className="p-4">
                  <h3 className="font-medium">{idea.title}</h3>
                  <p className="text-muted-foreground mt-1">{idea.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generated blog posts list */}
      {batchRequest.child_requests && batchRequest.child_requests.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Generated Blog Posts</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {batchRequest.child_requests.map((request: any) => (
              <div 
                key={request.id} 
                className="bg-card rounded-lg border border-border overflow-hidden shadow-sm"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{request.topic}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  
                  {request.status === 'completed' && (
                    <div className="mt-4 flex justify-end">
                      <Link 
                        href={`/admin/ai-blog/${request.id}`}
                        className="inline-flex items-center px-3 py-1.5 rounded text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                        View Post
                      </Link>
                    </div>
                  )}
                  
                  {request.status === 'processing' && (
                    <div className="mt-4 flex items-center justify-center text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Generating...</span>
                    </div>
                  )}
                  
                  {request.status === 'failed' && request.error_message && (
                    <div className="mt-2 text-sm text-red-600">
                      {request.error_message}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show completion status if all done */}
      {batchRequest.status === 'completed' && (
        <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Check className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
            <div>
              <h3 className="text-green-800 font-medium">Generation Complete</h3>
              <p className="text-green-700">
                All blog posts have been generated successfully. You can view each post individually by clicking the links above.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 