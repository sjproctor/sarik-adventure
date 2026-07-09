import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/Hero";
import { FeaturedLocation } from "@/components/FeaturedLocation";
import { LocationCard } from "@/components/LocationCard";
import { LocationInfoCard } from "@/components/LocationInfoCard";
import { MoreInfoIcon } from "@/components/MoreInfoIcon";
import {
  getCurrentLocation,
  getFutureLocations,
  getPastLocations,
  getMusings,
  formatDate,
} from "@/lib/content";

export default function HomePage() {
  const current = getCurrentLocation();
  const future = getFutureLocations();
  const past = getPastLocations();
  const musings = getMusings();

  return (
    <>
      <Hero />

      {/* Featured: where we are right now */}
      {current && <FeaturedLocation location={current} />}

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
                    <MoreInfoIcon className="size-8 shrink-0 text-terracotta transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1" />
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
            <>
              <h3 className="font-display text-2xl text-forest">
                What&apos;s ahead
              </h3>
              <ul className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {future.map((location, i) => (
                  <li key={location.slug}>
                    <LocationInfoCard
                      location={location}
                      tilt={i % 2 === 0 ? "tilt-left" : "tilt-right"}
                      headingLevel={4}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}

          {past.length > 0 && (
            <>
              <h3
                className={`font-display text-2xl text-forest ${future.length > 0 ? "mt-16" : ""}`}
              >
                Where we&apos;ve been
              </h3>
              <ul className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {past.map((location, i) => (
                  <li key={location.slug}>
                    <LocationCard
                      location={location}
                      tilt={i % 2 === 0 ? "tilt-left" : "tilt-right"}
                      headingLevel={4}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
    </>
  );
}
