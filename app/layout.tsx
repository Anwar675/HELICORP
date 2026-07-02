import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider, ThemeProvider } from "./context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NEXUS S1 | AI Smartwatch",
    template: "%s | NEXUS S1",
  },
  description:
    "Discover NEXUS S1, an AI-powered smartwatch built for health tracking, long battery life, and everyday performance.",
  keywords: [
    "NEXUS S1",
    "AI smartwatch",
    "smartwatch",
    "health tracking",
    "fitness wearable",
    "wearable technology",
  ],
  authors: [{ name: "NEXUS Technologies" }],
  creator: "NEXUS Technologies",
  publisher: "NEXUS Technologies",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "NEXUS S1 | AI Smartwatch",
    description:
      "Meet NEXUS S1, an AI-powered smartwatch for health, performance, and all-day intelligence.",
    type: "website",
    siteName: "NEXUS S1",
    images: [
      {
        url: "/produce.png",
        width: 1200,
        height: 630,
        alt: "NEXUS S1 AI smartwatch",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXUS S1 | AI Smartwatch",
    description:
      "AI-powered smartwatch for health tracking, long battery life, and everyday performance.",
    images: ["/produce.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <CartProvider>{children}</CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
