import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { LocationPhotos } from "@/components/LocationPhotos";
import { Markdown, stripHtml } from "@/components/Markdown";
import { MDXContent } from "@/components/MDXContent";
import { StatusBadge } from "@/components/StatusBadge";
import { getLocation, getLocations } from "@/lib/content";

export function generateStaticParams() {
  return getLocations().map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) return {};
  return { title: location.title, description: stripHtml(location.summary) };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) notFound();

  return (
    <article>
      {/* Cover */}
      <div className="relative h-[50vh] min-h-80 w-full overflow-hidden">
        <Image
          src={location.cover.src}
          alt={location.coverAlt}
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={location.cover.blurDataURL}
          className="object-cover"
          style={{ objectPosition: location.coverPosition }}
        />
        {/* ink/70 keeps the cream title/region text readable over bright covers */}
        <div className="absolute inset-0 bg-linear-to-t from-ink/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-5xl px-5 pb-8">
          <h1 className="font-display text-4xl text-cream sm:text-6xl">
            {location.title}
          </h1>
          <p className="font-semibold text-cream/90">{location.region}</p>
        </div>
        {/* The rounded current badge gets inset from the corner; the square
            badges stay flush against the edge as before. */}
        <div
          className={
            location.status === "current"
              ? "absolute top-3 right-3"
              : "absolute right-0"
          }
        >
          <StatusBadge status={location.status} />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5">
        {/* Call out with our timeline and stats of the city */}
        <section className="mt-6 sm:mt-14 border border-sand p-6 bg-cream flex flex-wrap justify-around gap-4">
          <div className="flex flex-col items-center">
            <p className="text-clay font-semibold uppercase">Our Visit</p>
            <p>{location.stay}</p>
          </div>
          {location.population && (
            <div className="flex flex-col items-center">
              <p className="text-clay font-semibold uppercase">
                Area population
              </p>
              <p>{location.population}</p>
            </div>
          )}
          {location.elevation && (
            <div className="flex flex-col items-center">
              <p className="text-clay font-semibold uppercase">Elevation</p>
              <p>{location.elevation}</p>
            </div>
          )}
          {location.county && (
            <div className="flex flex-col items-center">
              <p className="text-clay font-semibold uppercase">County</p>
              <p>{location.county}</p>
            </div>
          )}
        </section>

        {/* Overview section */}
        <section className="mt-6 sm:mt-14">
          <Markdown
            html={location.overview}
            className="text-lg text-ink/80 pb-4"
          />
        </section>

        {/* Images and written content */}
        <div className="flex gap-2 sm:gap-16 flex-col-reverse sm:flex-row">
          <div className="basis-2/3">
            {/* Photos: browse by album (events) or as one large gallery feed.
            Not shown for future locations, which have nothing to show yet. */}
            {location.status !== "next" && (
              <LocationPhotos albums={location.albums} />
            )}
          </div>
          <div className="basis-1/3">
            {/* Our likes and tips */}
            {location.suggestions?.showSuggestions && (
              <section className="mt-6 sm:mt-14 border border-sand p-6 bg-cream">
                <h2 className="mb-4 font-display text-xl text-forest">
                  Our Thumbs Up List
                </h2>
                <Markdown
                  as="div"
                  html={location.suggestions.content}
                  className="prose-natural"
                />
              </section>
            )}

            {/* Anything else in the body section of the MDX file */}
            {location.body && (
              <div className="mt-8">
                <MDXContent code={location.body} />
              </div>
            )}

            {/* Unique terminology of the area; controlled by a boolean value in the MDX */}
            {location.vocabulary?.showVocabulary && (
              <section className="mt-6 border border-sand p-6 bg-cream">
                <h2 className="mb-4 font-display text-xl text-forest">
                  How to Speak Like a Local
                </h2>
                <Markdown
                  as="div"
                  html={location.vocabulary.content}
                  className="prose-natural"
                />
              </section>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
