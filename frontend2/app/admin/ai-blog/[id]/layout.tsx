import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Blog Request - Admin Dashboard",
  description: "View AI blog generation request details",
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AIBlogRequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 