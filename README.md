# Modern Blog Platform with Next.js and Django

A full-stack blog platform with a modern Next.js frontend and Django CMS backend, designed for SEO optimization and content management.

## Features

### Frontend (Next.js)
- Modern, responsive design with Tailwind CSS
- SEO-optimized blog templates
- Dynamic landing page
- Admin dashboard with content management
- Blog post editor with SEO tools
- Category and tag management
- Markdown support for content

### Backend (Django)
- RESTful API with Django REST Framework
- Complete CMS functionality
- Blog post, category, and tag models
- Site settings and SEO settings
- User authentication and authorization
- Image upload and management

## Project Structure

```
├── frontend/               # Next.js frontend
│   ├── app/                # Next.js app router
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── blog/           # Blog pages
│   │   └── ...             # Other pages
│   ├── components/         # React components
│   ├── lib/                # Utility functions and API client
│   └── types/              # TypeScript type definitions
│
├── backend/                # Django backend
│   ├── blog/               # Blog app
│   │   ├── models.py       # Blog data models
│   │   ├── views.py        # API views
│   │   ├── serializers.py  # API serializers
│   │   └── ...             # Other files
│   ├── admin_panel/        # Admin panel app
│   │   ├── models.py       # Admin settings models
│   │   ├── views.py        # API views
│   │   ├── serializers.py  # API serializers
│   │   └── ...             # Other files
│   └── cmsbackend/         # Django project settings
```

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- pip
- npm or yarn

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with the following content:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies (note: Pillow is commented out in requirements.txt):
   ```
   pip install -r requirements.txt
   ```

4. Apply migrations:
   ```
   python manage.py makemigrations blog admin_panel
   python manage.py migrate
   ```

5. Initialize the database with default settings:
   ```
   python init_db.py
   ```
   This will create:
   - Default superuser (admin/adminpassword123)
   - Site settings
   - SEO settings
   - Default categories and tags

6. Start the development server:
   ```
   python manage.py runserver
   ```

## Common Issues and Solutions

### Image Processing
- By default, Pillow is commented out in requirements.txt since it can cause installation issues on some systems
- Limited image processing features will be available without Pillow
- If you need full image functionality, try installing Pillow manually: `pip install pillow`

### Connection Issues
- If the frontend cannot connect to the backend, ensure the Django server is running on port 8000
- The API client has been configured with fallback data to prevent crashes when the backend is not available
- Check CORS settings in Django if you experience cross-origin issues

### Next.js Image Optimization
- External images (like from Unsplash) are configured in next.config.js
- If you need to use images from additional external domains, add them to the domains array in next.config.js

## SEO Features

- Custom meta titles and descriptions for each post
- Automatic slug generation
- Open Graph metadata
- Structured data support
- SEO performance tracking
- Image optimization
- Character count for meta fields
- Search preview

## Deployment

### Frontend
The Next.js frontend can be deployed to Vercel, Netlify, or any other static site hosting service.

### Backend
The Django backend can be deployed to services like:
- Heroku
- DigitalOcean
- AWS
- PythonAnywhere

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js
- Django
- Tailwind CSS
- React Icons
- Django REST Framework

# KavoshSite Blog SEO & Interconnection Enhancements

This update adds significant improvements to the blog's SEO capabilities and implements automatic blog post interconnection. The changes enhance both the Django backend and Next.js frontend to create a more interconnected and search-engine-friendly blog system.

## New Features

### 1. Automatic Blog Post Interconnection
- Automatically adds relevant internal links between blog posts
- Creates "You Might Also Like" sections with related posts
- Uses AI-generated keywords and categories for smart linking
- Maintains optimal internal linking density (max 5 links per post)

### 2. Enhanced SEO Features
- Structured data (schema.org) for blog posts
- Automatic XML sitemap generation
- Robots.txt configuration
- OpenGraph and Twitter card meta tags
- Improved meta titles and descriptions

## Backend Changes (Django)

### New Components
1. **BlogLinkEnhancer Service** (`backend/blog/services.py`)
   - Automatically adds internal links between related posts
   - Generates "You Might Also Like" sections
   - Uses smart keyword matching for relevant linking

2. **Management Command** (`backend/blog/management/commands/enhance_blog_links.py`)
   - CLI tool to enhance existing blog posts with internal links
   - Supports dry-run mode for testing
   - Can process single posts or entire blog

### AI Service Improvements
- Updated AI prompts for better SEO-optimized content
- Automatic link enhancement for new AI-generated posts
- Smarter category and tag suggestions

## Frontend Changes (Next.js)

### New Components
1. **BlogSchema** (`frontend2/components/BlogSchema.tsx`)
   - Adds schema.org structured data to blog posts
   - Improves search engine understanding of content

### SEO Configuration
1. **next-seo.config.ts**
   - Default SEO settings
   - OpenGraph and Twitter card configuration
   - Meta tags and favicon configuration

2. **next-sitemap.config.js**
   - XML sitemap generation
   - Robots.txt configuration
   - Custom priorities for different page types

## Installation

1. Install new dependencies:

```bash
# Backend (Django)
pip install -r requirements.txt

# Frontend (Next.js)
cd frontend2
npm install next-seo next-sitemap schema-dts
```

2. Update environment variables:
```env
SITE_URL=https://kavoshai.com  # Update with your domain
```

## Usage

### Enhancing Existing Blog Posts

To add internal links to existing blog posts:

```bash
# Dry run to see what would change
python manage.py enhance_blog_links --dry-run

# Process all posts
python manage.py enhance_blog_links

# Process a specific post
python manage.py enhance_blog_links --post-id=123

# Customize maximum links
python manage.py enhance_blog_links --max-links=3
```

### Frontend Build

The sitemap will be generated automatically during build:

```bash
cd frontend2
npm run build  # Includes sitemap generation
```

## Benefits

1. **Improved SEO**
   - Better search engine understanding of content structure
   - Enhanced internal linking for better crawling
   - Proper meta tags and structured data
   - XML sitemaps for better indexing

2. **Better User Experience**
   - Related content suggestions
   - Natural internal linking
   - Improved navigation between posts

3. **Content Discovery**
   - Automated content connections
   - Smart categorization
   - Related posts suggestions

4. **Maintenance**
   - Automated link management
   - Easy bulk processing of posts
   - SEO best practices enforced systematically

## Best Practices

1. **Internal Linking**
   - Keep internal links relevant and natural
   - Limit to 5 links per post maximum
   - Use descriptive anchor text

2. **Content Structure**
   - Use proper heading hierarchy
   - Include meta descriptions
   - Add alt text to images

3. **SEO Optimization**
   - Fill in all meta fields
   - Use focused keywords
   - Keep URLs clean and descriptive

## Monitoring and Maintenance

1. **Regular Tasks**
   - Run `enhance_blog_links` periodically on new content
   - Update sitemaps after content changes
   - Monitor internal link counts

2. **SEO Checks**
   - Verify structured data using Google's testing tool
   - Check sitemap indexing in Search Console
   - Monitor crawl statistics

## Future Improvements

1. **Content Analysis**
   - Implement NLP for better content relationships
   - Add semantic analysis for linking
   - Improve keyword extraction

2. **User Engagement**
   - Track internal link click rates
   - Analyze user journey through posts
   - Optimize related posts algorithm

3. **SEO Features**
   - Add breadcrumb navigation
   - Implement FAQ schema
   - Add article series support

# Automatic Image Generation for Blog Posts

This update adds automatic featured image generation for blog posts using the Pexels API. The system will automatically fetch relevant, high-quality images based on the blog post's content, keywords, and categories.

## Features

### 1. Automatic Image Selection
- Images are automatically selected from Pexels based on post keywords
- Proper attribution is added to blog posts as required by Pexels guidelines
- Alt text is generated for each image for better accessibility and SEO

### 2. Integration with AI Blog Generation
- Newly generated AI blog posts will automatically get relevant featured images
- Images are added after content generation without disrupting the existing flow
- The system intelligently selects search terms based on post content

### 3. Management Command for Existing Posts
- Add images to posts that don't have them with a simple command
- Apply images to specific posts or to all posts in bulk
- Preview changes with dry-run mode

## Usage

### Configuration

The Pexels API key is already configured in the settings file:

```python
# in settings.py
PEXELS_API_KEY = os.environ.get('PEXELS_API_KEY', 'bzgxOI3o5rkIqWOyL8DDUEP2YALMxrMTBdGZdwdyGgPwlSzkYuRvF2gs')
```

### Adding Images to Existing Posts

```bash
# Dry run to see what would change
python manage.py add_featured_images --dry-run

# Process all published posts without images
python manage.py add_featured_images

# Process a specific post
python manage.py add_featured_images --post-id=123

# Replace existing images
python manage.py add_featured_images --force
```

### AI-Generated Images (Alternative)

The system is also set up for AI-generated images using OpenAI if you prefer that approach:

1. Set your OpenAI API key:
   ```
   OPENAI_API_KEY=your_key_here
   ```

2. The AltTextGenerator class can be used to generate image descriptions for DALL-E:
   ```python
   from blog.services.image_service import AltTextGenerator
   
   alt_text_generator = AltTextGenerator()
   description = alt_text_generator.generate_image_description(blog_post.content)
   ```

## How It Works

1. **Smart Search Term Selection**:
   - Extracts keywords from the blog post
   - Uses categories and tags as additional search terms
   - Falls back to title words if needed

2. **Image Selection and Download**:
   - Searches Pexels for relevant images
   - Downloads the appropriate size
   - Saves to the blog's media directory

3. **Alt Text Generation**:
   - Uses the image's provided alt text if available
   - Generates custom alt text based on the blog post content if needed
   - Ensures optimal length for SEO and accessibility

4. **Attribution**:
   - Adds proper attribution to the end of the blog post
   - Links to the photographer and Pexels as required by guidelines 

## Analytics & User Tracking

The project includes comprehensive analytics tracking using Google Tag Manager (GTM) and Google Analytics 4 (GA4):

### Features

- **Page View Tracking**: Automatically tracks page views across the site
- **Event Tracking**: Tracks user interactions like button clicks and form submissions
- **Custom Events**: Supports custom event tracking for specific business needs
- **Blog Post Analytics**: Tracks blog post views and engagement

### Implementation

- Google Tag Manager is used as the central hub for all tracking scripts
- Google Analytics 4 is configured through GTM
- Custom hooks make it easy to track events from any component

For detailed documentation, see [Analytics Implementation Guide](frontend2/docs/ANALYTICS.md). 