import Link from "next/link";
import Image from "next/image";
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
          </div>
          <ul className="mt-10 space-y-8">
            {musings.map((musing, i) => (
              <li key={musing.slug}>
                <Link
                  href={musing.permalink}
                  className={`group grid gap-5 border border-sand bg-cream p-5 transition-transform hover:-translate-y-1 sm:grid-cols-[1fr_2fr] ${i % 2 === 0 ? "tilt-left" : "tilt-right"}`}
                >
                  {musing.cover && (
                    <div className="relative aspect-4/3 overflow-hidden">
                      <Image
                        src={musing.cover.src}
                        alt={musing.coverAlt ?? ""}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        placeholder="blur"
                        blurDataURL={musing.cover.blurDataURL}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="self-center">
                    <p className="text-sm text-clay">{formatDate(musing.date)}</p>
                    <h2 className="mt-1 font-display text-2xl text-forest">
                      {musing.title}
                    </h2>
                    <p className="mt-2 text-ink/75">{musing.excerpt}</p>
                  </div>
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
