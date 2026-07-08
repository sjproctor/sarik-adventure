"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import type { GalleryItem } from "@/lib/content";

/**
 * A gallery image, optionally standing in as the cover for an album. When
 * `album` is set the tile links to that album instead of opening the lightbox,
 * and shows an "Album" badge with the album's title.
 */
export type GalleryImage = GalleryItem & {
  album?: { href: string; title: string };
};

// Cycled to give the masonry layout varied tile heights without needing the
// images' intrinsic dimensions up front.
const MASONRY_ASPECTS = [
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-[5/4]",
  "aspect-square",
  "aspect-[4/6]",
];

// Full-screen photos tolerate a lower quality than the default 75 with no
// visible loss. The hover-preload below must request this same value so it
// warms the exact optimizer URL the lightbox will display.
const LIGHTBOX_QUALITY = 70;

// Mirrors `images.deviceSizes` in next.config.ts. Used to pick the variant
// width the lightbox's <Image> would request, so the preload warms a matching
// `/_next/image` URL rather than the multi-MB original.
const DEVICE_SIZES = [640, 750, 1080, 1920, 2560];

type LightboxSlide = {
  src: string;
  // Intrinsic dimensions are required by the lightbox's Zoom plugin: it derives
  // maxZoom from the image's declared size vs. the on-screen rect. Omit them and
  // maxZoom resolves to 1, which disables the zoom buttons and wheel/pinch zoom.
  width?: number;
  height?: number;
  alt?: string;
  description?: string;
  blurDataURL?: string;
  // Album the photo belongs to, shown as a small badge on the slide.
  albumTitle?: string;
};

function LightboxImage({ slide }: { slide: LightboxSlide }) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative min-h-0 flex-1">
        <Image
          src={slide.src}
          alt={slide.alt ?? ""}
          fill
          sizes="100vw"
          quality={LIGHTBOX_QUALITY}
          placeholder={slide.blurDataURL ? "blur" : "empty"}
          blurDataURL={slide.blurDataURL}
          className="object-contain"
        />
        {/* Top-left so it stays clear of the lightbox's own controls (top-right) */}
        {slide.albumTitle && (
          <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-terracotta px-3 py-1 text-xs font-semibold text-cream">
            {slide.albumTitle}
          </span>
        )}
      </div>
      {slide.description && (
        <div className="max-h-28 shrink-0 overflow-y-auto bg-black/50 px-4 py-3 text-center text-sm text-white">
          {slide.description}
        </div>
      )}
    </div>
  );
}

export function Gallery({
  images,
  variant = "grid",
  albumTitle,
}: {
  images: GalleryImage[];
  variant?: "grid" | "masonry" | "row";
  // When the gallery is one album's photos, badge each full-screen slide
  // with the album name.
  albumTitle?: string;
}) {
  const [index, setIndex] = useState(-1);

  if (images.length === 0) return null;

  // Warm the Next-optimized variant the lightbox will actually request — the
  // raw `src` points at the multi-MB original, which the lightbox never loads
  // directly (it renders through next/image). Match the displayed image's
  // width and quality so this hits the same cache entry.
  function preload(src: string) {
    const target = window.innerWidth * (window.devicePixelRatio || 1);
    const width =
      DEVICE_SIZES.find((size) => size >= target) ??
      DEVICE_SIZES[DEVICE_SIZES.length - 1];
    const img = new window.Image();
    img.src = `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${LIGHTBOX_QUALITY}`;
  }

  const tile = (image: GalleryImage, i: number, aspect: string) => {
    const photo = (
      <Image
        src={image.src.src}
        alt={image.alt}
        fill
        sizes="(max-width: 640px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL={image.src.blurDataURL}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
    );
    const className = `group relative block w-full overflow-hidden border border-sand ${aspect}`;

    // Album cover: link straight to the album rather than opening the lightbox,
    // and mark it with a badge + title so it reads as a set, not a single shot.
    // No aria-label: the visible badge + title are the accessible name, which
    // keeps it matching what voice-control users see (WCAG 2.5.3).
    if (image.album) {
      return (
        <Link href={image.album.href} className={className}>
          {photo}
          <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/75 via-ink/15 to-transparent" />
          <span className="pointer-events-none absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-terracotta px-2 py-1 text-[11px] font-semibold tracking-wide text-cream uppercase">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2 2 7l10 5 10-5-10-5Z" />
              <path d="m2 12 10 5 10-5" />
              <path d="m2 17 10 5 10-5" />
            </svg>
            Album
          </span>
          <span className="pointer-events-none absolute inset-x-0 bottom-0 p-3 font-display text-lg leading-tight text-cream">
            {image.album.title}
          </span>
        </Link>
      );
    }

    return (
      <button
        type="button"
        onClick={() => setIndex(i)}
        onMouseEnter={() => preload(image.src.src)}
        className={className}
        aria-label={`Open image: ${image.alt}`}
      >
        {photo}
      </button>
    );
  };

  const slides: LightboxSlide[] = images.map((image) => ({
    src: image.src.src,
    width: image.src.width,
    height: image.src.height,
    alt: image.alt,
    description: image.caption,
    blurDataURL: image.src.blurDataURL,
    albumTitle,
  }));

  return (
    <>
      {variant === "row" ? (
        // A single horizontal line of photos that scrolls sideways on overflow.
        <ul className="-mx-5 flex justify-between snap-x gap-4 overflow-x-auto px-5 pb-3">
          {images.map((image, i) => (
            <li
              key={image.src.src}
              className={`w-52 shrink-0 snap-start sm:w-64 ${i % 2 === 0 ? "tilt-left" : "tilt-right"}`}
            >
              {tile(image, i, "aspect-[4/5]")}
            </li>
          ))}
        </ul>
      ) : variant === "masonry" ? (
        <div className="gap-4 columns-2 sm:columns-3 *:mb-4">
          {images.map((image, i) => (
            <div
              key={image.src.src}
              className={`break-inside-avoid ${i % 2 === 0 ? "tilt-left" : "tilt-right"}`}
            >
              {tile(image, i, MASONRY_ASPECTS[i % MASONRY_ASPECTS.length])}
            </div>
          ))}
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((image, i) => (
            <li
              key={image.src.src}
              className={i % 2 === 0 ? "tilt-left" : "tilt-right"}
            >
              {tile(image, i, "aspect-square")}
            </li>
          ))}
        </ul>
      )}

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
        plugins={[Zoom]}
        render={{
          slide: ({ slide }) => (
            <LightboxImage slide={slide as LightboxSlide} />
          ),
        }}
      />
    </>
  );
}
