export const prerender = false;

import type { APIRoute } from 'astro';
import { LikeCount, db, eq } from 'astro:db';

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

    let [countRow] = await db
        .select()
        .from(LikeCount)
        .where(eq(LikeCount.path, String(path)))
        .limit(1);

    if (!countRow) {
        [countRow] = await db
            .insert(LikeCount)
            .values({ path: path, count: 0 })
            .returning();
    }

    const count = countRow.count;

    return new Response(String(count));
};

export const POST: APIRoute = async ({ request }) => {
    if (import.meta.env.DEV) {
        //simulate slow DB network in Dev mode
        await delayDB();
    }
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);
    const path = params.get('path') as string;

    let [result] = await db
        .select()
        .from(LikeCount)
        .where(eq(LikeCount.path, path))
        .limit(1);

    if (!result) {
        [result] = await db
            .insert(LikeCount)
            .values({ path: path, count: 1 })
            .returning();
        if (!result) {
            return new Response('Error', { status: 500 });
        }
    }

    const count = result.count;

    const [response] = await db
        .update(LikeCount)
        .set({ count: count + 1 })
        .where(eq(LikeCount.path, path))
        .returning();

    if (!response) {
        return new Response('Error', { status: 500 });
    }

    return new Response('Good', { status: 200 });
};
