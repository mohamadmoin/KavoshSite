# KavoshSite Backend

A Django-based CMS backend with REST API and AI blog generation capabilities.

## Features

- Blog system with categories and tags
- REST API using Django REST Framework
- AI-powered blog post generation
- Token-based authentication for admin access
- Media file management

## Prerequisites

- Python 3.9+
- Django 5.1+
- Virtual environment (recommended)

## Installation

1. Clone the repository
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Apply migrations:
   ```bash
   python manage.py migrate
   ```
5. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```
6. Generate an authentication token for your user:
   ```bash
   python manage.py drf_create_token username
   ```
   Note: Replace "username" with your actual username

## Running the Server

Start the development server:

```bash
python manage.py runserver
```

The API will be available at http://127.0.0.1:8000/api/

## API Endpoints

- Blog Posts: `/api/posts/`
  - List all posts: GET `/api/posts/`
  - Get a specific post: GET `/api/posts/<slug>/`
  - Featured posts: GET `/api/posts/featured/`
  - Recent posts: GET `/api/posts/recent/`

- Categories: `/api/categories/`
  - List all categories: GET `/api/categories/`
  - Posts by category: GET `/api/categories/<slug>/posts/`

- Tags: `/api/tags/`
  - List all tags: GET `/api/tags/`
  - Posts by tag: GET `/api/tags/<slug>/posts/`

- AI Blog Generator: `/api/ai-blog/`
  - List all requests: GET `/api/ai-blog/requests/`
  - Create request: POST `/api/ai-blog/requests/`
  - Get generation: GET `/api/ai-blog/requests/<id>/generation/`
  - Regenerate: POST `/api/ai-blog/requests/<id>/regenerate/`
  - Publish: POST `/api/ai-blog/generations/<id>/publish/`

- Authentication: `/api/auth-token/`
  - Get token: POST `/api/auth-token/` with username and password

## Authentication

The API uses token-based authentication for secured endpoints. To access protected endpoints:

1. Obtain a token by sending a POST request to `/api/auth-token/` with your username and password
2. Include the token in your request headers: `Authorization: Token <your-token>`

Example:
```bash
curl -X GET http://127.0.0.1:8000/api/ai-blog/requests/ \
  -H "Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
```

## AI Blog Generation

The backend includes an AI-powered blog generation system that creates high-quality blog posts based on prompts and topics. This system:

1. Accepts a topic and prompt from the user
2. Generates a complete blog post with proper content structure
3. Creates SEO metadata
4. Suggests relevant categories and tags

The generation process runs asynchronously in the background, allowing users to check the status and retrieve the result when complete.

## Project Structure

```
backend/
├── blog/                # Blog models and views
├── admin_panel/         # Admin dashboard related code
├── ai_blog_generator/   # AI blog generation functionality
├── cmsbackend/          # Project settings
└── media/               # Uploaded media files
``` 