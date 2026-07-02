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
  title: "NEXUS S1 | AI Smartwatch",
  description:
    "Discover NEXUS S1, an AI-powered smartwatch built for health tracking, long battery life, and everyday performance.",
  openGraph: {
    title: "NEXUS S1 | AI Smartwatch",
    description:
      "Discover NEXUS S1, an AI-powered smartwatch built for health tracking, long battery life, and everyday performance.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=960&h=960&fit=crop&auto=format",
        width: 960,
        height: 960,
        alt: "NEXUS S1 AI smartwatch thumbnail",
      },
    ],
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
