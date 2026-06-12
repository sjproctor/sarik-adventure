import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MDXContent } from "@/components/MDXContent";
import { getMusing, getMusings, formatDate } from "@/lib/content";

export function generateStaticParams() {
  return getMusings().map((musing) => ({ slug: musing.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const musing = getMusing(slug);
  if (!musing) return {};
  return { title: musing.title, description: musing.excerpt };
}

export default async function MusingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const musing = getMusing(slug);
  if (!musing) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 pb-10 pt-28 md:pt-16">
      <header className="mt-6">
        <p className="text-sm text-clay">{formatDate(musing.date)}</p>
        <h1 className="mt-1 font-display text-4xl text-forest sm:text-5xl">
          {musing.title}
        </h1>
      </header>

      {musing.cover && (
        <div className="relative mt-8 aspect-video overflow-hidden">
          <Image
            src={musing.cover.src}
            alt={musing.coverAlt ?? ""}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            placeholder="blur"
            blurDataURL={musing.cover.blurDataURL}
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-10">
        <MDXContent code={musing.body} />
      </div>
    </article>
  );
}
