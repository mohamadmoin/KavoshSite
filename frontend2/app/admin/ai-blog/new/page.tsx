import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewAIBlogRequestForm from "../../../../components/admin/NewAIBlogRequestForm";

export const metadata = {
  title: "New AI Blog Request - Admin Dashboard",
  description: "Create a new AI-generated blog post",
};

export default function NewAIBlogRequestPage() {
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
          <h1 className="text-2xl font-bold tracking-tight">New AI Blog Post</h1>
        </div>
        <p className="text-muted-foreground">
          Enter the details below to generate a new blog post with AI. The more
          specific your topic and prompt, the better the results will be.
        </p>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/50">
          <h2 className="font-medium">Generation Details</h2>
        </div>
        <div className="p-6">
          <NewAIBlogRequestForm />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Tips for better results:</h3>
          <ul className="text-sm text-blue-700 space-y-1 pl-5 list-disc">
            <li>Be specific about the topic and target audience</li>
            <li>Include relevant keywords you want to target</li>
            <li>Mention the tone and style you prefer (formal, conversational, etc.)</li>
            <li>Specify the desired length or depth of the content</li>
            <li>Allow web search for more accurate and up-to-date information</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Important note:</h3>
          <p className="text-sm text-yellow-700">
            Generation typically takes 1-2 minutes depending on the complexity of the
            topic. You'll be able to review and edit the content before publishing.
          </p>
        </div>
      </div>
    </div>
  );
} 