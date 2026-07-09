import type { Metadata } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { site } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  // Base for resolving the relative URLs below (and any per-page metadata)
  // into the absolute URLs OG scrapers require.
  metadataBase: new URL("https://sarik-adventure.vercel.app"),
  // Template keeps the site name in the document title on subpages, which set
  // only their own title (e.g. "Sun Valley — Sarik's Adventures").
  title: { default: site.name, template: `%s — ${site.name}` },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    url: "/",
    siteName: site.name,
    images: [{ url: "/preview.png" }],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${nunito.variable}`}>
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-terracotta focus:px-4 focus:py-2 focus:text-cream"
        >
          Skip to content
        </a>
        <main id="main">
          <BackButton />
          {children}
        </main>
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
