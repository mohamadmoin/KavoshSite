"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { getAIBlogRequest, getAIBlogGeneration, getCategories, getTags } from "../../../../../lib/admin-api";
import { AIBlogRequest, AIBlogGeneration } from "../../../../../types/admin";
import { Category, Tag } from "../../../../../types/blog";
import EditAIBlogPostForm from "../../../../../components/admin/EditAIBlogPostForm";

export default function EditAIBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const [request, setRequest] = useState<AIBlogRequest | null>(null);
  const [generation, setGeneration] = useState<AIBlogGeneration | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
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
            // Separate the API calls for easier debugging
            const generationData = await getAIBlogGeneration(id);
            setGeneration(generationData);

            try {
              const categoriesData = await getCategories();
              setCategories(categoriesData);
            } catch (catError) {
              console.error('Error fetching categories:', catError);
              setCategories([]);
            }

            try {
              const tagsData = await getTags();
              setTags(tagsData);
            } catch (tagError) {
              console.error('Error fetching tags:', tagError);
              setTags([]);
            }
          } catch (genError) {
            console.error(`Error fetching data for request ${id}:`, genError);
            setError("Failed to load the generated blog post data. Please try again later.");
          }
        } else {
          setError(`Cannot edit the blog post because the generation is not complete. Current status: ${requestData.status}`);
        }
      } catch (err) {
        console.error(`Error fetching AI blog request ${id}:`, err);
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
          <p className="text-lg">Loading blog data...</p>
        </div>
      </div>
    );
  }
  
  if (error || !generation || !request) {
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
              Edit & Publish Blog Post
            </h1>
          </div>
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error || "Could not load blog post data for editing."}
          <Link href={`/admin/ai-blog/${params.id}`} className="block mt-4 text-primary font-medium">
            Back to Request Details
          </Link>
        </div>
      </div>
    );
  }
  
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
            Edit & Publish Blog Post
          </h1>
        </div>
        <p className="text-muted-foreground">
          Review and edit the AI-generated blog post before publishing it to your website.
        </p>
      </div>

      <EditAIBlogPostForm 
        generation={generation}
        categories={categories}
        tags={tags}
      />
    </div>
  );
} 