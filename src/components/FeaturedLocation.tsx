import Image from "next/image";
import Link from "next/link";
import { Markdown } from "@/components/Markdown";
import { MoreInfoIcon } from "@/components/MoreInfoIcon";
import { type Location } from "@/lib/content";

/**
 * The big featured block on the home page — used for where we are right now
 * and for the most recent destination we've left.
 */
export function FeaturedLocation({
  location,
  badge = "Current Location",
  priority = true,
}: {
  location: Location;
  badge?: string;
  /** Eager-load the cover; turn off for blocks below the fold. */
  priority?: boolean;
}) {
  return (
    <div className="overflow-hidden border border-sand bg-cream shadow-sm">
      {/* Header: big cover + summary */}
      <Link
        href={location.permalink}
        aria-label={`View details for ${location.title}`}
      >
        <div className="grid items-stretch gap-8 md:grid-cols-2">
          <div className="relative min-h-72 md:min-h-112">
            <Image
              src={location.cover.src}
              alt={location.coverAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={priority}
              placeholder="blur"
              blurDataURL={location.cover.blurDataURL}
              className="object-cover"
              style={{ objectPosition: location.coverPosition }}
            />
            <span className="absolute left-4 top-4 rounded-full bg-terracotta/90 px-3 py-1 text-xs font-semibold text-cream backdrop-blur-sm">
              {badge}
            </span>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10">
            <p className="text-sm font-semibold tracking-wide text-terracotta uppercase">
              {location.stay}
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <h2 className="font-display text-4xl text-forest sm:text-5xl">
                {location.title}
              </h2>
              <MoreInfoIcon className="size-8" />
            </div>
            <p className="mt-1 text-sm font-medium text-clay">
              {location.region}
            </p>
            <Markdown
              html={location.summary}
              className="mt-4 text-lg text-ink/80"
            />
          </div>
        </div>
      </Link>
    </div>
  );
}
