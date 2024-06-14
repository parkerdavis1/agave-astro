export const prerender = false;

import type { APIRoute } from 'astro';
import { delayDB } from '@utils/delayDB';
import { db, Comments, desc, eq, and } from 'astro:db';
import { getCollection } from 'astro:content';

// export const POST: APIRoute = async ({ request }) => {
//     if (import.meta.env.DEV) {
//         // simulate slow DB network in Dev mode
//         await delayDB();
//     }
//     const path = await request.json();

//     const comments = await db
//         .select()
//         .from(Comments)
//         .where(and(eq(Comments.path, path), eq(Comments.deleted, false)))
//         .orderBy(desc(Comments.date));

//     return new Response(JSON.stringify(comments), { status: 200 });
// };

export const GET: APIRoute = async ({ request }) => {
    if (import.meta.env.DEV) {
        // simulate slow DB network in Dev mode
        await delayDB();
    }

    const url = new URL(request.url);
    const query = url.searchParams;
    const path = query.get('path');
    if (!path) return new Response('Need path', { status: 420 });

    const comments = await db
        .select()
        .from(Comments)
        .where(and(eq(Comments.path, path), eq(Comments.deleted, false)))
        .orderBy(desc(Comments.date));

    return new Response(JSON.stringify(comments), { status: 200 });
};

// export async function getStaticPaths() {
//     const paths = (await getCollection('blog')).map(
//         (post) => `/blog/${post.slug}`
//     );
//     console.log('static paths', paths);
//     return paths;
// }
