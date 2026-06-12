import type { Metadata } from "next";
import { LocationCard } from "@/components/LocationCard";
import { getLocations } from "@/lib/content";

export const metadata: Metadata = {
  title: "Locations",
  description: "Where we have been and where we are heading.",
};

export default function LocationsPage() {
  const locations = getLocations();

  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-28 md:pt-16">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl text-forest sm:text-5xl">
          All the Locations
        </h1>
        <p className="mt-4 text-lg text-ink/80">
          The full list of where we have been and what we have planned out.
        </p>
      </header>

      <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((location, i) => (
          <li key={location.slug}>
            <LocationCard
              location={location}
              tilt={i % 2 === 0 ? "tilt-left" : "tilt-right"}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
