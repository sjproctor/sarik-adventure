"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import type { GalleryItem } from "@/lib/content";

/** A gallery image, optionally tagged with the album it belongs to. */
export type GalleryImage = GalleryItem & {
  // The album this photo belongs to. Shown beneath the photo in the "feed"
  // variant and as the lightbox badge, so a combined feed can name the event
  // each shot is from.
  albumTitle?: string;
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
          <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-terracotta/90 px-3 py-1 text-xs font-semibold text-cream backdrop-blur-sm">
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
  variant?: "grid" | "masonry" | "row" | "feed";
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

  // `sizes` must match the tile's real rendered width per variant — the
  // variants render at fixed/near-fixed widths, so viewport-relative values
  // make browsers fetch image variants 2-4x larger than needed.
  const tile = (
    image: GalleryImage,
    i: number,
    aspect: string,
    sizes: string,
  ) => {
    const photo = (
      <Image
        src={image.src.src}
        alt={image.alt}
        fill
        sizes={sizes}
        placeholder="blur"
        blurDataURL={image.src.blurDataURL}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
    );
    const className = `group relative block w-full overflow-hidden border border-sand ${aspect}`;

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
    // Per-image album (used by the feed) wins; otherwise the whole-gallery prop.
    albumTitle: image.albumTitle ?? albumTitle,
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
              {/* Tiles are fixed w-52/sm:w-64 */}
              {tile(image, i, "aspect-[4/5]", "(max-width: 640px) 13rem, 16rem")}
            </li>
          ))}
        </ul>
      ) : variant === "feed" ? (
        // One large photo per row on phones; a two-column masonry on wider
        // screens. Each photo keeps its natural aspect (no cropping) and shows
        // its album + caption beneath.
        <ul className="columns-1 gap-x-6 sm:columns-2 *:mb-10">
          {images.map((image, i) => (
            <li key={image.src.src} className="break-inside-avoid">
              <figure>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  onMouseEnter={() => preload(image.src.src)}
                  className="group block w-full overflow-hidden border border-sand"
                  aria-label={`Open image: ${image.alt}`}
                >
                  <Image
                    src={image.src.src}
                    alt={image.alt}
                    width={image.src.width}
                    height={image.src.height}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    placeholder="blur"
                    blurDataURL={image.src.blurDataURL}
                    className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
                {(image.albumTitle || image.caption) && (
                  <figcaption className="mt-3">
                    {image.albumTitle && (
                      <span className="text-xs font-semibold tracking-wide text-terracotta uppercase">
                        {image.albumTitle}
                      </span>
                    )}
                    {image.caption && (
                      <p className="mt-1 text-sm text-ink/75">
                        {image.caption}
                      </p>
                    )}
                  </figcaption>
                )}
              </figure>
            </li>
          ))}
        </ul>
      ) : variant === "masonry" ? (
        <ul className="gap-4 columns-2 sm:columns-3 *:mb-4">
          {images.map((image, i) => (
            <li
              key={image.src.src}
              className={`break-inside-avoid ${i % 2 === 0 ? "tilt-left" : "tilt-right"}`}
            >
              {/* Columns inside a max-w-4xl container cap tiles near 300px */}
              {tile(
                image,
                i,
                MASONRY_ASPECTS[i % MASONRY_ASPECTS.length],
                "(max-width: 640px) 50vw, 300px",
              )}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((image, i) => (
            <li
              key={image.src.src}
              className={i % 2 === 0 ? "tilt-left" : "tilt-right"}
            >
              {tile(image, i, "aspect-square", "(max-width: 640px) 50vw, 300px")}
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
