import { defineDb, defineTable, column } from 'astro:db';

const LikeCount = defineTable({
    columns: {
        path: column.text(),
        count: column.number({ default: 10 }),
    },
});

// https://astro.build/db/config
export default defineDb({
    tables: { LikeCount },
});
