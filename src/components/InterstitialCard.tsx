import Image from "next/image";
import Link from "next/link";
import { Markdown } from "@/components/Markdown";
import { MoreInfoIcon } from "@/components/MoreInfoIcon";
import type { Location } from "@/lib/content";

/**
 * A compact card for interstitial stops — the short stays between major
 * destinations. Visually lighter than LocationCard (shorter photo, dashed
 * border, clamped summary) so quick stops read as connective tissue in the
 * timeline rather than full chapters. Upcoming interstitials render without
 * the photo, mirroring how LocationInfoCard handles unphotographed stops.
 */
export function InterstitialCard({
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
  const showImage = location.status !== "next";
  const pill = (
    <>
      <span className="rounded-full bg-terracotta/90 px-3 py-1 text-xs font-semibold text-cream backdrop-blur-sm">
        Short Stop
      </span>
      {location.status === "current" && (
        <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-terracotta/90 backdrop-blur-sm">
          Current Location
        </span>
      )}
    </>
  );
  return (
    <Link
      href={location.permalink}
      className={`group block overflow-hidden border border-sand bg-cream shadow-sm transition-transform hover:-translate-y-1 focus-visible:-translate-y-1 ${tilt}`}
    >
      {showImage && (
        <div className="relative aspect-video overflow-hidden">
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
          <span className="absolute left-3 top-3 flex gap-2">{pill}</span>
        </div>
      )}
      <div className="p-5">
        {!showImage && <div className="mb-3 flex gap-2">{pill}</div>}
        <div className="flex items-start justify-between gap-3">
          <Heading className="font-display text-xl text-forest">
            {location.title}
          </Heading>
          <MoreInfoIcon className="mt-0.5 size-8 shrink-0 text-terracotta transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1" />
        </div>
        <p className="mt-1 text-sm font-medium text-clay">
          {location.region} · {location.stay}
        </p>
        <Markdown
          html={location.summary}
          className="mt-2 line-clamp-2 text-sm text-ink/75"
        />
      </div>
    </Link>
  );
}
