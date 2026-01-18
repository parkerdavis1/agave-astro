export const prerender = false;

import { db, Comments, desc, eq, and } from 'astro:db';
import type { APIRoute } from 'astro';
import { delayDB } from '@utils/delayDB';

export const POST: APIRoute = async ({ request }) => {
    if (import.meta.env.DEV) {
        // simulate slow DB network in Dev mode
        await delayDB();
    }

    const commentId = await request.json();
    console.log('commentId', commentId);

    if (!commentId) {
        return new Response('No comment ID', { status: 400 });
    }

    // update comment to be reported in DB
    const [comment] = await db
        .update(Comments)
        .set({ reported: true })
        .where(eq(Comments.id, commentId))
        .returning();

    console.log('comment', comment);

    // trigger notification email (in production)
    if (import.meta.env.PROD || import.meta.env.SEND_EMAILS_IN_DEV === 'TRUE') {
        await fetch(
            'https://parkerdavis-reportcommentnotification.web.val.run',
            {
                method: 'POST',
                body: JSON.stringify(comment),
            },
        );
    }

    return new Response(JSON.stringify(comment), { status: 200 });
};

export const GET: APIRoute = async ({ request }) => {
    return new Response('hello from reportComment', {
        status: 200,
    });
};
