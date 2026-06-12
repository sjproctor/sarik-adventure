# Sarik's Adventures

A photo-forward travel site for a slow trip around the country — where we are,
where we're headed, and the thoughts in between. Content (locations and
musings) lives in the codebase as MDX and is published by pushing to git; there
is no CMS, database, or user auth.

## Tech stack

- **[Next.js 16](https://nextjs.org/)** (App Router) with **React 19**
- **TypeScript**
- **[Tailwind CSS 4](https://tailwindcss.com/)** for styling
- **[Velite](https://velite.js.org/)** — type-safe MDX content collections
- **[yet-another-react-lightbox](https://yet-another-react-lightbox.com/)** — full-screen photo viewing
- Fonts: Fraunces (display) + Nunito Sans (body) via `next/font`

## Getting started

Requires Node and **pnpm** (`packageManager: pnpm@9.15.0`).

```bash
pnpm install
pnpm dev          # start the dev server at http://localhost:3003
```

Other scripts:

```bash
pnpm build            # production build
pnpm start            # serve the production build
pnpm lint             # run ESLint (incl. jsx-a11y rules)
pnpm content          # run Velite once to build content collections
pnpm optimize-images  # strip metadata + downsize photos under content/
```

Velite runs automatically before `dev` and `build` (wired up in
[next.config.ts](next.config.ts)), so you normally don't need `pnpm content`
by hand.

### Adding photos

Photos are published verbatim, so a raw phone photo would ship its EXIF
metadata — including GPS coordinates. A pre-commit hook
([.githooks/pre-commit](.githooks/pre-commit)) automatically strips metadata
and downsizes any image staged under `content/`, via
[scripts/optimize-images.mjs](scripts/optimize-images.mjs). The hook is wired
up by `pnpm install` (the `prepare` script sets `core.hooksPath`); on a fresh
clone, just install before committing photos.

## Project structure

```
content/
  locations/      # one MDX file per place (current / next / past)
  musings/        # blog-style posts
src/
  app/
    page.tsx                  # home (hero + featured current + upcoming + musings)
    locations/                # list + [slug] detail pages
    musings/                  # list + [slug] detail pages
    layout.tsx                # root layout, fonts, footer, skip link
    globals.css
  components/     # Hero, Footer, FeaturedLocation, Gallery, LocationCard, MDXContent
  lib/
    site.ts       # site-wide constants (name, tagline, contact email, nav)
    content.ts    # helpers for querying/sorting locations & musings
velite.config.ts  # content schema + output config
next.config.ts    # image hosts + Velite build hook
```

## Adding content

New posts are added in the codebase and pushed to git.

### A location

1. Create a folder for the stop's photos next to the MDX file, e.g.
   `content/locations/sun-valley-id/`, and drop the image files in it.
2. Create `content/locations/<slug>.mdx` with frontmatter that references those
   photos by **relative path**:

```mdx
---
title: Sun Valley
slug: sun-valley-id
region: Idaho
status: current # current | next | past  (default: past)
order: 1 # sort order within a status group
date: 2026-05-01
stay: Mid May through June
summary: A one-line summary shown in lists.
cover: ./sun-valley-id/cover.jpg
coverAlt: Describe the cover image for screen readers.
gallery:
  - src: ./sun-valley-id/trailhead.jpg
    alt: Required alt text
    caption: Optional caption
---

Markdown/MDX body goes here.
```

Exactly one location should be marked `status: current` and one `status: next`
— these drive the highlighted spots on the home page.

### A musing

Create `content/musings/<slug>.mdx`:

```mdx
---
title: On Slowing Down
slug: on-slowing-down
date: 2026-05-10
excerpt: A short blurb for the list page.
cover: ./on-slowing-down/cover.jpg # optional, relative path
coverAlt: ... # optional
---

Body goes here.
```

The full schema for both collections is defined and validated in
[velite.config.ts](velite.config.ts).

## Pages & navigation

- **Home** (`/`) — hero, the **featured current location** (large, image-forward,
  with a masonry preview of its latest photos), the upcoming stops, and recent
  musings. Past locations are intentionally kept off the home page.
- **Locations** (`/locations`) — the full list of every stop (current → next →
  past); this is where visited places live.
- **Musings** (`/musings`) — blog-style posts.

There is no top header bar — site navigation (Home / Locations / Musings) and
the contact link live in the **footer**, rendered globally from
[layout.tsx](src/app/layout.tsx).

## Images

Photos are **local files committed to the repo**, colocated with the content
that uses them (e.g. `content/locations/<slug>/photo.jpg`) and referenced by
relative path in frontmatter.

At build time, Velite (`s.image()` in [velite.config.ts](velite.config.ts))
copies each photo into `public/static` with a content-hashed filename and
returns `{ src, width, height, blurDataURL }`. Components render them through
`next/image` with a `blurDataURL` placeholder, so images fade in from a blur
and are automatically resized/optimized. No image host or API key is required,
and `public/static` is git-ignored since it's regenerated on every build.

The current photos are placeholders — replace the files in each content folder
with your own (keep the filenames, or update the paths in frontmatter). Source
images can be any reasonable size; they're optimized on the way out. If a stop
ends up with many large photos and the repo feels heavy, consider
[Git LFS](https://git-lfs.com/).

## Accessibility

The site aims for **WCAG 2.1 AA**: semantic markup, a skip-to-content link,
required `alt` text on all images (enforced by the content schema), and the
`eslint-plugin-jsx-a11y` ruleset.

## Roadmap

- Email signup for new-location updates
- Photo likes/comments (private submissions; optionally surface like counts)
