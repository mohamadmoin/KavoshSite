import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Kavosh AI",
    default: "Kavosh AI - Innovative Task Automation App",
  },
  description: "Kavosh AI is an innovative Flutter app using artificial intelligence to automate your daily tasks, boost productivity, and simplify your workflow.",
  metadataBase: new URL("https://kavoshai.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kavosh AI - Innovative Task Automation App",
    description: "Kavosh AI is an innovative Flutter app using artificial intelligence to automate your daily tasks, boost productivity, and simplify your workflow.",
    url: "https://kavoshai.com",
    siteName: "Kavosh AI",
    images: [
      {
        url: "https://kavoshai.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kavosh AI App Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kavosh AI - Innovative Task Automation App",
    description: "Kavosh AI is an innovative Flutter app using artificial intelligence to automate your daily tasks, boost productivity, and simplify your workflow.",
    images: ["https://kavoshai.com/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/images/apple-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563EB" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
