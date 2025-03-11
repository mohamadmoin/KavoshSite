import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";
import { getBlogPostBySlug, getRecentPosts } from "../../../lib/api";
import { adaptBlogPost, adaptBlogPostDetail, FormattedBlogPost, FormattedBlogPostDetail } from "../../../types/blog";
import { notFound } from "next/navigation";
import BlogContent from "../../../components/BlogContent";

// Remove static blog post data

export const dynamic = 'force-dynamic'; // Force dynamic rendering for this route

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const post = await getBlogPostBySlug(params.slug);
    
    if (!post) {
      return {
        title: "Blog Post Not Found",
      };
    }
    
    const formattedPost = adaptBlogPostDetail(post);
    
    return {
      title: `${formattedPost.title} | KavoshSite Blog`,
      description: formattedPost.excerpt,
      openGraph: {
        title: formattedPost.title,
        description: formattedPost.excerpt,
        images: [
          {
            url: formattedPost.image,
          },
        ],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog | KavoshSite",
      description: "Read our latest blog post",
    };
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  let post: FormattedBlogPostDetail | null = null;
  let recentPosts: FormattedBlogPost[] = [];
  let error = null;
  
  try {
    const postData = await getBlogPostBySlug(params.slug);
    
    if (!postData) {
      return notFound();
    }
    
    post = adaptBlogPostDetail(postData);
    
    // Fetch recent posts for the sidebar
    const recentPostsData = await getRecentPosts();
    recentPosts = recentPostsData.map(p => adaptBlogPost(p)).filter(p => p.slug !== params.slug).slice(0, 3);
  } catch (err) {
    console.error(`Error fetching blog post with slug ${params.slug}:`, err);
    error = 'Failed to load blog post. Please try again later.';
  }
  
  if (error) {
    return (
      <div className="py-20 pt-32 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Error Loading Blog Post</h1>
          <p className="text-muted-foreground mb-8">{error}</p>
          <Link
            href="/blog"
            className="inline-flex items-center text-primary hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="py-20 pt-32 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center text-primary hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 pt-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to blog link */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-primary hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Link>
        </div>

        {/* Featured image */}
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-8">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <span className="inline-block px-3 py-1 bg-primary text-white text-sm font-semibold rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {post.title}
            </h1>
          </div>
        </div>

        {/* Post metadata */}
        <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-muted-foreground">
          <div className="flex items-center">
            <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="block text-foreground font-medium">
                {post.author.name}
              </span>
              <span className="block">{post.author.role || 'Author'}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {post.date}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            {post.readTime}
          </div>
        </div>

        {/* Post content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BlogContent content={post.content} />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-border">
                <div className="flex items-center flex-wrap gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.slug}
                      href={`/blog/tag/${tag.slug}`}
                      className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full hover:bg-muted/80 transition-colors"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author bio */}
            <div className="mt-8 p-6 bg-card border border-border rounded-xl">
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    About {post.author.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {post.author.role || 'Author'} at KavoshSite with expertise in AI and
                    automation technologies. Passionate about helping businesses
                    leverage technology to improve productivity.
                  </p>
                  <Link
                    href={`/team/${post.author.name
                      .toLowerCase()
                      .replace(" ", "-")}`}
                    className="text-primary hover:underline"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-card border border-border rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
                <div className="space-y-4">
                  {recentPosts.length > 0 ? (
                    recentPosts.map((recentPost) => (
                      <div key={recentPost.slug} className="flex items-start gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={recentPost.image}
                            alt={recentPost.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/blog/${recentPost.slug}`}
                            className="font-medium hover:text-primary transition-colors line-clamp-2"
                          >
                            {recentPost.title}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-1">
                            {recentPost.date}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No recent posts found.</p>
                  )}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Subscribe to Our Newsletter</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the latest articles, news and updates from us.
                </p>
                <form className="space-y-3">
                  <div>
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="text-xs text-muted-foreground mt-3">
                  By subscribing, you agree to our Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 