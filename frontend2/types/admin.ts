import { BlogPost, Category, Tag } from './blog';

// AI Blog Request Types
export type AIBlogRequestStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface AIBlogRequest {
  id: number;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  prompt: string;
  topic: string;
  keywords: string;
  allow_web_search: boolean;
  status: AIBlogRequestStatus;
  created_at: string;
  updated_at: string;
  error_message?: string;
}

export interface AIBlogRequestListItem extends AIBlogRequest {
  has_generation: boolean;
}

export interface AIBlogGeneration {
  id: number;
  request: number;
  blog_post?: number;
  title: string;
  content: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  focus_keywords: string;
  created_at: string;
  suggested_categories: Category[];
  suggested_tags: Tag[];
}

// Admin Blog Management Types
export interface BlogPostDraft extends Omit<BlogPost, 'id'> {
  id?: number;
}

// Form Types
export interface AIBlogRequestForm {
  topic: string;
  prompt: string;
  keywords: string;
  allow_web_search: boolean;
}

export interface PublishBlogForm {
  title: string;
  content: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  focus_keywords: string;
  categories: number[];
  tags: number[];
  status: 'draft' | 'published';
} 