import Link from "next/link";
import { Boxes, BookOpen, Edit3, FileText, Home, Settings } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard - KavoshSite",
  description: "Manage your website content and settings",
};

export default function AdminDashboard() {
  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Blog Management Card */}
        <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
          <Link href="/admin/blog" className="flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Blog Management</h2>
            </div>
            <p className="text-muted-foreground mb-4 flex-grow">
              Create, edit, and manage blog posts. View analytics and engagement metrics.
            </p>
            <span className="text-primary font-medium">Manage Blog →</span>
          </Link>
        </div>
        
        {/* AI Blog Assistant Card */}
        <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/10 rounded-full"></div>
          <div className="absolute top-0 right-2">
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-bl-lg rounded-tr-xl">
              New
            </span>
          </div>
          <Link href="/admin/ai-blog" className="flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mr-4">
                <Edit3 className="h-6 w-6 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold">AI Blog Assistant</h2>
            </div>
            <p className="text-muted-foreground mb-4 flex-grow">
              Generate high-quality blog posts with AI. Create content based on topics, keywords and custom prompts.
            </p>
            <span className="text-blue-500 font-medium">Create with AI →</span>
          </Link>
        </div>
        
        {/* Categories & Tags Card */}
        <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
          <Link href="/admin/categories" className="flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <Boxes className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Categories & Tags</h2>
            </div>
            <p className="text-muted-foreground mb-4 flex-grow">
              Organize your content with categories and tags. Improve content discovery and SEO.
            </p>
            <span className="text-primary font-medium">Manage Taxonomies →</span>
          </Link>
        </div>
        
        {/* Pages Card */}
        <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
          <Link href="/admin/pages" className="flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Pages</h2>
            </div>
            <p className="text-muted-foreground mb-4 flex-grow">
              Manage static pages like About, Contact, Services, and more.
            </p>
            <span className="text-primary font-medium">Manage Pages →</span>
          </Link>
        </div>
        
        {/* Site Settings Card */}
        <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
          <Link href="/admin/settings" className="flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Settings</h2>
            </div>
            <p className="text-muted-foreground mb-4 flex-grow">
              Configure website settings, SEO options, and user permissions.
            </p>
            <span className="text-primary font-medium">Manage Settings →</span>
          </Link>
        </div>
        
        {/* View Site Card */}
        <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
          <Link href="/" className="flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">View Website</h2>
            </div>
            <p className="text-muted-foreground mb-4 flex-grow">
              Visit your website to see all published content and changes.
            </p>
            <span className="text-primary font-medium">Go to Website →</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 