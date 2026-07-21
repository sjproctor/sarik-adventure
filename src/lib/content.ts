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

/** Upcoming stops (`next`), sorted by `order`. */
export function getFutureLocations(): Location[] {
  return locations.filter((l) => l.status === "next").sort(byOrder);
}

/**
 * The home-page timeline: everywhere we are or have been — destinations and
 * interstitials alike — newest first. The current stop leads regardless of
 * date so the "here now" super-row always tops the list.
 */
export function getTimelineLocations(): Location[] {
  return locations
    .filter((l) => l.status !== "next")
    .sort(
      (a, b) =>
        Number(b.status === "current") - Number(a.status === "current") ||
        byDateDesc(a, b)
    );
}

/** Every photo on a location — the lead gallery plus each album's set. */
export function getAllPhotos(location: Location): GalleryItem[] {
  return [...location.gallery, ...location.albums.flatMap((a) => a.gallery)];
}

/** A highlight for the home Photos wall: the photo plus where it was taken. */
export type HighlightPhoto = GalleryItem & {
  locationTitle: string;
  locationPermalink: string;
};

// When a location has no `featured` photos, the wall shows its first few
// instead so new locations appear without any curation step.
const HIGHLIGHT_FALLBACK_COUNT = 3;

/**
 * The curated photo wall for the home page's "Photos" view: each location's
 * `featured: true` photos (or its first few when none are flagged), tagged
 * with the location they're from. Locations appear newest first.
 */
export function getHighlightPhotos(): HighlightPhoto[] {
  return getTimelineLocations().flatMap((location) => {
    const photos = getAllPhotos(location);
    const flagged = photos.filter((p) => p.featured);
    const picks =
      flagged.length > 0 ? flagged : photos.slice(0, HIGHLIGHT_FALLBACK_COUNT);
    return picks.map((photo) => ({
      ...photo,
      locationTitle: location.title,
      locationPermalink: location.permalink,
    }));
  });
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
