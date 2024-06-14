import { defineAction, z } from 'astro:actions';
import { db, Comments, desc, eq } from 'astro:db';
import { v4 as uuid } from 'uuid';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const server = {
    comment: defineAction({
        accept: 'form',
        input: z.object({
            path: z.string(),
            author: z.string(),
            body: z.string(),
        }),
        handler: async (input) => {
            const purifiedInput = {
                author: purify.sanitize(input.author),
                body: purify.sanitize(input.body),
            };
            console.log('input', input);
            console.log('purifiedInput', purifiedInput);

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
        },
    }),

    getComments: defineAction({
        handler: async (path) => {
            return await db
                .select()
                .from(Comments)
                .where(eq(Comments.path, path))
                .orderBy(desc(Comments.date));
        },
    }),

    reportComment: defineAction({
        handler: async ({ id }) => {},
    }),
};
