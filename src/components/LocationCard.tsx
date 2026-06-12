import Image from "next/image";
import Link from "next/link";
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

export function LocationCard({
  location,
  tilt = "tilt-left",
}: {
  location: Location;
  tilt?: "tilt-left" | "tilt-right";
}) {
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
        <h3 className="font-display text-2xl text-forest">{location.title}</h3>
        <p className="mt-1 text-sm font-medium text-clay">{location.region}</p>
        <Markdown html={location.summary} className="mt-3 text-ink/75" />
      </div>
    </Link>
  );
}
