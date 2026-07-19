import Image from "next/image";
import Link from "next/link";
import { Markdown } from "@/components/Markdown";
import { MoreInfoIcon } from "@/components/MoreInfoIcon";
import { StatusBadge } from "@/components/StatusBadge";
import { cardLinkClass, type CardProps } from "@/lib/ui";

/**
 * The standard location card for the home-page grids. Upcoming stops
 * (`status: "next"`) haven't been photographed yet, so they render text-only —
 * same details, no cover image or status badge.
 */
export function LocationCard({
  location,
  tilt = "tilt-left",
  headingLevel = 3,
}: CardProps) {
  const Heading = `h${headingLevel}` as const;
  const showImage = location.status !== "next";
  return (
    <Link href={location.permalink} className={`${cardLinkClass} ${tilt}`}>
      {showImage && (
        <div className="relative aspect-4/3 overflow-hidden">
          <Image
            src={location.cover.src}
            alt={location.coverAlt}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            placeholder="blur"
            blurDataURL={location.cover.blurDataURL}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectPosition: location.coverPosition }}
          />
          <StatusBadge
            status={location.status}
            className="absolute left-3 top-3"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <Heading className="font-display text-2xl text-forest">
            {location.title}
          </Heading>
          <MoreInfoIcon className="mt-1 size-6" />
        </div>
        <p className="mt-1 text-sm font-medium text-clay">{location.region}</p>
        <p className="mt-1 text-sm font-medium text-clay">{location.stay}</p>
        <Markdown html={location.summary} className="mt-3 text-ink/75" />
      </div>
    </Link>
  );
}
