// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Update `site` to the production URL once the custom domain is connected.
  // It powers canonical URLs, sitemaps, and absolute social-share links.
  site: 'https://sarik-adventure.vercel.app',
  vite: {
    plugins: [tailwindcss()],
  },
});
