export const prerender = false;

import rss, { getRssString } from "@astrojs/rss";
import { filterDrafts } from "@utils/filterDrafts";
import getCombinedPosts from "@utils/getCombinedPosts";
import { metadata } from "src/metadata.ts";
import { setDateTime } from "@utils/setDateTime";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
    const posts = (await getCombinedPosts()).filter(filterDrafts);
    const items = posts.map((post) => {
        let link = post.bms
            ? post.data.slug
            : `${context.site}blog/${post.slug}`;

        return {
            title: post.data.title,
            // set date time to noon in AZ time
            pubDate: new Date(setDateTime(post.data.date)),
            link,
            description: post.data.description,
        };
    });

    // forward headers
    const userAgent = context.request.headers.get("user-agent") || "";
    const xff = context.request.headers.get("x-forwarded-for") || "";

    // send to Plausible
    fetch("https://plausible.parkerdavis.dev/api/event", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": userAgent,
            "X-Forwarded-For": xff,
        },
        body: JSON.stringify({
            domain: new URL(context.request.url).origin,
            name: "pageview",
            url: context.request.url,
        }),
    }).catch((e) => console.warn("plausible failed", e));

    const rssText = await getRssString({
        title: metadata.title,
        description: metadata.description,
        site: context.site || context.url.origin,
        items,
        stylesheet: "/rss/styles.xsl",
    });

    return new Response(rssText, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "no-cache",
        },
    });
}
