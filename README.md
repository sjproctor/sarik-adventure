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

### Prerequisites

- **Node 22** (see [.nvmrc](.nvmrc)) — with [nvm](https://github.com/nvm-sh/nvm),
  run `nvm use` in the project root, or `nvm install 22` the first time.
- **pnpm 9.15.0**, pinned via `packageManager`. Rather than installing pnpm
  globally, enable [Corepack](https://nodejs.org/api/corepack.html) once and it
  will use the pinned version automatically:

  ```bash
  corepack enable
  ```

```bash
pnpm install
pnpm dev          # start the dev server at http://localhost:3003
```

`pnpm install` also activates the repo's git hooks (the `prepare` script sets
`core.hooksPath` to [.githooks/](.githooks/)) — see
[Adding photos](#adding-photos) for why that matters.

For the contact form, copy [.env.example](.env.example) to `.env.local` and
fill in the EmailJS values (see the comments in that file). The site runs fine
without them; only the form's submit will fail.

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
   `content/locations/sun-valley-id/`, and drop the image files in it —
   straight off the phone is fine; the pre-commit hook strips metadata and
   resizes them (see [Adding photos](#adding-photos)).
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
relative path in frontmatter. They pass through three stages:

1. **Commit time** — a pre-commit hook normalizes any image staged under
   `content/` (see [Adding photos](#adding-photos) below).
2. **Build time** — Velite (`s.image()` in [velite.config.ts](velite.config.ts))
   copies each photo into `public/static` with a content-hashed filename and
   returns `{ src, width, height, blurDataURL }`. `public/static` is
   git-ignored since it's regenerated on every build.
3. **Request time** — components render through `next/image`, which serves
   resized AVIF/WebP variants with a blur-up placeholder. No image host or
   API key is required.

### Adding photos

Drop photos straight off the phone into the content folder and commit — no
manual prep needed. Because the files in `public/static` are served verbatim,
a raw photo would ship its EXIF metadata, **including GPS coordinates**. The
pre-commit hook ([.githooks/pre-commit](.githooks/pre-commit)) prevents that:
any image staged under `content/` is run through
[scripts/optimize-images.mjs](scripts/optimize-images.mjs), which

- strips **all** metadata (EXIF/GPS location, timestamps, device info),
- bakes in the EXIF orientation so photos still display right-side up,
- downsizes to at most 2560px (the largest variant `next/image` generates,
  per `images.deviceSizes` in [next.config.ts](next.config.ts)), re-encoding
  JPEGs at quality 80,

and re-stages the cleaned file. The script is idempotent — already-clean
images are skipped, so nothing gets recompressed twice.

Two things the hook does **not** cover:

- `git commit --no-verify` bypasses it — avoid that flag when committing photos.
- Images outside `content/` (e.g. a new graphic in `public/`) — clean those by
  hand with `pnpm optimize-images public/<file>`.

You can also run the optimizer over everything at any time:

```bash
pnpm optimize-images              # all images under content/
pnpm optimize-images <files...>   # specific files
```

## Deployment

Pushing to `main` triggers a Vercel deploy — that's the whole publishing
workflow. The `NEXT_PUBLIC_EMAILJS_*` variables from
[.env.example](.env.example) must also be set in the Vercel project settings
for the contact form to work in production. Baseline security headers (HSTS,
nosniff, frame and permissions policies) are applied to every route in
[next.config.ts](next.config.ts).

## Accessibility

The site aims for **WCAG 2.1 AA**: semantic markup, a skip-to-content link,
required `alt` text on all images (enforced by the content schema), and the
`eslint-plugin-jsx-a11y` ruleset.

## Roadmap

- Email signup for new-location updates
- Photo likes/comments (private submissions; optionally surface like counts)
