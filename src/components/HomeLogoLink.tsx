"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Watercolor-flower mark pinned to the top-left corner of every page except
// the home page, linking back home.
export function HomeLogoLink() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <Link
      href="/"
      aria-label="Back to home"
      className="fixed left-2 top-4 z-40 block h-20 w-20 transition-transform hover:-translate-y-0.5 sm:h-24 sm:w-24"
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
