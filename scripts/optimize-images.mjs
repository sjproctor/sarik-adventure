// Prepare photos for publishing: strip ALL metadata (EXIF GPS coordinates,
// timestamps, device info) and cap dimensions at 2560px — the largest variant
// next/image generates (see images.deviceSizes in next.config.ts). Originals
// in public/static are served verbatim, so anything left in the file ships.
//
// Usage:
//   pnpm optimize-images              # process every image under content/
//   pnpm optimize-images <files...>   # process specific files
//
// Runs automatically on staged content/ images via .githooks/pre-commit.
// Idempotent: files that are already metadata-free and within the size cap
// are left untouched, so re-runs don't re-compress (no generational loss).
import { readdir, stat, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const MAX_DIM = 2560;
const JPEG_QUALITY = 80;
const IMAGE_EXT = /\.(jpe?g|png)$/i;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const fmt = (bytes) => (bytes / 1024 / 1024).toFixed(2) + "MB";

async function processImage(file) {
  const rel = path.relative(ROOT, file);
  const img = sharp(file, { failOn: "none" });
  const meta = await img.metadata();

  const hasMetadata = !!(meta.exif || meta.iptc || meta.xmp);
  const oversized = meta.width > MAX_DIM || meta.height > MAX_DIM;
  if (!hasMetadata && !oversized) {
    console.log(`${rel}: already clean, skipped`);
    return;
  }

  const resized = img
    .rotate() // bake in EXIF orientation before metadata is stripped
    .resize({
      width: MAX_DIM,
      height: MAX_DIM,
      fit: "inside",
      withoutEnlargement: true,
    });
  // sharp strips metadata by default; just pick the matching encoder.
  const buf = /\.png$/i.test(file)
    ? await resized.png({ compressionLevel: 9 }).toBuffer()
    : await resized.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();

  const before = (await stat(file)).size;
  const tmp = file + ".tmp";
  await writeFile(tmp, buf);
  await rename(tmp, file);
  console.log(`${rel}: ${fmt(before)} -> ${fmt(buf.length)}, metadata stripped`);
}

const args = process.argv.slice(2);
const files = [];
if (args.length > 0) {
  files.push(...args.map((f) => path.resolve(f)));
} else {
  for await (const f of walk(path.join(ROOT, "content"))) files.push(f);
}

for (const file of files) {
  if (!IMAGE_EXT.test(file)) continue; // ignore .mdx etc. from glob/hook input
  await processImage(file);
}
