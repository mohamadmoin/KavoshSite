'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import type { Locale } from "@/config/i18n-config";
import "../globals.css";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Use the same font for Farsi, just add the variable
const vazirmatn = geistSans;

export default function LayoutClientContent({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: Locale;
}) {
  const isRtl = lang === 'fa';
  
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} antialiased
      ${isRtl ? 'font-vazirmatn text-right' : ''}`}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="relative flex min-h-screen flex-col">
          <Header lang={lang} />
          <main className="flex-1">{children}</main>
          <Footer lang={lang} />
        </div>
      </ThemeProvider>
    </div>
  );
} 