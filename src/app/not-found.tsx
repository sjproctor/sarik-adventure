"use client";
import Image from "next/image";

// App router requires the file to be named not-found

export default function NotFound() {
  return (
    <section
      id="locations"
      className="mx-auto max-w-6xl scroll-mt-8 px-5 py-20"
    >
      <div className="flex flex-col gap-10 md:flex-row md:items-start">
        <div className="max-w-xl space-y-4 text-lg text-ink/80">
          <h1 className="mt-2 font-display text-4xl text-forest sm:text-5xl">
            Oops!
          </h1>
          <p>This page doesn't exist.</p>
          <p>
            But since you are here, check out this adorable pic of us during the
            seventh inning stretch at Petco Park, home of the San Diego Padres.
          </p>
        </div>
        <div className="mx-auto w-full max-w-xs shrink-0 md:mx-0 md:max-w-sm">
          <Image
            src="/not-found.jpg"
            alt="Selfie of Sarah and Erik during the seventh inning stretch during a Padres game at Petco Park."
            width={1920}
            height={2560}
            sizes="(max-width: 768px) 20rem, 24rem"
            className="h-auto w-full shadow-sm"
          />
        </div>
      </div>
    </section>
  );
}
