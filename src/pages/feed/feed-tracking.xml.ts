export const prerender = false;
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
    const feedRes = await fetch(`${context.url.origin}/feed/feed-static.xml`);
    const feedTxt = await feedRes.text();

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

    return new Response(feedTxt, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "no-cache",
        },
    });
}
