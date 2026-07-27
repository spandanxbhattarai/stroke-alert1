import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// SIGNAL type system: one grotesque for everything, one mono for data.
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  weight: ["400", "500"],
});

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
    "stroke hospitals Nepal",
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
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0c" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <head>
        {/* Admin map embeds still hit Google Maps — keep the handshake warm. */}
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased bg-paper text-ink">{children}</body>
    </html>
  );
}
