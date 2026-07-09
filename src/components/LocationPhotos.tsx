"use client";

import { useState } from "react";
import { Gallery, type GalleryImage } from "@/components/Gallery";
import { formatDate, albumSlug } from "@/lib/content";
import type { Location } from "@/lib/content";

type Album = Location["albums"][number];

/**
 * The photo section of a location page. Two ways to browse the same photos,
 * toggled client-side:
 *  - "albums" (default): each album as its own titled, described set — groups
 *    photos into events and carries the most context.
 *  - "gallery": every photo in one large, scrollable feed (one per row on
 *    phones, two on wider screens) with the album title + caption beneath each
 *    — a more visual, Instagram-like browse.
 */
export function LocationPhotos({ location, albums }: { location: Location; albums: Album[] }) {
  const [view, setView] = useState<"albums" | "gallery">("albums");

  if (albums.length === 0) return null;

  // Gallery view: every album's photos flattened into one feed, each tagged
  // with its album title so the caption can name the event it came from.
  const feed: GalleryImage[] = albums.flatMap((album) =>
    album.gallery.map((image) => ({ ...image, albumTitle: album.title })),
  );

  return (
    <section className="mt-14">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-3xl text-forest">{location.title} Photos</h2>
        <div
          role="group"
          aria-label="Choose how to view photos"
          className="inline-flex rounded-full border border-sand bg-cream p-1"
        >
          {(["albums", "gallery"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setView(option)}
              aria-pressed={view === option}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${view === option
                ? "bg-terracotta text-cream"
                : "text-forest hover:text-terracotta"
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {view === "albums" ? (
        <div className="space-y-14">
          {albums.map((album) => (
            <section
              key={album.title}
              id={albumSlug(album.title)}
              className="scroll-mt-24"
            >
              <h3 className="font-display text-2xl text-forest">
                {album.title}
              </h3>
              <p className="text-sm text-clay">{formatDate(album.date)}</p>
              {album.description && (
                <p className="mt-2 max-w-2xl text-ink/80">
                  {album.description}
                </p>
              )}
              <div className="mt-6">
                <Gallery
                  images={album.gallery}
                  variant="masonry"
                  albumTitle={album.title}
                />
              </div>
            </section>
          ))}
        </div>
      ) : (
        <Gallery images={feed} variant="feed" />
      )}
    </section>
  );
}
