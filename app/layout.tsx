import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { SITE_URL, site } from "@/data/site";
import SmoothScroll from "@/components/layout/SmoothScroll";
import BackgroundCanvas from "@/components/background/BackgroundCanvas";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "700"],
  variable: "--font-display",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

const title = `${site.name} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: `%s — ${site.name}`,
  },
  description: site.short,
  applicationName: site.name,
  keywords: [
    "Ayush Narayan",
    "backend engineer",
    "applied AI",
    "LLM",
    "RAG",
    "FastAPI",
    "React Three Fiber",
    "Bengaluru",
    "portfolio",
  ],
  authors: [{ name: site.name, url: site.links.github }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: site.name,
    title,
    description: site.short,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.short,
    creator: "@marvelayush",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0607",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body className="ambient-glow relative min-h-screen">
        <a
          href="#main"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded bg-accent px-4 py-2 text-sm text-accent-fg opacity-0 transition-transform duration-200 ease-smooth focus:translate-y-0 focus:opacity-100"
        >
          Skip to content
        </a>
        <BackgroundCanvas />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
