import Image from "next/image";
import Link from "next/link";
import { Markdown } from "@/components/Markdown";
import { MoreInfoIcon } from "@/components/MoreInfoIcon";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, getAllPhotos } from "@/lib/content";
import type { Location } from "@/lib/content";

const shortStopPill = (
  <span className="bg-forest/80 px-3 py-1 text-xs font-semibold text-cream">
    Short Stop
  </span>
);

export function PlacesRow({ location }: { location: Location }) {
  const isCurrent = location.status === "current";
  const isInterstitial = location.kind === "interstitial";
  const count = getAllPhotos(location).length;

  return (
    <Link
      href={location.permalink}
      className="group flex flex-wrap gap-4 sm:gap-6"
    >
      <div className="relative border border-sand h-[40vh] w-90 overflow-hidden">
        <Image
          src={location.cover.src}
          alt={location.coverAlt}
          fill
          sizes="100vw"
          priority={isCurrent}
          placeholder="blur"
          blurDataURL={location.cover.blurDataURL}
          className="object-cover transition-transform duration-500 group-hover:scale-103"
          style={{ objectPosition: location.coverPosition }}
        />
        <div className="absolute flex gap-2">
          {isInterstitial && shortStopPill}
        </div>
      </div>

      <div>
        <p className="text-sm text-clay">
          {formatDate(location.date)} · {location.region}
        </p>
        <div className="flex items-center gap-4 justify-between">
          <h3 className="mt-0.5 font-display text-xl text-forest sm:text-2xl">
            {location.title}
          </h3>
          <MoreInfoIcon className="size-8" />
        </div>
        <p className="mt-1 text-sm font-medium text-clay">
          {location.stay}
          {count > 0 && <> · {count} photos</>}
        </p>
        {isCurrent && (
          <p className="mt-2">
            <StatusBadge status="current" />
          </p>
        )}
        <Markdown
          html={location.summary}
          className="mt-3 max-w-xl text-ink/75 sm:block"
        />
      </div>
    </Link >
  );
}
