"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// How far the page must scroll before the logo appears. Just past zero so the
// logo doesn't overlap page-top content, but appears on the first real scroll.
const SCROLL_THRESHOLD = 24;

// Watercolor-flower mark pinned to the top-left corner of every page except
// the home page, linking back home. Hidden at the top of the page; fades in
// once the visitor starts scrolling.
export function HomeLogoLink() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/") return null;

  return (
    <Link
      href="/"
      aria-label="Back to home"
      aria-hidden={!scrolled}
      tabIndex={scrolled ? undefined : -1}
      className={`fixed left-2 top-4 z-40 block h-20 w-20 transition-all duration-300 hover:-translate-y-0.5 sm:h-24 sm:w-24 ${
        scrolled ? "opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
      }`}
    >
      <Image
        src="/flower.png"
        alt="Sarik's Adventures — home"
        fill
        sizes="64px"
        className="object-contain"
        priority
      />
    </Link>
  );
}
