"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  PlusCircle, Search, Loader2, Clock, AlertCircle, 
  RefreshCw, PenSquare, Grid3X3, FileText 
} from "lucide-react";
import { getAIBlogRequests, getAIBlogBatchRequests } from "../../../lib/admin-api";

interface BlogRequest {
  id: number;
  topic: string;
  status: string;
  created_at: string;
  [key: string]: any;
}

export default function AIBlogDashboardPage() {
  const [blogRequests, setBlogRequests] = useState<BlogRequest[]>([]);
  const [batchRequests, setBatchRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch individual requests
        const blogData = await getAIBlogRequests();
        setBlogRequests(blogData.results || []);
        
        // Fetch batch requests
        const batchData = await getAIBlogBatchRequests();
        setBatchRequests(batchData.results || []);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load blog requests. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtered requests based on search term
  const filteredBlogRequests = blogRequests.filter(
    (request) => 
      request.topic.toLowerCase().includes(searchTerm.toLowerCase()) && 
      // Filter out child requests that belong to a batch (to avoid duplication)
      !request.parent_batch
  );

  const filteredBatchRequests = batchRequests.filter(
    (request) => 
      request.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
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

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Blog Generator</h1>
          <p className="text-muted-foreground">
            Create AI-powered blog posts in minutes
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/admin/ai-blog/batch/new"
            className="inline-flex items-center px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            <Grid3X3 className="h-5 w-5 mr-2" />
            New Blog Series
          </Link>
          <Link
            href="/admin/ai-blog/new"
            className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            New Blog Post
          </Link>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search blog requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-600 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Batch requests section */}
      {!loading && filteredBatchRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Grid3X3 className="h-5 w-5 mr-2" />
            Blog Series
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {filteredBatchRequests.map((request) => (
              <Link
                key={request.id}
                href={`/admin/ai-blog/batch/${request.id}`}
                className="bg-card rounded-lg border border-border p-4 hover:border-primary/50 hover:shadow-sm transition-all flex flex-col"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{request.topic}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{request.description}</p>
                <div className="mt-auto flex justify-between items-center text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {formatDate(request.created_at)}
                  </span>
                  <span className="flex items-center">
                    <FileText className="h-3.5 w-3.5 mr-1" />
                    {request.child_requests_count} Posts
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Individual blog requests section */}
      {!loading && filteredBlogRequests.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <PenSquare className="h-5 w-5 mr-2" />
            Individual Blog Posts
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogRequests.map((request) => (
              <Link
                key={request.id}
                href={`/admin/ai-blog/${request.id}`}
                className="bg-card rounded-lg border border-border p-4 hover:border-primary/50 hover:shadow-sm transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium line-clamp-1">{request.topic}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {formatDate(request.created_at)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredBlogRequests.length === 0 && filteredBatchRequests.length === 0 && (
        <div className="bg-muted rounded-lg py-12 px-4 text-center">
          <div className="mx-auto max-w-md">
            <h3 className="text-lg font-medium mb-2">No blog requests found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm
                ? "No blog requests match your search. Try a different term."
                : "Get started by creating your first AI-generated blog post."}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/admin/ai-blog/batch/new"
                className="inline-flex items-center px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                <Grid3X3 className="h-5 w-5 mr-2" />
                New Blog Series
              </Link>
              <Link
                href="/admin/ai-blog/new"
                className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                New Blog Post
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 