# KavoshSite - AI-Powered Task Automation Website

A modern, SEO-optimized website for KavoshSite, an AI-powered task automation platform. This website is built with Next.js, TypeScript, and Tailwind CSS, featuring a beautiful design with animations and a fully responsive layout.

## Features

- **Modern Design**: Clean, minimal, and unique theme with beautiful UI/UX
- **SEO Optimized**: Built with best practices for search engine optimization
- **Responsive**: Fully responsive design that works on all devices
- **Animations**: Smooth animations on scroll using Framer Motion
- **Dark/Light Mode**: Theme toggle with system preference detection
- **Blog**: Fully featured blog with dynamic pages
- **Performance**: Optimized for fast loading and performance

## Tech Stack

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **next-themes**: Theme management
- **next-seo**: SEO optimization
- **Lucide Icons**: Beautiful, consistent icons

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Backend API running at http://localhost:8000

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/kavoshsite.git
cd kavoshsite/frontend2
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file with:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
frontend2/
├── app/                  # Next.js app directory
│   ├── components/       # React components
│   │   ├── sections/     # Page sections
│   │   └── ui/           # UI components
│   ├── blog/             # Blog pages
│   ├── about/            # About page
│   ├── contact/          # Contact page
│   ├── services/         # Services page
│   ├── lib/              # Utility libraries
│   ├── utils/            # Utility functions
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── public/               # Static assets
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies
└── tsconfig.json         # TypeScript configuration
```

## Customization

### Changing Colors

The color scheme can be modified in the `app/globals.css` file. The primary colors are teal (`#06b6d4`) and purple (`#a855f7`).

### Adding Pages

To add a new page, create a new directory in the `app` directory with a `page.tsx` file.

### Adding Blog Posts

Blog posts are currently hardcoded in the `app/blog/page.tsx` and `app/blog/[slug]/page.tsx` files. In a production environment, these would typically be fetched from a CMS or API.

## Deployment

This project can be deployed on any platform that supports Next.js, such as Vercel, Netlify, or a traditional server.

### Deploying to Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

## Admin Dashboard

The admin dashboard allows you to manage content, including:

- Blog posts management
- AI blog post generation
- Categories and tags management
- SEO settings

### Authentication

The admin dashboard uses token-based authentication to connect with the Django backend. 

1. First, ensure you have token authentication enabled in your Django backend by:
   - Adding `'rest_framework.authtoken'` to `INSTALLED_APPS`
   - Adding `'rest_framework.authentication.TokenAuthentication'` to `DEFAULT_AUTHENTICATION_CLASSES`
   - Adding the token endpoint in urls.py: `path('api/auth-token/', obtain_auth_token)`

2. Generate a token for your admin user:
   ```bash
   python manage.py drf_create_token yourusername
   ```

3. When accessing the admin dashboard at `/admin/dashboard`, you'll be asked to log in using your Django credentials.

## AI Blog Post Generation

The AI blog post generator allows you to create blog posts automatically using AI. To use this feature:

1. Navigate to the admin dashboard at `/admin/dashboard`
2. Click on "AI Blog Assistant"
3. Click "New AI Blog Post"
4. Enter a topic, prompt, and optional keywords
5. Enable web search if needed for more accurate content
6. Submit and wait for the AI to generate your blog post
7. Review, edit, and publish the generated content

The AI generator creates:
- Blog post content
- SEO metadata
- Suggested categories and tags

## API Integration

The frontend connects to the following API endpoints:

- Blog posts: `/api/posts/`
- Categories: `/api/categories/`
- Tags: `/api/tags/`
- AI blog generator: `/api/ai-blog/requests/`

## Authentication

The application uses token-based authentication for admin access. The token is stored in localStorage and attached to API requests as needed.
