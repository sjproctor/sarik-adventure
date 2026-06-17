import Link from "next/link";
import { navLinks } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-8 md:mt-24 border-t border-sand/70 bg-sand/30 bottom-0">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center justify-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
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
