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
  featured_image: string | null;
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
  content_format: string;
  created_at: string;
  updated_at: string;
  canonical_url: string;
  focus_keywords: string;
  internal_links_count: number;
  external_links_count: number;
}

// Helper types for display
export interface FormattedBlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  categorySlug: string;
  date: string;
  author: {
    name: string;
    avatar: string;
    role?: string;
  };
  tags: Array<{
    name: string;
    slug: string;
  }>;
}

export interface FormattedBlogPostDetail extends FormattedBlogPost {
  content: string;
  readTime: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  keywords: string[];
}

// Adapter function to transform API blog post to frontend format
export function adaptBlogPost(post: BlogPost): FormattedBlogPost {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    image: post.featured_image || '/blog/blog-placeholder.jpg',
    category: post.categories.length > 0 ? post.categories[0].name : 'Uncategorized',
    categorySlug: post.categories.length > 0 ? post.categories[0].slug : 'uncategorized',
    date: new Date(post.published_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    author: {
      name: `${post.author.first_name} ${post.author.last_name}`,
      avatar: '/team/default-avatar.jpg', // Default avatar
    },
    tags: post.tags.map(tag => ({
      name: tag.name,
      slug: tag.slug
    })),
  };
}

// Adapter function to transform API blog post detail to frontend format
export function adaptBlogPostDetail(post: BlogPostDetail): FormattedBlogPostDetail {
  const formattedPost = adaptBlogPost(post) as FormattedBlogPostDetail;
  
  // Calculate read time (rough estimate: 200 words per minute)
  const wordCount = post.content.split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
  
  return {
    ...formattedPost,
    content: post.content,
    readTime: `${readTimeMinutes} min read`,
    metaTitle: post.meta_title,
    metaDescription: post.meta_description,
    canonicalUrl: post.canonical_url,
    keywords: post.focus_keywords ? post.focus_keywords.split(',').map(k => k.trim()) : [],
  };
} 