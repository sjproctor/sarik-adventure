import Link from "next/link";
import { Hero } from "@/components/Hero";
import { FeaturedLocation } from "@/components/FeaturedLocation";
import { LocationMapCard } from "@/components/LocationMapCard";
import {
  getCurrentLocation,
  getFutureLocations,
  getMusings,
  formatDate,
} from "@/lib/content";

export default function HomePage() {
  const current = getCurrentLocation();
  const future = getFutureLocations();
  const musings = getMusings().slice(0, 3);

  return (
    <>
      <Hero />

      {/* Featured: where we are right now */}
      {current && <FeaturedLocation location={current} />}

      {/* Recent musings */}
      {musings.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="font-display text-3xl text-forest">
              Some stories & musings
            </h2>
            <Link
              href="/musings"
              className="font-semibold text-terracotta underline underline-offset-4"
            >
              More musings →
            </Link>
          </div>
          <ul className="grid gap-6 sm:grid-cols-3">
            {musings.map((musing) => (
              <li key={musing.slug}>
                <Link
                  href={musing.permalink}
                  className="block border border-sand bg-cream p-6 transition-transform hover:-translate-y-1"
                >
                  <p className="text-sm text-clay">{formatDate(musing.date)}</p>
                  <h3 className="mt-1 font-display text-xl text-forest">
                    {musing.title}
                  </h3>
                  <p className="mt-2 text-ink/75">{musing.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* What's ahead */}
      {future.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="font-display text-3xl text-forest">
              What&apos;s ahead for us
            </h2>
            <Link
              href="/locations"
              className="font-semibold text-terracotta underline underline-offset-4"
            >
              All locations →
            </Link>
          </div>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {future.map((location, i) => (
              <li key={location.slug}>
                <LocationMapCard
                  location={location}
                  tilt={i % 2 === 0 ? "tilt-left" : "tilt-right"}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
