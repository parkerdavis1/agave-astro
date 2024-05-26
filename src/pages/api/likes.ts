export const prerender = false;

import type { APIRoute } from 'astro';
import { LikeCount, db, eq, count } from 'astro:db';

async function delayDB() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('go');
        }, 1000);
    });
}

export const GET: APIRoute = async ({ request }) => {
    if (import.meta.env.DEV) {
        //simulate slow DB network in Dev mode
        await delayDB();
    }
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);
    const path = params.get('path') as string;

    let [result] = await db
        .select({ count: count() })
        .from(LikeCount)
        .where(eq(LikeCount.path, String(path)));

    if (!result) {
        result = await db.insert(LikeCount).values({ path: path }).returning();
        if (!result) {
            return new Response('Error', { status: 500 });
        }
    }

    return new Response(String(result.count));
};

export const POST: APIRoute = async ({ request }) => {
    if (import.meta.env.DEV) {
        //simulate slow DB network in Dev mode
        await delayDB();
    }
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);
    const path = params.get('path') as string;

    const [result] = await db
        .insert(LikeCount)
        .values({ path: path })
        .returning();
    if (!result) {
        return new Response('Error', { status: 500 });
    }

    return new Response(null, { status: 200 });
};
