import type { APIRoute } from 'astro';

const robotsTxt = `
User-agent: *
Disallow: /

User-agent: Googlebot
User-agent: Bingbot
User-agent: Bravebot
User-agent: DuckDuckBot
User-agent: DuckDuckGo-Favicons-Bot
User-agent: Google Favicon
User-agent: kagibot
Disallow:

Sitemap: ${new URL('sitemap-index.xml', import.meta.env.SITE).href}
`.trim();

export const GET: APIRoute = () => {
    return new Response(robotsTxt, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
};
