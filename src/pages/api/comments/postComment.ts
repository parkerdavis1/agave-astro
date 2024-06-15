export const prerender = false;

import { db, Comments } from 'astro:db';
import type { APIRoute } from 'astro';
import { delayDB } from '@utils/delayDB';
import { v4 as uuid } from 'uuid';

interface Comment {
    author: string;
    body: string;
    path: string;
}

export const POST: APIRoute = async ({ request, redirect }) => {
    if (import.meta.env.DEV) {
        // simulate slow DB network in Dev mode
        await delayDB();
    }

    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    console.log('formData', formData);
    console.log('data', data);

    // const data = await request.json();

    console.log('data', data);
    // console.log('decode uri', decodeURIComponent(data.path));

    const { path, author, body } = data;
    if (!path || !author || !body) {
        return new Response('Missing path, author, and/or body', {
            status: 420,
        });
    }

    // insert comment in DB
    // const [postedComment] = await db
    //     .insert(Comments)
    //     .values({
    //         ...data,
    //         path: decodeURIComponent(data.path),
    //         // ...purifiedInput,
    //         id: uuid(),
    //     })
    //     .returning();

    // if in production, poke val.town to send an email notification
    // if (import.meta.env.PROD) {
    //     fetch('https://parkerdavis-newcomment.web.val.run', {
    //         method: 'POST',
    //         body: JSON.stringify(postedComment),
    //     });
    // }

    return new Response('OK', { status: 200 });
    // return redirect(decodeURIComponent(data.path), 301);
};

export const GET: APIRoute = async ({ request }) => {
    return new Response('hello', {
        status: 200,
    });
};
