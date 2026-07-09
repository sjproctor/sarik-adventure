import { locations, musings } from "#site/content";

export type Location = (typeof locations)[number];
export type Musing = (typeof musings)[number];
/** A Velite-processed image: { src, width, height, blurDataURL, ... }. */
export type GalleryItem = Location["gallery"][number];

const statusRank: Record<Location["status"], number> = {
  current: 0,
  next: 1,
  past: 2,
};

/** All locations, sorted: current first, then next, then past — within each group by `order`. */
export function getLocations(): Location[] {
  return [...locations].sort(
    (a, b) => statusRank[a.status] - statusRank[b.status] || a.order - b.order,
  );
}

export function getLocation(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}

/**
 * URL-fragment slug for an album, derived from its title. Used as the `id` on
 * each album section (in the location page's "albums" view) so an album can be
 * linked or bookmarked directly, e.g. `/locations/<slug>#dollar-mountain`.
 */
export function albumSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCurrentLocation(): Location | undefined {
  return locations.find((l) => l.status === "current");
}

/** Upcoming stops (`next`), sorted by `order`. */
export function getFutureLocations(): Location[] {
  return locations
    .filter((l) => l.status === "next")
    .sort((a, b) => a.order - b.order);
}

/** Places we've already been (`past`), sorted by `order`. */
export function getPastLocations(): Location[] {
  return locations
    .filter((l) => l.status === "past")
    .sort((a, b) => a.order - b.order);
}

/** All musings, newest first. */
export function getMusings(): Musing[] {
  return [...musings].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getMusing(slug: string): Musing | undefined {
  return musings.find((m) => m.slug === slug);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
