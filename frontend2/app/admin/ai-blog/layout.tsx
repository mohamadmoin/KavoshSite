import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Blog Generator - Admin Dashboard",
  description: "Generate high-quality blog posts with AI assistance",
};

export default function AIBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 