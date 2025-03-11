"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { createAIBlogRequest } from "../../lib/admin-api";
import { AIBlogRequestForm } from "../../types/admin";

export default function NewAIBlogRequestForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AIBlogRequestForm>({
    topic: "",
    prompt: "",
    keywords: "",
    allow_web_search: true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await createAIBlogRequest({
        topic: formData.topic,
        prompt: formData.prompt,
        keywords: formData.keywords,
        allow_web_search: formData.allow_web_search,
      });

      // Redirect to the request detail page
      router.push(`/admin/ai-blog/${response.id}`);
    } catch (err) {
      console.error("Error creating AI blog request:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create AI blog request. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-600 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="topic"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Blog Topic <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleInputChange}
            placeholder="e.g., '10 Ways AI Can Boost Your Business Productivity'"
            required
            className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            A clear, concise title or subject for your blog post
          </p>
        </div>

        <div>
          <label
            htmlFor="prompt"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Generation Prompt <span className="text-red-500">*</span>
          </label>
          <textarea
            id="prompt"
            name="prompt"
            value={formData.prompt}
            onChange={handleInputChange}
            rows={5}
            placeholder="Write a detailed blog post about AI productivity tools for small businesses. Target audience is business owners who are not tech-savvy. Include practical examples and implementation steps."
            required
            className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Detailed instructions for the AI. Include target audience, tone,
            style, and specific sections or points to cover.
          </p>
        </div>

        <div>
          <label
            htmlFor="keywords"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Keywords
          </label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            value={formData.keywords}
            onChange={handleInputChange}
            placeholder="e.g., AI tools, productivity, automation, small business, efficiency"
            className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Comma-separated keywords to include in the blog post (for SEO)
          </p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="allow_web_search"
            name="allow_web_search"
            checked={formData.allow_web_search}
            onChange={handleCheckboxChange}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/50"
          />
          <label
            htmlFor="allow_web_search"
            className="ml-2 block text-sm text-foreground"
          >
            Allow web search for more accurate and up-to-date information
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors inline-flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Generating...
            </>
          ) : (
            "Generate Blog Post"
          )}
        </button>
      </div>
    </form>
  );
} 