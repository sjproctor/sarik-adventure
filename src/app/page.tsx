import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/Hero";
import { FeaturedLocation } from "@/components/FeaturedLocation";
import { InterstitialCard } from "@/components/InterstitialCard";
import { LocationCard } from "@/components/LocationCard";
import { MoreInfoIcon } from "@/components/MoreInfoIcon";
import {
  getCurrentLocation,
  getRecentInterstitials,
  getMostRecentPastDestination,
  getFutureLocations,
  getPastLocations,
  getMusings,
  formatDate,
} from "@/lib/content";
import type { Location } from "@/lib/content";
import { tiltFor } from "@/lib/ui";

/**
 * A responsive grid of location cards with an optional heading. Interstitial
 * stops get their compact card; everything else the standard one.
 */
function LocationGrid({
  title,
  titleClassName = "",
  locations,
  cardHeadingLevel = 4,
}: {
  title?: string;
  titleClassName?: string;
  locations: Location[];
  cardHeadingLevel?: 2 | 3 | 4;
}) {
  return (
    <>
      {title && (
        <h3 className={`font-display text-2xl text-forest ${titleClassName}`}>
          {title}
        </h3>
      )}
      <ul className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((location, i) => {
          const Card =
            location.kind === "interstitial" ? InterstitialCard : LocationCard;
          return (
            <li key={location.slug}>
              <Card
                location={location}
                tilt={tiltFor(i)}
                headingLevel={cardHeadingLevel}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default function HomePage() {
  const current = getCurrentLocation();
  // The stops between main destinations — the current one (if we're at an
  // interstitial right now) plus everything marked `recent` — render below
  // the featured destination as compact cards.
  const recentInterstitials = getRecentInterstitials();
  const recentPast = getMostRecentPastDestination();
  const future = getFutureLocations();
  // The most recent past destination gets its own featured block up top, so
  // keep it out of the "Where we've been" grid.
  const past = getPastLocations().filter((l) => l.slug !== recentPast?.slug);
  const musings = getMusings();

  return (
    <>
      <Hero />

      {/* Featured: where we are right now */}
      {current && <FeaturedLocation location={current} />}

      {/* Stops in between; hidden when no interstitial is current or recent */}
      {recentInterstitials.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pt-4 pb-8">
          <LocationGrid locations={recentInterstitials} cardHeadingLevel={2} />
        </section>
      )}

      {/* Featured: the last destination we stayed at */}
      {recentPast && (
        <FeaturedLocation
          location={recentPast}
          badge="Most Recent Stay"
          priority={!current && recentInterstitials.length === 0}
        />
      )}

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
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
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

      {/* All locations: upcoming stops, then places we've visited */}
      {(future.length > 0 || past.length > 0) && (
        <section
          id="locations"
          className="mx-auto max-w-6xl scroll-mt-8 px-5 py-20"
        >
          <div className="mb-10">
            <p className="text-sm font-semibold tracking-wide text-terracotta uppercase">
              Where the road is taking us
            </p>
            <h2 className="mt-2 font-display text-4xl text-forest sm:text-5xl">
              Locations
            </h2>
          </div>

          {future.length > 0 && (
            <LocationGrid title="Coming up" locations={future} />
          )}

          {past.length > 0 && (
            <LocationGrid
              title="Where we've been"
              titleClassName={future.length > 0 ? "mt-16" : ""}
              locations={past}
            />
          )}
        </section>
      )}
    </>
  );
}
