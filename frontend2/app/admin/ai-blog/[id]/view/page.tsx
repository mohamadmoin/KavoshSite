"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Edit3, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { getAIBlogRequest, getAIBlogGeneration } from "../../../../../lib/admin-api";
import { AIBlogRequest, AIBlogGeneration } from "../../../../../types/admin";

export default function ViewAIBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const [request, setRequest] = useState<AIBlogRequest | null>(null);
  const [generation, setGeneration] = useState<AIBlogGeneration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          } catch (genError) {
            console.error(`Error fetching generation for request ${id}:`, genError);
            setError("Failed to load the generated blog post. Please try again later.");
          }
        } else {
          setError(`Cannot view the blog post because the generation is not complete. Current status: ${requestData.status}`);
        }
      } catch (err) {
        console.error(`Error fetching AI blog request ${id}:`, err);
        // Check if it's an authentication error and provide more helpful message
        if (err instanceof Error && err.message.includes('Authentication required')) {
          setError("Authentication required. Please log in to view this content.");
          router.push('/admin/login?redirect=' + encodeURIComponent(window.location.pathname));
        } else {
          setError("Failed to load AI blog request. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [params.id, router]);
  
  if (loading) {
    return (
      <div className="py-8 px-4 max-w-4xl mx-auto">
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">Loading blog post data...</p>
        </div>
      </div>
    );
  }
  
  if (error || !generation) {
    return (
      <div className="py-8 px-4 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Link
              href={`/admin/ai-blog/${params.id}`}
              className="mr-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">
              View Generated Blog Post
            </h1>
          </div>
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error || "The generated blog post content is not available."}
          <Link href={`/admin/ai-blog/${params.id}`} className="block mt-4 text-primary font-medium">
            Back to Request Details
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center mb-2">
            <Link
              href={`/admin/ai-blog/${params.id}`}
              className="mr-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">
              View Generated Blog Post
            </h1>
          </div>
          <p className="text-muted-foreground">
            Review the AI-generated blog post content before publishing.
          </p>
        </div>
        <Link
          href={`/admin/ai-blog/${params.id}/edit`}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Edit3 className="mr-2 h-4 w-4" />
          Edit & Publish
        </Link>
      </div>

      <div className="space-y-6">
        {/* Blog Post Preview */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/50">
            <h2 className="font-medium">Blog Post Preview</h2>
          </div>
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">{generation.title}</h1>
            
            <div className="mb-6 bg-muted/30 p-4 rounded-md border border-border">
              <h3 className="text-sm font-medium mb-2">Excerpt:</h3>
              <p className="text-muted-foreground">{generation.excerpt}</p>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <div dangerouslySetInnerHTML={{ __html: generation.content }} />
            </div>
          </div>
        </div>
        
        {/* SEO Information */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/50">
            <h2 className="font-medium">SEO Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Meta Title:</h3>
              <p className="bg-muted p-3 rounded-md text-sm">
                {generation.meta_title || generation.title}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Meta Description:</h3>
              <p className="bg-muted p-3 rounded-md text-sm">
                {generation.meta_description || generation.excerpt}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Focus Keywords:</h3>
              <div className="flex flex-wrap gap-1">
                {generation.focus_keywords.split(",").map((keyword, i) => (
                  <span
                    key={i}
                    className="inline-block px-2 py-1 text-xs bg-muted rounded-full"
                  >
                    {keyword.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Suggested Categories and Tags */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/50">
            <h2 className="font-medium">Suggested Categories and Tags</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Categories:</h3>
              {generation.suggested_categories.length > 0 ? (
                <div className="space-y-2">
                  {generation.suggested_categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center p-2 bg-muted/30 rounded-md"
                    >
                      <span className="text-sm">{category.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No categories suggested.</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Tags:</h3>
              {generation.suggested_tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {generation.suggested_tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-block px-3 py-1 text-sm bg-muted rounded-full"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No tags suggested.</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Link
            href={`/admin/ai-blog/${params.id}/edit`}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Edit3 className="mr-2 h-4 w-4" />
            Edit & Publish
          </Link>
        </div>
      </div>
    </div>
  );
} 