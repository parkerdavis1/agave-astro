import { defineAction, z } from 'astro:actions';
import { db, Comments, desc, eq, and } from 'astro:db';
import { v4 as uuid } from 'uuid';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { delayDB } from '@utils/delayDB';
const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const server = {
    postComment: defineAction({
        accept: 'form',
        input: z.object({
            path: z.string(),
            author: z.string(),
            body: z.string(),
        }),
        handler: async (input) => {
            if (import.meta.env.DEV) {
                //simulate slow DB network in Dev mode
                await delayDB();
            }
            const purifiedInput = {
                author: purify.sanitize(input.author),
                body: purify.sanitize(input.body),
            };

            // insert comment in DB
            await db.insert(Comments).values({
                ...input,
                ...purifiedInput,
                id: uuid(),
            });

            // if in production, poke val.town to send an email notification
            if (import.meta.env.PROD) {
                fetch('https://parkerdavis-newcomment.web.val.run', {
                    method: 'POST',
                    body: JSON.stringify(input),
                });
            }
            return new Response('OK', { status: 200 });
        },
    }),

    getComments: defineAction({
        handler: async (path) => {
            if (import.meta.env.DEV) {
                //simulate slow DB network in Dev mode
                await delayDB();
            }
            return await db
                .select()
                .from(Comments)
                .where(
                    and(eq(Comments.path, path), eq(Comments.deleted, false))
                )
                .orderBy(desc(Comments.date));
        },
    }),

    reportComment: defineAction({
        input: z.string(),
        handler: async (id) => {
            if (import.meta.env.DEV) {
                //simulate slow DB network in Dev mode
                await delayDB();
            }
            const [comment] = await db
                .update(Comments)
                .set({ reported: true })
                .where(eq(Comments.id, id))
                .returning();
            console.log('commentfromserver', comment);
            return comment;
        },
    }),
};
