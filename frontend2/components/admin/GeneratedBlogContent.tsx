"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Edit3, ExternalLink, Copy, CheckCircle2 } from "lucide-react";
import { AIBlogGeneration } from "../../types/admin";

interface GeneratedBlogContentProps {
  generation: AIBlogGeneration;
  requestId: number;
}

export default function GeneratedBlogContent({ generation, requestId }: GeneratedBlogContentProps) {
  const [copied, setCopied] = useState<string | null>(null);
  
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    });
  };
  
  return (
    <div className="bg-card border border-green-200 rounded-lg overflow-hidden">
      <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center">
        <Check className="h-5 w-5 text-green-600 mr-2" />
        <h3 className="font-medium text-green-800">Generated Blog Content</h3>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Title</h4>
              <button 
                onClick={() => copyToClipboard(generation.title, 'title')}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
              >
                {copied === 'title' ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="p-3 bg-white border border-border rounded-md">
              {generation.title}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Excerpt</h4>
              <button 
                onClick={() => copyToClipboard(generation.excerpt, 'excerpt')}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
              >
                {copied === 'excerpt' ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="p-3 bg-white border border-border rounded-md">
              {generation.excerpt}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">SEO Information</h4>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-3 text-xs">
                <span className="text-muted-foreground">Meta Title:</span>
                <div className="col-span-2">{generation.meta_title || generation.title}</div>
              </div>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-muted-foreground">Meta Description:</span>
                <div className="col-span-2">{generation.meta_description || generation.excerpt.substring(0, 155)}</div>
              </div>
              <div className="grid grid-cols-3 text-xs">
                <span className="text-muted-foreground">Focus Keywords:</span>
                <div className="col-span-2">{generation.focus_keywords || "None specified"}</div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Suggested Categories & Tags</h4>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Categories:</span>
                <div className="flex flex-wrap gap-1">
                  {generation.suggested_categories && generation.suggested_categories.length > 0 ? (
                    generation.suggested_categories.map((category) => (
                      <span key={category.id} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {category.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground italic">None suggested</span>
                  )}
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Tags:</span>
                <div className="flex flex-wrap gap-1">
                  {generation.suggested_tags && generation.suggested_tags.length > 0 ? (
                    generation.suggested_tags.map((tag) => (
                      <span key={tag.id} className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs">
                        {tag.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground italic">None suggested</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Content Preview</h4>
            <button 
              onClick={() => copyToClipboard(generation.content, 'content')}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
            >
              {copied === 'content' ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </>
              )}
            </button>
          </div>
          <div 
            className="p-4 bg-white border border-border rounded-md max-h-96 overflow-y-auto prose prose-sm prose-headings:mt-4 prose-headings:mb-2"
            dangerouslySetInnerHTML={{ __html: generation.content }}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Link
            href={`/admin/ai-blog/${requestId}/view`}
            className="py-2 px-4 border border-green-200 bg-green-50 text-green-700 rounded-md text-sm font-medium hover:bg-green-100 transition-colors flex items-center justify-center"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Full Post
          </Link>
          
          <Link
            href={`/admin/ai-blog/${requestId}/edit`}
            className="py-2 px-4 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
          >
            <Edit3 className="mr-2 h-4 w-4" />
            Edit & Publish
          </Link>
        </div>
      </div>
    </div>
  );
} 