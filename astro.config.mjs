import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';
import expressiveCode from 'astro-expressive-code';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    site: 'https://parkerdavis.dev',
    integrations: [
        sitemap(),
        expressiveCode({
            themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
        }),
        mdx(),
        svelte(),
    ],
    adapter: netlify(),
    vite: {
        plugins: [tailwindcss()],
    },
});
