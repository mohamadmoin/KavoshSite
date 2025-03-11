"use client";

import { useState } from "react";
import Link from "next/link";
import { AIBlogRequestListItem } from "../../types/admin";
import { Calendar, Check, Clock, Edit3, ExternalLink, Eye, XCircle } from "lucide-react";

interface AIBlogRequestListProps {
  requests: AIBlogRequestListItem[];
}

export default function AdminAIBlogRequestList({ requests }: AIBlogRequestListProps) {
  const sortedRequests = [...requests].sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </span>
        );
      case "processing":
        return (
          <span className="flex items-center px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 animate-pulse">
            <Clock className="mr-1 h-3 w-3" />
            Processing
          </span>
        );
      case "completed":
        return (
          <span className="flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            <Check className="mr-1 h-3 w-3" />
            Completed
          </span>
        );
      case "failed":
        return (
          <span className="flex items-center px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" />
            Failed
          </span>
        );
      default:
        return (
          <span className="flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (sortedRequests.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No AI blog requests found.
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {sortedRequests.map((request) => (
        <div
          key={request.id}
          className="p-4 hover:bg-muted/30 transition-colors"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center mb-1">
                <h3 className="font-medium mr-3">{request.topic}</h3>
                {getStatusBadge(request.status)}
              </div>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                {request.prompt}
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                {formatDate(request.created_at)}
                {request.keywords && (
                  <span className="ml-3 bg-muted px-2 py-0.5 rounded-full">
                    {request.keywords.split(",").length} keywords
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 self-end md:self-auto">
              {request.status === "completed" && request.has_generation && (
                <Link
                  href={`/admin/ai-blog/${request.id}/view`}
                  className="inline-flex items-center justify-center h-9 rounded-md px-3 text-sm border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <Eye className="mr-1 h-4 w-4" />
                  View
                </Link>
              )}
              {request.status === "completed" && request.has_generation && (
                <Link
                  href={`/admin/ai-blog/${request.id}/edit`}
                  className="inline-flex items-center justify-center h-9 rounded-md px-3 text-sm bg-primary text-white hover:bg-primary/90"
                >
                  <Edit3 className="mr-1 h-4 w-4" />
                  Edit & Publish
                </Link>
              )}
              {request.status === "failed" && (
                <Link
                  href={`/admin/ai-blog/${request.id}`}
                  className="inline-flex items-center justify-center h-9 rounded-md px-3 text-sm border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <ExternalLink className="mr-1 h-4 w-4" />
                  Details
                </Link>
              )}
              {["pending", "processing"].includes(request.status) && (
                <Link
                  href={`/admin/ai-blog/${request.id}`}
                  className="inline-flex items-center justify-center h-9 rounded-md px-3 text-sm border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <ExternalLink className="mr-1 h-4 w-4" />
                  Details
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 