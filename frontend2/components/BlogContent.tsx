'use client';

import { useEffect, useRef } from 'react';

interface BlogContentProps {
  content: string;
  className?: string;
}

/**
 * BlogContent component for rendering HTML content with enhanced styling
 * 
 * This component renders blog content with proper styling for all HTML elements
 * including special styled elements like .info-box and .highlight-box
 */
export default function BlogContent({ content, className = '' }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Add any necessary post-processing for content after render
  useEffect(() => {
    if (!contentRef.current) return;
    
    // Add lazy loading to images
    const images = contentRef.current.querySelectorAll('img');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
      // Wrap images that aren't already in figure tags
      if (img.parentElement?.tagName !== 'FIGURE') {
        const figure = document.createElement('figure');
        const figCaption = document.createElement('figcaption');
        // Use alt text as caption if available
        if (img.alt && !img.alt.startsWith('image')) {
          figCaption.textContent = img.alt;
          figure.appendChild(img.cloneNode(true));
          figure.appendChild(figCaption);
          img.parentNode?.replaceChild(figure, img);
        }
      }
    });
    
    // Add target="_blank" to external links
    const links = contentRef.current.querySelectorAll('a');
    links.forEach(link => {
      if (link.hostname !== window.location.hostname) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
    
    // Initialize code blocks if any
    const codeBlocks = contentRef.current.querySelectorAll('pre code');
    if (codeBlocks.length > 0) {
      // You can add code highlighting here if needed
    }
  }, [content]);
  
  return (
    <article 
      ref={contentRef}
      className={`prose prose-lg dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
} 