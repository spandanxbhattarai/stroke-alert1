import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Brain Stroke Emergency Help — Find Nearest Hospital Now | StrokeAlert",
    template: "%s | StrokeAlert",
  },
  description:
    "Get immediate help for brain stroke. Find the nearest hospital, call directly, or get directions instantly. Available 24/7.",
  keywords: [
    "brain stroke emergency",
    "stroke hospital near me",
    "stroke help",
    "emergency hospital",
    "brain stroke symptoms",
    "FAST stroke",
  ],
  authors: [{ name: "StrokeAlert" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Brain Stroke Emergency Help — Find Nearest Hospital Now",
    description:
      "Get immediate help for brain stroke. Find the nearest hospital, call directly, or get directions instantly. Available 24/7.",
    siteName: "StrokeAlert",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brain Stroke Emergency Help — StrokeAlert",
    description: "Find nearest hospital for stroke emergency. Call or get directions instantly.",
  },
  other: {
    "theme-color": "#dc2626",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#dc2626" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
