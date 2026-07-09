import Image from "next/image";
import Link from "next/link";
import { Markdown } from "@/components/Markdown";
import { MoreInfoIcon } from "@/components/MoreInfoIcon";
import type { Location } from "@/lib/content";

const statusLabel: Record<Location["status"], string> = {
  current: "Current Location",
  next: "Coming Up",
  past: "Visited",
};

const statusStyle: Record<Location["status"], string> = {
  current: "bg-terracotta/90 text-cream",
  next: "bg-sand/90 text-forest",
  past: "bg-cream/90 text-ink/70",
};

export function LocationCard({
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
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={location.cover.src}
          alt={location.coverAlt}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          placeholder="blur"
          blurDataURL={location.cover.blurDataURL}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[location.status]}`}
        >
          {statusLabel[location.status]}
        </span>
      </div>
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
