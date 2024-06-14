export const prerender = false;

import type { APIRoute } from 'astro';
import { db, Comments, eq } from 'astro:db';

export const POST: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);
    const commentId = params.get('commentId');
    const secret = params.get('secret');

    if (!commentId || !secret) return new Response('Error', { status: 500 });

    if (secret !== import.meta.env.DELETE_COMMENT_SECRET) {
        return new Response('Wrong secret', { status: 400 });
    }

    await db
        .update(Comments)
        .set({ deleted: true })
        .where(eq(Comments.id, commentId));

    return new Response('Success', { status: 200 });
};
