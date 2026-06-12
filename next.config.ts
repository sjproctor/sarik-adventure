import type { NextConfig } from "next";

// Photos are local files processed by Velite (served from /static), so no
// image `remotePatterns` are needed. If you ever reference remotely-hosted
// images, add their hostname under `images.remotePatterns` here.
const nextConfig: NextConfig = {
  images: {
    // AVIF first (typically 30-50% smaller than WebP for these photos), with
    // WebP as the fallback for browsers that don't support AVIF.
    formats: ["image/avif", "image/webp"],
    // Cap generated variants at 2560px. The full-screen lightbox rarely
    // benefits from the default 3840px variant, which roughly doubles the
    // payload on large displays.
    deviceSizes: [640, 750, 1080, 1920, 2560],
  },
  // Baseline security headers applied to every route. These are safe for a
  // static content site and don't require per-request nonces.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Don't let browsers MIME-sniff responses into a different type.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Send the origin (not the full path) on cross-origin navigations.
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // We embed our own Google Maps iframes but are never meant to be
          // framed by others — block clickjacking.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Drop access to powerful APIs the site never uses.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Force HTTPS for two years (Vercel terminates TLS for us).
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  // A Content-Security-Policy is intentionally left off here. Next's App
  // Router injects inline bootstrap scripts, so a strict CSP needs per-request
  // nonces via middleware. The directives below are the ones this app would
  // need (Google Maps embed in frame-src, EmailJS in connect-src); enable via
  // middleware and TEST the contact form + maps before shipping:
  //   default-src 'self';
  //   img-src 'self' data:;
  //   style-src 'self' 'unsafe-inline';
  //   script-src 'self' 'nonce-<generated>';
  //   frame-src https://maps.google.com https://www.google.com;
  //   connect-src 'self' https://api.emailjs.com;
};

// Build the Velite content collections before Next compiles. Using an async
// config function (rather than top-level await) keeps next.config.ts loadable
// by Next 16's config transpiler. The guard prevents duplicate runs across
// Next's multiple config loads.
export default async function config(): Promise<NextConfig> {
  const isDev = process.argv.includes("dev");
  const isBuild = process.argv.includes("build");
  if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
    process.env.VELITE_STARTED = "1";
    const { build } = await import("velite");
    await build({ watch: isDev, clean: !isDev });
  }
  return nextConfig;
}
