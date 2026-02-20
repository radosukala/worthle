import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import "./globals.css";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "worthle.dev — Know Your Worth",
  description:
    "A Wordle-style skill game for developers. 20 rounds. No signup. Know your real market value.",
  openGraph: {
    title: "worthle.dev — Know Your Worth",
    description:
      "A Wordle-style skill game for developers. 20 rounds. No signup. Know your real market value.",
    url: "https://worthle.dev",
    siteName: "Worthle",
    type: "website",
    images: [
      {
        url: "https://worthle.dev/og.jpg",
        width: 1200,
        height: 630,
        alt: "worthle.dev",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "worthle.dev — Know Your Worth",
    description:
      "A Wordle-style skill game for developers. 20 rounds. No signup.",
    images: ["https://worthle.dev/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={mono.variable}>
      <body className="bg-bg font-[family-name:var(--font-mono)] antialiased">
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
