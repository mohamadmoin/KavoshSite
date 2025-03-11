"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { createAIBlogBatchRequest } from "../../lib/admin-api";

interface AIBlogBatchRequestForm {
  topic: string;
  description: string;
  prompt: string;
  keywords: string;
  num_posts: number;
  allow_web_search: boolean;
}

export default function NewAIBlogBatchRequestForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AIBlogBatchRequestForm>({
    topic: "",
    description: "",
    prompt: "",
    keywords: "",
    num_posts: 5,
    allow_web_search: true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 10) {
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    }
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
      const response = await createAIBlogBatchRequest({
        topic: formData.topic,
        description: formData.description,
        prompt: formData.prompt,
        keywords: formData.keywords,
        num_posts: formData.num_posts,
        allow_web_search: formData.allow_web_search,
      });

      // Redirect to the batch request detail page
      router.push(`/admin/ai-blog/batch/${response.id}`);
    } catch (err) {
      console.error("Error creating AI blog batch request:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create AI blog batch request. Please try again."
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
            Main Topic <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleInputChange}
            placeholder="e.g., 'Digital Marketing Strategies'"
            required
            className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            The overarching topic for this series of blog posts
          </p>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Series Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            placeholder="Describe what this series of blog posts should cover, the target audience, and goals."
            required
            className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            A brief description of what this series should cover
          </p>
        </div>

        <div>
          <label
            htmlFor="prompt"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Common Instructions <span className="text-red-500">*</span>
          </label>
          <textarea
            id="prompt"
            name="prompt"
            value={formData.prompt}
            onChange={handleInputChange}
            rows={4}
            placeholder="Instructions that will apply to all generated posts, like tone, style, depth, format preferences, etc."
            required
            className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Instructions that will apply to all generated blog posts
          </p>
        </div>

        <div>
          <label
            htmlFor="keywords"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Common Keywords
          </label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            value={formData.keywords}
            onChange={handleInputChange}
            placeholder="e.g., marketing, strategy, digital, business"
            className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Comma-separated keywords that should appear across all posts (for SEO)
          </p>
        </div>

        <div>
          <label
            htmlFor="num_posts"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Number of Posts to Generate <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="num_posts"
            name="num_posts"
            value={formData.num_posts}
            onChange={handleNumberChange}
            min={1}
            max={10}
            required
            className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            How many related blog posts to generate (maximum 10)
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
            "Generate Blog Series"
          )}
        </button>
      </div>
    </form>
  );
} 