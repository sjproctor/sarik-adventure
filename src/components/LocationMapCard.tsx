import Link from "next/link";
import { MapEmbed } from "@/components/MapEmbed";
import { Markdown } from "@/components/Markdown";
import type { Location } from "@/lib/content";

const statusLabel: Record<Location["status"], string> = {
  current: "Current Location",
  next: "Coming Up",
  past: "Visited",
};

const statusStyle: Record<Location["status"], string> = {
  current: "bg-terracotta text-cream",
  next: "bg-sand text-forest",
  past: "bg-cream text-ink/70",
};

/**
 * Like LocationCard, but the media area is an embedded Google Map pinned on the
 * city instead of a cover photo — useful for upcoming stops we haven't shot
 * yet. Uses the keyless maps embed, so no API key is required.
 *
 * The map iframe is interactive, so (unlike LocationCard) the whole card can't
 * be one link — the title links through to the location page instead.
 */
export function LocationMapCard({
  location,
  tilt = "tilt-left",
}: {
  location: Location;
  tilt?: "tilt-left" | "tilt-right";
}) {
  const query = `${location.title}, ${location.region}`;
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    query
  )}&z=7&output=embed`;
  // Edit the z= param to adjust the default zoom level (higher = closer)

  return (
    <article
      className={`overflow-hidden border border-sand bg-cream shadow-sm ${tilt}`}
    >
      <div className="relative aspect-4/3 overflow-hidden hidden md:block">
        <MapEmbed title={`Map of ${query}`} src={mapSrc} />
        <span
          className={`pointer-events-none absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${statusStyle[location.status]}`}
        >
          {statusLabel[location.status]}
        </span>
      </div>
      <Link href={location.permalink} className="">
        <div className="p-5">
          <h3 className="font-display text-2xl text-forest underline-offset-4 hover:text-terracotta hover:underline">
            {location.title}
          </h3>
          <p className="mt-1 text-sm font-medium text-clay">
            {location.region}
          </p>
          <Markdown html={location.summary} className="mt-3 text-ink/75" />
        </div>
      </Link>
    </article>
  );
}
