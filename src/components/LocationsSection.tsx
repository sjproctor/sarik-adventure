"use client";

import { useState, useSyncExternalStore } from "react";

const VIEWS = ["view by location", "photo gallery"] as const;
type View = (typeof VIEWS)[number];

// Persists the visitor's last-used view across visits. The server renders
// "places" (the default); a saved "photos" choice applies on hydration, so
// returning photo-browsers may see a brief swap.
const STORAGE_KEY = "locations-view";

// localStorage never notifies within a tab, so there's nothing to subscribe
// to — the saved view only matters for the initial client render; after that
// the visitor's clicks drive the state.
const subscribeNoop = () => () => {};

function useSavedView(): View {
  const saved = useSyncExternalStore(
    subscribeNoop,
    () => localStorage.getItem(STORAGE_KEY),
    () => null
  );
  return saved === "photo gallery" ? "photo gallery" : "view by location";
}

/**
 * The home page's unified Locations section: a pill toggle (same UI as the
 * Albums/Gallery toggle on location pages) switching between two views of the
 * same places —
 *  - "places": the navigational timeline of rows linking to location pages
 *  - "photos": the cross-location wall of curated highlight photos
 * Both views render server-side and arrive as props; this component only
 * owns the switch.
 */
export function LocationsSection({
  heading,
  places,
  photos,
}: {
  heading: React.ReactNode;
  places: React.ReactNode;
  photos: React.ReactNode;
}) {
  // The saved choice covers the initial render; once the visitor clicks a
  // pill, their in-page choice wins.
  const savedView = useSavedView();
  const [chosenView, setChosenView] = useState<View | null>(null);
  const view = chosenView ?? savedView;

  function choose(next: View) {
    setChosenView(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        {heading}
        <div
          role="group"
          aria-label="Choose how to explore locations"
          className="inline-flex border border-sand bg-cream p-1"
        >
          {VIEWS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => choose(option)}
              aria-pressed={view === option}
              className={`px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${
                view === option
                  ? "bg-terracotta text-cream"
                  : "text-forest hover:text-terracotta"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {view === "view by location" ? places : photos}
    </>
  );
}
