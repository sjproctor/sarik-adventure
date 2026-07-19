import { locations, musings } from "#site/content";

export type Location = (typeof locations)[number];
type Musing = (typeof musings)[number];
/** A Velite-processed image: { src, width, height, blurDataURL, ... }. */
export type GalleryItem = Location["gallery"][number];

const statusRank: Record<Location["status"], number> = {
  current: 0,
  recent: 1,
  next: 2,
  past: 3,
};

const byStatusThenOrder = (a: Location, b: Location) =>
  statusRank[a.status] - statusRank[b.status] || a.order - b.order;

const byOrder = (a: Location, b: Location) => a.order - b.order;

const byDateDesc = (a: { date: string }, b: { date: string }) =>
  a.date < b.date ? 1 : -1;

/** All locations, sorted: current first, then next, then past — within each group by `order`. */
export function getLocations(): Location[] {
  return [...locations].sort(byStatusThenOrder);
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

/** The full destination we're staying at right now — drives the featured block. */
export function getCurrentLocation(): Location | undefined {
  return locations.find(
    (l) => l.status === "current" && l.kind === "destination",
  );
}

/**
 * The in-between stops row: interstitials we're at right now (`current`) or
 * that we've hit since leaving the last main destination (`recent`). The
 * current stop sorts first, then the rest by `order`. Flip these to `past`
 * once we've settled at the next main destination.
 */
export function getRecentInterstitials(): Location[] {
  return locations
    .filter(
      (l) =>
        l.kind === "interstitial" &&
        (l.status === "current" || l.status === "recent"),
    )
    .sort(byStatusThenOrder);
}

/**
 * The last full destination we stayed at — the most recent `past` destination
 * by date. Gets its own featured-style block on the home page, below the
 * current interstitials; the remaining past locations render in the
 * "Where we've been" grid.
 */
export function getMostRecentPastDestination(): Location | undefined {
  return locations
    .filter((l) => l.status === "past" && l.kind === "destination")
    .sort(byDateDesc)[0];
}

/** Upcoming stops (`next`), sorted by `order`. */
export function getFutureLocations(): Location[] {
  return locations.filter((l) => l.status === "next").sort(byOrder);
}

/** Places we've already been (`past`), sorted by `order`. */
export function getPastLocations(): Location[] {
  return locations.filter((l) => l.status === "past").sort(byOrder);
}

/** All musings, newest first. */
export function getMusings(): Musing[] {
  return [...musings].sort(byDateDesc);
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
