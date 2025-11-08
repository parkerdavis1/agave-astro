export const prerender = false;

import getCombinedPosts from "@utils/getCombinedPosts";
import { metadata } from "src/metadata";
import { filterDrafts } from "@utils/filterDrafts";
import { setDateTime } from "@utils/setDateTime";
import type { CollectionEntry } from "astro:content";
import type { APIContext } from "astro";

type BlogPost = CollectionEntry<"blog">;
type BMSPost = {
    bms: true;
    data: {
        date: Date;
        title: string;
        slug: string;
        description: string;
    };
};
type CombinedPost = BlogPost | BMSPost;

function isBMSPost(post: CombinedPost): post is BMSPost {
    return "bms" in post && post.bms === true;
}

function formatPostMetadataForJsonFeed(post: CombinedPost) {
    const url = isBMSPost(post)
        ? post.data.slug
        : `${import.meta.env.SITE}/blog/${post.slug}`;
    const formattedObject = {
        id: url,
        url: url,
        title: post.data.title,
        content_text: post.data.description,
        date_published: setDateTime(post.data.date),
    };
    return formattedObject;
}

export async function GET(context: APIContext) {
    const posts = (await getCombinedPosts()).filter(filterDrafts);
    const formattedPosts = posts.map((post) =>
        formatPostMetadataForJsonFeed(post),
    );

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

    return new Response(
        JSON.stringify({
            version: "https://jsonfeed.org/version/1.1",
            title: metadata.title,
            home_page_url: import.meta.env.SITE,
            feed_url: import.meta.env.SITE + "/feed/feed.json",
            items: formattedPosts,
        }),
        {
            headers: {
                "Content-Type": "application/json",
            },
        },
    );
}
