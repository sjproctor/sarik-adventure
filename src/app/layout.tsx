import type { Metadata } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import { HomeLogoLink } from "@/components/HomeLogoLink";
import { site } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap"
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap"
});

export const metadata: Metadata = {
  // Base for resolving the relative URLs below (and any per-page metadata)
  // into the absolute URLs OG scrapers require.
  metadataBase: new URL("https://sarik-adventure.vercel.app"),
  title: site.name,
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    url: "/",
    siteName: site.name,
    images: [{ url: "/preview.png" }],
    type: "website"
  }
};

export default function RootLayout({
  children
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
        <HomeLogoLink />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
