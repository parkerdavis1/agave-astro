import { defineConfig } from 'astro/config';
import db from '@astrojs/db';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import { transformerNotationDiff } from '@shikijs/transformers';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
    site: 'https://parkerdavis.dev',
    integrations: [db(), sitemap(), mdx(), tailwind(), svelte()],
    output: 'hybrid',
    adapter: netlify(),
    markdown: {
        shikiConfig: {
            transformers: [transformerNotationDiff()],
        },
    },
});
