export const prerender = false;

import type { APIRoute } from 'astro';
import { db, Comments, eq } from 'astro:db';

export const POST: APIRoute = async ({ request }) => {
    const data = await request.formData();
    const commentId = data.get('commentId');
    const secret = data.get('secret');

    if (!commentId || !secret) return new Response('Error', { status: 500 });

    if (secret !== import.meta.env.DELETE_COMMENT_SECRET) {
        return new Response('Wrong secret', { status: 400 });
    }

    await db
        .update(Comments)
        .set({ deleted: true })
        .where(eq(Comments.id, commentId));

    return new Response('Successfully deleted comment', { status: 200 });
};
