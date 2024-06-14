import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import expressiveCode from 'astro-expressive-code';
import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
    site: 'https://parkerdavis.dev',
    integrations: [
        sitemap(),
        expressiveCode(),
        mdx(),
        tailwind(),
        svelte(),
        db(),
    ],
    output: 'hybrid',
    adapter: netlify(),
    vite: {
        optimizeDeps: {
            exclude: ['astro:db'],
        },
    },
    experimental: {
        actions: true,
    },
});
