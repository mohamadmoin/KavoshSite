# Kavosh Blog Frontend

This is a Next.js frontend for the Kavosh Blog application. It connects to a Django REST API backend to display blog posts.

## Features

- View a list of blog posts
- View individual blog posts
- Filter posts by category or tag
- View featured and recent posts

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Backend API running at http://localhost:8000

### Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### API Endpoints

The frontend connects to the following API endpoints:

- `GET /api/posts/` - List all blog posts
- `GET /api/posts/{slug}/` - Get a specific blog post by slug
- `GET /api/posts/featured/` - Get featured blog posts
- `GET /api/posts/recent/` - Get recent blog posts
- `GET /api/categories/{slug}/posts/` - Get posts by category
- `GET /api/tags/{slug}/posts/` - Get posts by tag

## Authentication

The API uses `IsAuthenticatedOrReadOnly` permission, which means:
- Anonymous users can read blog posts (GET requests)
- Only authenticated users can create, update, or delete posts (POST, PUT, DELETE requests)

This frontend application focuses on the read-only functionality.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
