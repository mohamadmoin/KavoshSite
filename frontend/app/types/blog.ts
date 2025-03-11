export interface Author {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  author: Author;
  excerpt: string;
  featured_image: string;
  published_at: string;
  status: string;
  categories: Category[];
  tags: Tag[];
  is_featured: boolean;
  meta_title: string;
  meta_description: string;
}

export interface BlogPostDetail extends BlogPost {
  content: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
} 