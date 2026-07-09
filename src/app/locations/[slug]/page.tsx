import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Gallery } from "@/components/Gallery";
import { LocationPhotos } from "@/components/LocationPhotos";
import { Markdown, stripHtml } from "@/components/Markdown";
import { MDXContent } from "@/components/MDXContent";
import { getLocation, getLocations } from "@/lib/content";
import type { Location } from "@/lib/content";

const statusLabel: Record<Location["status"], string> = {
  current: "Current Location",
  next: "Coming Up",
  past: "Visited",
};

const statusStyle: Record<Location["status"], string> = {
  current: "bg-terracotta/90 text-cream",
  next: "bg-sand/90 text-forest",
  past: "bg-cream/90 text-ink/70",
};

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
        />
        {/* ink/70 keeps the cream title/region text readable over bright covers */}
        <div className="absolute inset-0 bg-linear-to-t from-ink/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-4xl px-5 pb-8">
          <h1 className="font-display text-4xl text-cream sm:text-6xl">
            {location.title}
          </h1>
          <p className="font-semibold text-cream/90">{location.region}</p>
        </div>
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[location.status]}`}
        >
          {statusLabel[location.status]}
        </span>
      </div>

      <div className="mx-auto max-w-4xl px-5 py-12">
        {/* Call out with our timeline and stats of the city */}
        <div className="border border-sand p-6 mt-6 bg-cream flex flex-wrap justify-around gap-4">
          <div className="flex flex-col items-center">
            <p className="text-clay font-semibold uppercase">Our Visit</p>
            <p>{location.stay}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-clay font-semibold uppercase">Area population</p>
            <p>{location.population}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-clay font-semibold uppercase">Elevation</p>
            <p>{location.elevation}</p>
          </div>
        </div>

        {/* Random pics in a horizontal scroll */}
        {location.gallery.length > 0 && (
          <section className="mt-14">
            <Gallery images={location.gallery} variant="row" />
          </section>
        )}

        {/* Overview section */}
        <section className="mt-14">
          <Markdown
            html={location.overview}
            className="text-lg text-ink/80 pb-4"
          />
        </section>

        {/* Our likes and tips */}
        {location.suggestions?.showSuggestions && (
          <section className="mt-14">
            <h2 className="mb-4 font-display text-3xl text-forest">
              Our Thumbs Up List
            </h2>
            <Markdown
              as="div"
              html={location.suggestions.content}
              className="prose-natural"
            />
          </section>
        )}

        {/* Photos: browse by album (events) or as one large gallery feed.
            Not shown for future locations, which have nothing to show yet. */}
        {location.status !== "next" && (
          <LocationPhotos location={location} albums={location.albums} />
        )}

        {/* Anything else in the body section of the MDX file */}
        {location.body && (
          <div className="mt-8">
            <MDXContent code={location.body} />
          </div>
        )}

        {/* History of the area; controlled by a boolean value in the MDX */}
        {location.history?.showHistory && (
          <section className="mt-14">
            <h2 className="mb-4 font-display text-3xl text-forest">
              History of the Area
            </h2>
            <Markdown
              as="div"
              html={location.history.content}
              className="prose-natural"
            />
          </section>
        )}
      </div>
    </article>
  );
}
