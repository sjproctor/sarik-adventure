// Small shared pieces of the card/tile look, so the grids and cards stay in
// sync without repeating class strings.

import type { Location } from "@/lib/content";

export type Tilt = "tilt-left" | "tilt-right";

/** Alternate items left/right by index for the hand-placed scrapbook look. */
export function tiltFor(index: number): Tilt {
  return index % 2 === 0 ? "tilt-left" : "tilt-right";
}

/** Props shared by every location card variant. */
export type CardProps = {
  location: Location;
  tilt?: Tilt;
  /** Heading tag for the title, chosen to fit the surrounding page outline. */
  headingLevel?: 2 | 3 | 4;
};

/** The framed, lift-on-hover link wrapper every location card uses. */
export const cardLinkClass =
  "group block overflow-hidden border border-sand bg-cream shadow-sm transition-transform hover:-translate-y-1 focus-visible:-translate-y-1";
