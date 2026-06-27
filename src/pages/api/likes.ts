export const prerender = false;

import type { APIRoute } from 'astro';
import { db } from 'src/db';
import { QuailLikes } from 'src/db/schema';
import { eq, count } from 'drizzle-orm';
import { delayDB } from '@utils/delayDB';

export const GET: APIRoute = async ({ request }) => {
    if (import.meta.env.DEV) {
        //simulate slow DB network in Dev mode
        await delayDB();
    }
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);
    const path = params.get('path') as string;

    let [result] = await db
        .select({ value: count() })
        .from(QuailLikes)
        .where(eq(QuailLikes.path, String(path)));

    if (!result) {
        const init = await db
            .insert(QuailLikes)
            .values({
                path: path,
            })
            .returning();
        if (!init) {
            return new Response('Error', { status: 500 });
        }
    }

    return new Response(String(result.value));
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
        .insert(QuailLikes)
        .values({ path: path })
        .returning();
    if (!result) {
        return new Response('Error', { status: 500 });
    }

    return new Response(null, { status: 200 });
};
