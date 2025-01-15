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
    headers: import.meta.env.PROD ? {
      "Content-Security-Policy": `
        default-src 'self' *.${import.meta.env.SITE_DOMAIN};
        script-src 'self' 'unsafe-inline' 'unsafe-eval' *.${import.meta.env.SITE_DOMAIN} https://accounts.google.com;
        style-src 'self' 'unsafe-inline' *.${import.meta.env.SITE_DOMAIN};
        img-src 'self' data: https: blob: *.${import.meta.env.SITE_DOMAIN} *.google.com *.googleapis.com;
        font-src 'self' https://fonts.googleapis.com data: *.${import.meta.env.SITE_DOMAIN};
        connect-src 'self' https://*.supabase.co wss://*.supabase.co *.${import.meta.env.SITE_DOMAIN} https://accounts.google.com;
        form-action 'self' https://*.supabase.co *.${import.meta.env.SITE_DOMAIN} https://accounts.google.com;
        frame-src 'self' https://accounts.google.com;
        frame-ancestors 'none';
      `.trim().replace(/\s+/g, " "),
    } : {},
  },
});