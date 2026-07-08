import Image from "next/image";
import Link from "next/link";
import { Gallery, type GalleryImage } from "@/components/Gallery";
import { Markdown } from "@/components/Markdown";
import { albumSlug, getLocationPhotos, type Location } from "@/lib/content";

// How many photos to surface on the home page. Enough for a quick glance;
// the rest live on the location's own page.
const PREVIEW_COUNT = 6;

/**
 * The big "where we are right now" block on the home page — a single current
 * location given full-width, image-forward treatment, with a preview of its
 * latest photos so a passing visitor gets the quick update at a glance.
 */
export function FeaturedLocation({ location }: { location: Location }) {
  const photos = getLocationPhotos(location);
  // Prefer photos the author flagged `featured`; fall back to the first few
  // when nothing is flagged. Either way, cap the preview at PREVIEW_COUNT.
  const flagged = photos.filter((p) => p.featured);
  const selected = (flagged.length > 0 ? flagged : photos).slice(
    0,
    PREVIEW_COUNT
  );
  const hasMore = photos.length > selected.length;

  // An album's first photo doubles as its cover. Map those covers to their
  // album so the matching preview tile links to the album (badge + title)
  // instead of opening the lightbox like an ordinary photo.
  const albumByCover = new Map<string, GalleryImage["album"]>(
    location.albums
      .filter((a) => a.gallery.length > 0)
      .map((a) => [
        a.gallery[0].src.src,
        { href: `${location.permalink}#${albumSlug(a.title)}`, title: a.title },
      ])
  );

  const preview: GalleryImage[] = selected.map((photo) => {
    const album = albumByCover.get(photo.src.src);
    return album ? { ...photo, album } : photo;
  });

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="overflow-hidden border border-sand bg-cream shadow-sm">
        {/* Header: big cover + summary */}
        <div className="grid items-stretch gap-8 md:grid-cols-2">
          <div className="relative min-h-72 md:min-h-112">
            <Image
              src={location.cover.src}
              alt={location.coverAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              placeholder="blur"
              blurDataURL={location.cover.blurDataURL}
              className="object-cover"
            />
            <span className="absolute left-4 top-4 rounded-full bg-terracotta px-3 py-1 text-xs font-semibold text-cream">
              Current Location
            </span>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10">
            <p className="text-sm font-semibold tracking-wide text-terracotta uppercase">
              {location.stay}
            </p>
            <h2 className="mt-2 font-display text-4xl text-forest sm:text-5xl">
              {location.title}
            </h2>
            <p className="mt-1 text-sm font-medium text-clay">
              {location.region}
            </p>
            <Markdown
              html={location.summary}
              className="mt-4 text-lg text-ink/80"
            />
            <Link
              href={location.permalink}
              className="font-semibold text-terracotta underline underline-offset-4 mt-4"
            >
              See photos of {location.title} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
