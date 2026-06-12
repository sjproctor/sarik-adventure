import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getMusings, formatDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Musings",
  description:
    "Other thoughts — the things that don't fit neatly under a location.",
};

export default function MusingsPage() {
  const musings = getMusings();

  return (
    <div className="mx-auto max-w-4xl px-5 pb-10 pt-28 md:pt-16">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl text-forest sm:text-5xl">
          Some stories & musings
        </h1>
        <p className="mt-4 text-lg text-ink/80">
          Here&apos;s what&apos;s going on.
        </p>
      </header>

      <ul className="mt-10 space-y-8">
        {musings.map((musing, i) => (
          <li key={musing.slug}>
            <Link
              href={musing.permalink}
              className={`group grid gap-5 border border-sand bg-cream p-5 transition-transform hover:-translate-y-1 sm:grid-cols-[1fr_2fr] ${i % 2 === 0 ? "tilt-left" : "tilt-right"}`}
            >
              {musing.cover && (
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={musing.cover.src}
                    alt={musing.coverAlt ?? ""}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    placeholder="blur"
                    blurDataURL={musing.cover.blurDataURL}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="self-center">
                <p className="text-sm text-clay">{formatDate(musing.date)}</p>
                <h2 className="mt-1 font-display text-2xl text-forest">
                  {musing.title}
                </h2>
                <p className="mt-2 text-ink/75">{musing.excerpt}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
