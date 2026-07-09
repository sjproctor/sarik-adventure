"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * A circular "back home" button pinned to the top-left corner of every page
 * except the home page. Positioned `fixed`, so it stays in view as the visitor
 * scrolls. The solid background keeps it legible over both plain pages and the
 * full-bleed cover image on location detail pages.
 */
export function BackButton() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <Link
      href="/"
      aria-label="Back to home"
      className="fixed left-4 top-4 z-40 flex size-11 items-center justify-center rounded-full bg-terracotta/90 text-cream shadow-sm transition-all hover:-translate-x-0.5 hover:bg-clay/90 focus-visible:-translate-x-0.5"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="size-6"
      >
        <path d="M15 6l-6 6 6 6" />
      </svg>
    </Link>
  );
}
