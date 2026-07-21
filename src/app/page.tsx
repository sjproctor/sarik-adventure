import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/Hero";
import { Gallery, type GalleryImage } from "@/components/Gallery";
import { LocationsSection } from "@/components/LocationsSection";
import { PlacesRow } from "@/components/PlacesRow";
import { MoreInfoIcon } from "@/components/MoreInfoIcon";
import {
  getFutureLocations,
  getTimelineLocations,
  getHighlightPhotos,
  getMusings,
  formatDate,
} from "@/lib/content";

export default function HomePage() {
  const future = getFutureLocations();
  const timeline = getTimelineLocations();
  const musings = getMusings();

  // The Photos wall: each highlight tagged with a link to its location page,
  // shown as the tile caption and as the badge on the lightbox slide.
  const highlights: GalleryImage[] = getHighlightPhotos().map(
    ({ locationTitle, locationPermalink, ...photo }) => ({
      ...photo,
      link: { label: locationTitle, href: locationPermalink },
    })
  );

  return (
    <>
      <Hero />

      {/* All locations, one section: the Places/Photos toggle switches between
          the navigational timeline and the cross-location photo wall */}
      <section
        id="locations"
        className="mx-auto max-w-6xl scroll-mt-8 px-5 py-20"
      >
        <LocationsSection
          heading={
            <div>
              <p className="text-sm font-semibold tracking-wide text-terracotta uppercase">
                Where we've been
              </p>
              <h2 className="mt-2 font-display text-4xl text-forest sm:text-5xl">
                Locations
              </h2>
            </div>
          }
          places={
            <>
              <ul>
                {timeline.map((location) => (
                  <li key={location.slug} className="mb-8">
                    <PlacesRow location={location} />
                  </li>
                ))}
              </ul>
              {/* Upcoming stops: a slim inline cluster after the timeline —
                  no photos to show yet, so no rows */}
              {future.length > 0 && (
                <div className="mt-8">
                  <p className="text-sm font-semibold tracking-wide text-terracotta uppercase">
                    Coming up
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-x-12 gap-y-2">
                    {future.map((location) => (
                      <li key={location.slug}>
                        <Link
                          href={location.permalink}
                          className="group text-forest"
                        >
                          <span className="font-display text-lg group-hover:text-terracotta">
                            {location.title}
                          </span>
                          <span className="ml-2 text-sm text-clay">
                            {location.stay}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          }
          photos={<Gallery images={highlights} variant="masonry" />}
        />
      </section>

      {/* All musings */}
      {musings.length > 0 && (
        <section id="musings" className="scroll-mt-8 bg-sand/40 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="mb-10">
              <p className="text-sm font-semibold tracking-wide text-terracotta uppercase">
                If you are curious
              </p>
              <h2 className="mt-2 font-display text-4xl text-forest sm:text-5xl">
                Stories & Musings
              </h2>
            </div>
            <ul className="divide-y divide-sand border-y border-sand">
              {musings.map((musing) => (
                <li key={musing.slug}>
                  <Link
                    href={musing.permalink}
                    className="group flex items-center gap-4 py-4 sm:gap-5"
                  >
                    {musing.cover && (
                      <div className="relative size-16 shrink-0 overflow-hidden sm:size-20">
                        <Image
                          src={musing.cover.src}
                          alt={musing.coverAlt ?? ""}
                          fill
                          sizes="80px"
                          placeholder="blur"
                          blurDataURL={musing.cover.blurDataURL}
                          className="object-cover transition-transform duration-500 group-hover:scale-103"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-clay">
                        {formatDate(musing.date)}
                      </p>
                      <h3 className="mt-0.5 font-display text-xl text-forest sm:text-2xl">
                        {musing.title}
                      </h3>
                    </div>
                    <MoreInfoIcon className="size-8" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
