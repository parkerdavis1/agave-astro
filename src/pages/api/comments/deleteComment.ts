export const prerender = false;

import type { APIRoute } from 'astro';
import { db, Comments, eq } from 'astro:db';

export const POST: APIRoute = async ({ request }) => {
    const data = await request.formData();
    const commentId = data.get('commentId') as string;
    const secret = data.get('secret') as string;

    if (!commentId || !secret)
        return new Response('Missing query params', { status: 400 });

    if (secret !== import.meta.env.DELETE_COMMENT_SECRET) {
        return new Response('Error', { status: 400 });
    }

    const [comment] = await db
        .update(Comments)
        .set({ deleted: true })
        .where(eq(Comments.id, commentId))
        .returning();
    if (!comment) {
        return new Response(`Comment not found`, { status: 404 });
    }

    return new Response(
        'Successfully deleted comment ' + JSON.stringify(comment),
        { status: 200 },
    );
};
