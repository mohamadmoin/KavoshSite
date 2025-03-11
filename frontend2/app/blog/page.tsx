import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getBlogPosts } from "../../lib/api";
import { adaptBlogPost, FormattedBlogPost } from "../../types/blog";

// Remove static blog post data

export const metadata = {
  title: "Blog - KavoshSite",
  description:
    "Stay updated with the latest insights, tips, and news about AI, automation, and productivity.",
};

export const dynamic = 'force-dynamic'; // Force dynamic rendering for this route
export const revalidate = 0; // Disable caching for this route

async function BlogListingPage() {
  console.log("Rendering BlogListingPage component");
  let posts: FormattedBlogPost[] = [];
  let totalPosts = 0;
  let totalPages = 1;
  let error = null;

  try {
    console.log("About to fetch blog posts from API");
    const result = await getBlogPosts(1, 10);
    console.log("Successfully fetched blog posts:", result);
    posts = result.data.map(post => adaptBlogPost(post));
    totalPosts = result.total;
    totalPages = result.totalPages;
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    error = 'Failed to load blog posts. Please try again later.';
  }

  return (
    <div className="py-20 pt-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest insights, tips, and news about AI,
            automation, and productivity.
          </p>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-lg text-red-500">{error}</p>
            <p className="mt-4 text-muted-foreground">
              Please make sure the backend API is running at{" "}
              {process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"}
            </p>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-left">
              <p className="font-semibold">Debugging Information:</p>
              <p className="text-sm mt-2">
                Check the browser console and server logs for more detailed error information.
                Make sure your backend server is running and accessible.
              </p>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg">No blog posts found.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              API URL: {process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"}
            </p>
          </div>
        ) : (
          /* Blog posts grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-card border border-border rounded-xl overflow-hidden transition-all hover:shadow-xl group"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-sm">
                        <span className="text-foreground font-medium">
                          {post.author.name}
                        </span>
                        <span className="text-muted-foreground">
                          {" "}
                          • {post.date}
                        </span>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <div className="flex items-center text-primary font-medium">
                      Read more <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {posts.length > 0 && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                disabled={true}
                className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground"
              >
                &lt;
              </button>
              <button className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center">
                1
              </button>
              {Array.from({ length: Math.min(totalPages - 1, 4) }).map((_, i) => (
                <button
                  key={i + 2}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  {i + 2}
                </button>
              ))}
              {totalPages > 5 && (
                <button className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors">
                  &gt;
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogListingPage; 