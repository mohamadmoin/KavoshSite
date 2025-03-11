"use client";

import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, noPadding = false }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className={`flex-grow ${noPadding ? '' : 'container mx-auto px-4 py-8 mt-16'}`}>
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout; 