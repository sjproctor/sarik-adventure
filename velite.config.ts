import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { defineConfig, defineCollection, s } from "velite";
import remarkBreaks from "remark-breaks";
import rehypeExternalLinks from "rehype-external-links";

// Open external links (anything with an absolute http(s) URL) in a new tab.
// Internal/relative links are left untouched. Applied to both the markdown
// frontmatter fields and the MDX body so links behave the same everywhere.
const externalLinks: [typeof rehypeExternalLinks, Record<string, unknown>] = [
  rehypeExternalLinks,
  {
    target: "_blank",
    rel: ["noopener", "noreferrer"],
    // Screen-reader-only hint appended inside each link, since target=_blank
    // gives assistive-tech users no other warning a new tab will open.
    // `sr-only` is emitted by Tailwind because layout.tsx's skip link uses it.
    content: {
      type: "element",
      tagName: "span",
      properties: { className: ["sr-only"] },
      children: [{ type: "text", value: " (opens in new tab)" }],
    },
  },
];

// Markdown frontmatter fields (summary, overview): compiled to an HTML string
// at build time so authors can use links and line breaks. `remark-breaks`
// turns single newlines into <br>, so a plain line break in YAML just works.
const md = () =>
  s.markdown({
    remarkPlugins: [remarkBreaks],
    rehypePlugins: [externalLinks],
  });

// A single gallery image. `src` points at a local file (relative to the MDX
// file); Velite copies it to /static with a content hash and returns
// { src, width, height, blurDataURL } for optimized rendering + blur-up.
const image = s.object({
  src: s.image(),
  alt: s.string(),
  caption: s.string().optional(),
  // Surface this photo in the home-page featured preview. For an album's first
  // photo (its cover) this features the album tile. When no photo on a location
  // is flagged, the preview falls back to the first few photos.
  featured: s.boolean().optional(),
});

// A titled, described set of photos shown below the lead row on a location
// page — e.g. "Up Dollar Mountain". `description` gives the album some context.
const album = s.object({
  title: s.string().max(120),
  date: s.isodate(),
  description: s.string().optional(),
  gallery: s.array(image).default([]),
});

const locations = defineCollection({
  name: "Location",
  pattern: "locations/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(120),
      slug: s.string(),
      region: s.string(),
      // "current" is the one place we are right now — only ever one location.
      // "recent" marks the quick stops since the last main destination; they
      // render in the home-page in-between row until they flip to "past".
      // "next" is upcoming.
      status: s.enum(["current", "recent", "next", "past"]).default("past"),
      // Interstitials are the short, quick-turnover stops between major
      // destinations. They share this collection and detail page but render
      // as compact "Short Stop" cards in the home-page timeline.
      kind: s.enum(["destination", "interstitial"]).default("destination"),
      order: s.number().default(0),
      cover: s.image(),
      coverAlt: s.string(),
      // The cover is cropped to fill its frame from the center, which can cut
      // off the subject. Set a CSS object-position to choose which part of the
      // photo stays in view — e.g. "center 30%" (favor the upper third),
      // "center top", "left center". First value is horizontal, second vertical.
      coverPosition: s.string().optional(),
      date: s.isodate(),
      stay: s.string(),
      // Area stats on the detail page. Optional — a quick interstitial stop
      // often has no meaningful numbers to show.
      population: s.string().optional(),
      elevation: s.string().optional(),
      summary: md(),
      overview: md(),
      // `gallery` is the lead row of photos; `albums` are the grouped sets
      // shown beneath it, each with its own title and description.
      gallery: s.array(image).default([]),
      // Optional reference sections, each rendered in its own block on the
      // location page. Authored as markdown (links + line breaks supported);
      // omit any a given location doesn't have.
      history: s
        .object({ showHistory: s.boolean().default(true), content: md() })
        .optional(),
      suggestions: s
        .object({ showSuggestions: s.boolean().default(true), content: md() })
        .optional(),

      albums: s.array(album).default([]),
      // Anything else authored in the MDX body, rendered on the location page
      // below the photo albums.
      body: s.mdx(),
    })
    .transform((data) => ({ ...data, permalink: `/locations/${data.slug}` })),
});

const musings = defineCollection({
  name: "Musing",
  pattern: "musings/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(120),
      slug: s.string(),
      date: s.isodate(),
      excerpt: s.string(),
      cover: s.image().optional(),
      coverAlt: s.string().optional(),
      // Tailwind aspect-ratio class for the cover on the musing page,
      // e.g. "aspect-[3/4]" for a portrait shot. Defaults to "aspect-video".
      aspect: s.string().optional(),
      body: s.mdx(),
    })
    // A cover without alt text renders as alt="" — invisible to screen readers.
    .refine((data) => !data.cover || !!data.coverAlt, {
      message: "coverAlt is required when cover is set",
      path: ["coverAlt"],
    })
    .transform((data) => ({ ...data, permalink: `/musings/${data.slug}` })),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { locations, musings },
  mdx: { rehypePlugins: [externalLinks] },
  // When an MDX file has a structural error (e.g. an unclosed tag), Velite
  // reports it in a yellow "issues" warning but still finishes the build,
  // silently dropping the entry — the page or block just stops rendering with
  // no obvious cause. Diff the .mdx files on disk against what actually
  // resolved and emit a loud console.error naming each dropped file. Runs on
  // every build and every dev watch rebuild.
  prepare({ locations, musings }) {
    const dropped: string[] = [];
    const checks = [
      ["locations", new Set(locations.map((e) => e.slug))],
      ["musings", new Set(musings.map((e) => e.slug))],
    ] as const;
    for (const [dir, resolved] of checks) {
      const base = join("content", dir);
      for (const file of readdirSync(base, { recursive: true })) {
        if (typeof file !== "string" || !file.endsWith(".mdx")) continue;
        const path = join(base, file);
        const slug = readFileSync(path, "utf8").match(
          /^slug:\s*["']?([^"'\r\n]+)/m
        )?.[1];
        if (!slug || !resolved.has(slug.trim())) dropped.push(path);
      }
    }
    if (dropped.length > 0) {
      console.error(
        `\n[content] ${dropped.length} MDX file(s) failed to compile and were` +
          ` EXCLUDED from the site — their pages/blocks will NOT render:\n` +
          dropped.map((f) => `  ✖ ${f}`).join("\n") +
          `\nSee the velite "issues" report above for the exact error and line number.\n`
      );
      // Fail `next build` so a broken file can't ship with its page missing.
      // Empty-but-valid files are fine — they resolve normally and never land
      // in `dropped`. In dev and the standalone `velite` CLI this only logs.
      if (process.argv.includes("build")) {
        throw new Error(
          `${dropped.length} MDX file(s) failed to compile: ${dropped.join(", ")}`
        );
      }
    }
  },
});
