import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import db from '@astrojs/db';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://parkerdavis.dev',
    integrations: [tailwind(), db(), sitemap()],
    output: 'hybrid',
    adapter: netlify(),
});
