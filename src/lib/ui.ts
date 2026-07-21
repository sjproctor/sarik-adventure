// Small shared pieces of the tile look, so galleries stay in sync without
// repeating class strings.

export type Tilt = "tilt-left" | "tilt-right";

/** Alternate items left/right by index for the hand-placed scrapbook look. */
export function tiltFor(index: number): Tilt {
  return index % 2 === 0 ? "tilt-left" : "tilt-right";
}
