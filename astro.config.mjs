// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [tailwind()],

  adapter: node({
    mode: "standalone",
  }),

  server: {
    headers: {
      "Content-Security-Policy": `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https: blob:;
        font-src 'self' 'https://fonts.googleapis.com';
        connect-src 'self' https://*.supabase.co wss://*.supabase.co;
        form-action 'self';
        frame-ancestors 'none';
      `
        .trim()
        .replace(/\s+/g, " "),
    },
  },
});