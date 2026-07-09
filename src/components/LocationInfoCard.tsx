import Link from "next/link";
import { Markdown } from "@/components/Markdown";
import { MoreInfoIcon } from "@/components/MoreInfoIcon";
import type { Location } from "@/lib/content";

/**
 * A text-only location card for upcoming stops we haven't photographed yet.
 * Shows the same details as LocationCard (title, region, stay, summary) minus
 * the cover image, and renders identically across all viewports.
 */
export function LocationInfoCard({
  location,
  tilt = "tilt-left",
  headingLevel = 3,
}: {
  location: Location;
  tilt?: "tilt-left" | "tilt-right";
  /** Heading tag for the title, chosen to fit the surrounding page outline. */
  headingLevel?: 2 | 3 | 4;
}) {
  const Heading = `h${headingLevel}` as const;
  return (
    <Link
      href={location.permalink}
      className={`group block overflow-hidden border border-sand bg-cream shadow-sm transition-transform hover:-translate-y-1 focus-visible:-translate-y-1 ${tilt}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <Heading className="font-display text-2xl text-forest">
            {location.title}
          </Heading>
          <MoreInfoIcon
            className="mt-1 size-6 shrink-0 text-terracotta transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1"
            title={`More about ${location.title}`}
          />
        </div>
        <p className="mt-1 text-sm font-medium text-clay">{location.region}</p>
        <p className="mt-1 text-sm font-medium text-clay">{location.stay}</p>
        <Markdown html={location.summary} className="mt-3 text-ink/75" />
      </div>
    </Link>
  );
}
