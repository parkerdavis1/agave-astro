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
    // HTML FORM DATA
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    console.log('formData', formData);
    console.log('data', data);

    // JSON DATA
    // const data = await request.json();
    // console.log('data', data);

    const { path, author, body } = data;
    if (!path || !author || !body) {
        return new Response('Missing path, author, and/or body', {
            status: 420,
        });
    }

    // insert comment in DB
    const [postedComment] = await db
        .insert(Comments)
        .values({
            ...data,
            path: decodeURIComponent(String(path)),
            id: uuid(),
        })
        .returning();

    // if in production, poke val.town to send an email notification
    if (import.meta.env.PROD) {
        fetch('https://parkerdavis-newcomment.web.val.run', {
            method: 'POST',
            body: JSON.stringify(postedComment),
        });
    }

    // return new Response('OK', { status: 200 });
    return redirect(decodeURIComponent(String(path)), 301);
};

export const GET: APIRoute = async ({ request }) => {
    return new Response('hello', {
        status: 200,
    });
};
