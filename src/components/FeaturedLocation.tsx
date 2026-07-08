import Image from "next/image";
import Link from "next/link";
import { Markdown } from "@/components/Markdown";
import { type Location } from "@/lib/content";

/**
 * The big "where we are right now" block on the home page
 */
export function FeaturedLocation({ location }: { location: Location }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="overflow-hidden border border-sand bg-cream shadow-sm">
        {/* Header: big cover + summary */}
        <div className="grid items-stretch gap-8 md:grid-cols-2">
          <div className="relative min-h-72 md:min-h-112">
            <Image
              src={location.cover.src}
              alt={location.coverAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              placeholder="blur"
              blurDataURL={location.cover.blurDataURL}
              className="object-cover"
            />
            <span className="absolute left-4 top-4 rounded-full bg-terracotta px-3 py-1 text-xs font-semibold text-cream">
              Current Location
            </span>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10">
            <p className="text-sm font-semibold tracking-wide text-terracotta uppercase">
              {location.stay}
            </p>
            <h2 className="mt-2 font-display text-4xl text-forest sm:text-5xl">
              {location.title}
            </h2>
            <p className="mt-1 text-sm font-medium text-clay">
              {location.region}
            </p>
            <Markdown
              html={location.summary}
              className="mt-4 text-lg text-ink/80"
            />
            <Link
              href={location.permalink}
              className="font-semibold text-terracotta underline underline-offset-4 mt-4"
            >
              See photos of {location.title} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
