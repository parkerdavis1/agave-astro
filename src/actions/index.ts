import { defineAction, z } from 'astro:actions';
import { db, Comments, desc } from 'astro:db';
import { v4 as uuid } from 'uuid';

export const server = {
    comment: defineAction({
        accept: 'form',
        input: z.object({
            path: z.string(),
            author: z.string(),
            body: z.string(),
        }),
        handler: async (input) => {
            // insert comment in DB
            await db.insert(Comments).values({ ...input, id: uuid() });
            // return comment;
            console.log('HELLO FROM SERVER ACTION!', input);
        },
    }),

    getComments: defineAction({
        handler: async () => {
            return await db
                .select()
                .from(Comments)
                .orderBy(desc(Comments.date));
        },
    }),
};
