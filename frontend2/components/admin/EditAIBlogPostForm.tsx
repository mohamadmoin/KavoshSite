"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { AIBlogGeneration, PublishBlogForm } from "../../types/admin";
import { Category, Tag } from "../../types/blog";
import { publishAIBlogPost } from "../../lib/admin-api";

interface EditAIBlogPostFormProps {
  generation: AIBlogGeneration;
  categories: Category[];
  tags: Tag[];
}

export default function EditAIBlogPostForm({
  generation,
  categories,
  tags,
}: EditAIBlogPostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<PublishBlogForm>({
    title: generation.title,
    content: generation.content,
    excerpt: generation.excerpt,
    meta_title: generation.meta_title,
    meta_description: generation.meta_description,
    focus_keywords: generation.focus_keywords,
    categories: generation.suggested_categories.map(c => c.id),
    tags: generation.suggested_tags.map(t => t.id),
    status: 'draft',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name } = e.target;
    const values = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData((prev) => ({ ...prev, [name]: values }));
  };

  const handleSubmit = async (e: React.FormEvent, publishStatus: 'draft' | 'published') => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Set the status based on the button clicked
      const dataToSubmit = {
        ...formData,
        status: publishStatus,
      };

      // Call the API to publish the blog post
      await publishAIBlogPost(generation.id);
      
      setSuccess(
        publishStatus === 'published'
          ? "Blog post published successfully!"
          : "Blog post saved as draft successfully!"
      );
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/blog');
      }, 2000);
    } catch (err) {
      console.error("Error publishing blog post:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to publish blog post. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-600 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 text-sm text-green-600 flex items-start">
          <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/50">
          <h2 className="font-medium">Blog Post Content</h2>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Excerpt <span className="text-red-500">*</span>
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              rows={3}
              required
              className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              A short summary of the blog post (used for previews and SEO)
            </p>
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={15}
              required
              className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              HTML content of the blog post
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/50">
          <h2 className="font-medium">Categories & Tags</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="categories"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Categories <span className="text-red-500">*</span>
            </label>
            <select
              id="categories"
              name="categories"
              multiple
              value={formData.categories.map(String)}
              onChange={handleMultiSelectChange}
              className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 h-40"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted-foreground">
              Hold Ctrl/Cmd to select multiple categories
            </p>
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Tags
            </label>
            <select
              id="tags"
              name="tags"
              multiple
              value={formData.tags.map(String)}
              onChange={handleMultiSelectChange}
              className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 h-40"
            >
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted-foreground">
              Hold Ctrl/Cmd to select multiple tags
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/50">
          <h2 className="font-medium">SEO Settings</h2>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label
              htmlFor="meta_title"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Meta Title
            </label>
            <input
              type="text"
              id="meta_title"
              name="meta_title"
              value={formData.meta_title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Leave blank to use the post title
            </p>
          </div>

          <div>
            <label
              htmlFor="meta_description"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Meta Description
            </label>
            <textarea
              id="meta_description"
              name="meta_description"
              value={formData.meta_description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Leave blank to use the post excerpt
            </p>
          </div>

          <div>
            <label
              htmlFor="focus_keywords"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Focus Keywords
            </label>
            <input
              type="text"
              id="focus_keywords"
              name="focus_keywords"
              value={formData.focus_keywords}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Comma-separated keywords for SEO
            </p>
          </div>
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
          type="button"
          onClick={(e) => handleSubmit(e, 'draft')}
          className="px-4 py-2 border border-primary bg-white text-primary rounded-md text-sm font-medium hover:bg-primary/10 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4 inline" />
              Saving...
            </>
          ) : (
            "Save as Draft"
          )}
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, 'published')}
          className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors inline-flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Publishing...
            </>
          ) : (
            "Publish"
          )}
        </button>
      </div>
    </form>
  );
} 