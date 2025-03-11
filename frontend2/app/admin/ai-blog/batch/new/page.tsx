import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewAIBlogBatchRequestForm from "../../../../../components/admin/NewAIBlogBatchRequestForm";

export const metadata = {
  title: "New AI Blog Series - Admin Dashboard",
  description: "Create a series of related AI-generated blog posts",
};

export default function NewAIBlogBatchRequestPage() {
  return (
    <div className="py-8 px-4 max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Link
            href="/admin/ai-blog"
            className="mr-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">New AI Blog Series</h1>
        </div>
        <p className="text-muted-foreground">
          Generate multiple related blog posts with a single request. This will create a cohesive
          series of articles around a central topic.
        </p>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/50">
          <h2 className="font-medium">Series Details</h2>
        </div>
        <div className="p-6">
          <NewAIBlogBatchRequestForm />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Tips for better results:</h3>
          <ul className="text-sm text-blue-700 space-y-1 pl-5 list-disc">
            <li>Define a clear, specific main topic for your blog series</li>
            <li>Provide a detailed description of what the series should cover</li>
            <li>Include common instructions that should apply to all posts</li>
            <li>Specify target audience, tone, and stylistic preferences</li>
            <li>Consider limiting to 3-5 posts for your first series</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Important note:</h3>
          <p className="text-sm text-yellow-700">
            Generation typically takes 5-10 minutes for a series of posts, depending on the 
            number of posts and complexity of the topic. You'll be able to review and edit each 
            post before publishing.
          </p>
        </div>
      </div>
    </div>
  );
} 