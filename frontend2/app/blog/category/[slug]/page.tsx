import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPostsByCategory } from "../../../../lib/api";
import { adaptBlogPost, FormattedBlogPost } from "../../../../types/blog";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic'; // Force dynamic rendering for this route

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const categoryName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return {
    title: `${categoryName} Articles | KavoshSite Blog`,
    description: `Browse all articles in the ${categoryName} category.`,
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  let posts: FormattedBlogPost[] = [];
  let error = null;
  
  try {
    const postsData = await getPostsByCategory(slug);
    posts = postsData.map(post => adaptBlogPost(post));
  } catch (err) {
    console.error(`Error fetching posts for category ${slug}:`, err);
    error = 'Failed to load category posts. Please try again later.';
  }
  
  // Format the category name for display
  const categoryName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

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

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {categoryName}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse all articles in the {categoryName} category.
          </p>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-lg text-red-500">{error}</p>
            <p className="mt-4 text-muted-foreground">
              Please make sure the backend API is running at{" "}
              {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg">No posts found in this category.</p>
            <Link
              href="/blog"
              className="mt-4 inline-flex items-center text-primary hover:underline"
            >
              View all blog posts <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
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
      </div>
    </div>
  );
} 