export const prerender = false;

import { db, Comments, desc, eq, and } from 'astro:db';
import type { APIRoute } from 'astro';
import { delayDB } from '@utils/delayDB';
import { v4 as uuid } from 'uuid';

// DOM Purify
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const POST: APIRoute = async ({ request }) => {
    if (import.meta.env.DEV) {
        // simulate slow DB network in Dev mode
        await delayDB();
    }

    const data = await request.json();
    console.log('post comment data', data);

    const { path, author, body } = data;
    // console.log('path', path);
    // console.log('author', author);
    // console.log('body', body);
    if (!path || !author || !body) {
        return new Response('Missing path, author, and/or body', {
            status: 420,
        });
    }
    const purifiedInput = {
        author: purify.sanitize(author),
        body: purify.sanitize(body),
    };

    // insert comment in DB
    const [postedComment] = await db
        .insert(Comments)
        .values({
            ...data,
            ...purifiedInput,
            id: uuid(),
        })
        .returning();

    console.log('postedComment', postedComment);

    // if in production, poke val.town to send an email notification
    if (import.meta.env.PROD) {
        fetch('https://parkerdavis-newcomment.web.val.run', {
            method: 'POST',
            body: JSON.stringify(postedComment),
        });
    }

    return new Response('OK', { status: 200 });
};

export const GET: APIRoute = async ({ request }) => {
    return new Response('hello', {
        status: 200,
    });
};
