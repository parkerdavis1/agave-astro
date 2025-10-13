import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';
import expressiveCode from 'astro-expressive-code';
import db from '@astrojs/db';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    site: 'https://parkerdavis.dev',
    integrations: [sitemap(), expressiveCode(), mdx(), svelte(), db()],
    adapter: netlify(),
    vite: {
        optimizeDeps: {
            exclude: ['astro:db'],
        },

        plugins: [tailwindcss()],
    },
});
