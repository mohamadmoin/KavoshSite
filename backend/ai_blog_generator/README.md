# AI Blog Generator

This Django app provides functionality to generate SEO-optimized blog posts using AI. It integrates with OpenAI's API to create high-quality content that can be published directly to your blog.

## Features

- Generate blog posts with AI based on user prompts
- Optionally allow web search to enhance content with up-to-date information
- Automatically suggest categories and tags for the generated content
- Create SEO-optimized meta titles, descriptions, and focus keywords
- Publish generated content directly to your blog

## API Endpoints

### AI Blog Requests

- `GET /api/ai-blog/requests/` - List all AI blog requests for the current user
- `POST /api/ai-blog/requests/` - Create a new AI blog request
- `GET /api/ai-blog/requests/{id}/` - Get details of a specific AI blog request
- `GET /api/ai-blog/requests/{id}/generation/` - Get the generated blog post for a request
- `POST /api/ai-blog/requests/{id}/regenerate/` - Regenerate a blog post for a request

### AI Blog Generations

- `GET /api/ai-blog/generations/` - List all AI blog generations for the current user
- `GET /api/ai-blog/generations/{id}/` - Get details of a specific AI blog generation
- `POST /api/ai-blog/generations/{id}/publish/` - Publish the generated blog post

## Models

### AIBlogRequest

Stores requests for AI-generated blog posts.

Fields:
- `user` - The user who created the request
- `prompt` - The prompt for the AI to generate a blog post
- `topic` - The main topic of the blog post
- `keywords` - Keywords for SEO, comma separated
- `allow_web_search` - Whether the AI is allowed to search the web
- `status` - The status of the request (pending, processing, completed, failed)
- `created_at` - When the request was created
- `updated_at` - When the request was last updated
- `error_message` - Error message if generation failed

### AIBlogGeneration

Stores the results of AI-generated blog posts.

Fields:
- `request` - The request that generated this blog post
- `blog_post` - The blog post created from this generation
- `title` - The title of the blog post
- `content` - The content of the blog post
- `excerpt` - A brief summary of the blog post
- `meta_title` - SEO-optimized title
- `meta_description` - SEO-optimized description
- `suggested_categories` - Categories suggested by the AI
- `suggested_tags` - Tags suggested by the AI
- `focus_keywords` - Primary keywords for the post
- `created_at` - When the generation was created

## Configuration

To use this app, you need to set the following environment variables:

```
OPENAI_API_KEY=your_openai_api_key
```

You can set these in your `.env` file or in your environment.

## Dependencies

- Django
- Django REST Framework
- aiohttp
- openai 