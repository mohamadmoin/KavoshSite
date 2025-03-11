import { BlogPosting } from 'schema-dts';
import { useRouter } from 'next/router';
import { JsonLd } from 'react-schemaorg';

interface BlogSchemaProps {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: {
    name: string;
    url?: string;
  };
  image?: string;
  categories?: string[];
  tags?: string[];
}

export default function BlogSchema({
  title,
  description,
  publishedAt,
  updatedAt,
  author,
  image,
  categories = [],
  tags = [],
}: BlogSchemaProps) {
  const router = useRouter();
  const url = `https://kavoshai.com${router.asPath}`;
  
  const schema: BlogPosting = {
    '@type': 'BlogPosting',
    '@context': 'https://schema.org',
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: author.name,
      url: author.url,
    },
    image: image || 'https://kavoshai.com/og-image.jpg',
    url: url,
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    keywords: [...categories, ...tags].join(', '),
    publisher: {
      '@type': 'Organization',
      name: 'KavoshSite',
      logo: {
        '@type': 'ImageObject',
        url: 'https://kavoshai.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return <JsonLd<BlogPosting> item={schema} />;
} 