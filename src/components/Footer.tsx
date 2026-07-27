"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/site";

export function Footer() {
  const pathname = usePathname();

  return (
    <footer className="mt-8 md:mt-24 border-t border-sand/70 bg-sand/30 bottom-0">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center justify-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={(event) => {
                    if (link.href === "/" && pathname === "/") {
                      event.preventDefault();
                      const prefersReducedMotion = window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                      ).matches;
                      window.scrollTo({
                        top: 0,
                        behavior: prefersReducedMotion ? "auto" : "smooth",
                      });
                    }
                  }}
                  className="font-semibold text-terracotta hover:underline underline-offset-4"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
