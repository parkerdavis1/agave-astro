import type { APIRoute } from 'astro';
import { db, Comments, eq } from 'astro:db';

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);
    const commentId = params.get('commentId');
    const secret = params.get('secret');
    if (!commentId) return;
    if (!secret) return;

    if (secret !== import.meta.env.DELETE_COMMENT_SECRET) {
        return;
    }

    await db
        .update(Comments)
        .set({ deleted: true })
        .where(eq(Comments.id, commentId));
};
