import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { DefaultSeo } from "next-seo";
import "./globals.css";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import { GoogleTagManagerHead, GoogleTagManagerBody } from "../components/GoogleTagManager";
import PageViewTracker from "../components/PageViewTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteConfig = {
  name: "KavoshSite",
  title: "KavoshSite - AI-Powered Task Automation",
  description: "Discover our innovative AI-powered webapp for task automation. Boost productivity with our cutting-edge solutions.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
};

export const metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["AI", "automation", "webapp", "productivity", "task management"],
  authors: [{ name: "KavoshSite Team" }],
  creator: "KavoshSite Team",
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // For development, we'll use the hardcoded GTM ID
  // In production, we would fetch this from the API
  const gtmId = "GTM-PWP4Z4FG";
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleTagManagerHead gtmId={gtmId} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleTagManagerBody gtmId={gtmId} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PageViewTracker />
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
