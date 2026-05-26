# Sarik Adventure

### Initial Acceptance Criteria 
- Visually focused with quite a few pictures
- Quick “what and why” above the fold
- Locations list - maybe accordion of location names with current location open, show pictures and quick notes about
  - Current location: Sun Valley
  - Next location: Bandon, OR
- Space for a collection of “other thoughts” on a blog post-style page (route: /musings) with sub-pages
- Deployed
- No user auth

### Future Features
- Users can submit emails to get updates
- Map with pins on the locations
- Comment/like photos (not public facing, just submission for me to see, maybe see the number of likes but not tied to any person)

### Design Spec

Stylized **mid-century meadow**: a dense field of thin, gently curved charcoal
stems rising from the bottom edge, each topped with a flat, graphic botanical
"bloom" rather than a realistic flower. Everything is flat color — no gradients
or shading — set against a warm aged-paper cream with subtle peach and tan
washes, which is what makes the saturated shapes pop without feeling neon.

**Bloom vocabulary** (mix freely; coral discs are the loudest and most frequent):

- **Disc blooms** — big flat circles reading as simplified poppies / pom-poms,
  in coral-orange, dusty teal, powder blue, navy, and burgundy.
- **Ringed & two-tone discs** — a disc with a concentric inner ring in a
  contrasting color, or split into two color halves.
- **Dotted discs** — a dark disc (burgundy or navy) speckled with small cream
  dots, like confetti or a seed head packed into a circle.
- **Dandelion starbursts** — fine lines radiating to tiny dot tips, mostly
  charcoal/navy with a few in coral. These carry the airy, whimsical movement.
- **Umbels & lace** — a stalk that splits into many fine stems, each ending in a
  dot, forming a loose Queen Anne's-lace dome, in mustard, pink, and cream.
- **Clustered dot blooms** — looser constellations of dots, in mustard, pink,
  and burgundy.
- **Buds & pods** — simple teardrops and ovals in coral and teal, scattered
  among the stems.

**Palette** — one warm dominant (coral), one cool counterweight (teal/blue), a
warm-neutral cream background, and small doses of saturated accents. Flattened
into roles, it maps cleanly onto design-system tokens:

| Role | Color | Hex |
| --- | --- | --- |
| Background | cream (warm aged paper) | `#F4E8D5` (warmer `#EFE3CD`) |
| Primary accent | coral | `#E87A5D` |
| Secondary accent | teal | `#5B9BA8` |
| Deep accent | burgundy | `#8B3A3A` |
| Warm accent | mustard | `#D4A24C` |
| Text & lines | charcoal/navy (near-black, slightly cool) | `#1F2937` |
| Decorative only | powder blue / blush pink | `#A9C7D0` / `#D98B94` |

**Feel:** dense and joyful in the decorative meadow band, but mid-minimalist
everywhere else — the blooms frame the page while the travel photos lead. The
cream background is what makes the saturated colors livable.
