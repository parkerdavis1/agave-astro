import { defineDb, defineTable, column, sql } from 'astro:db';

const Likes = defineTable({
    columns: {
        path: column.text(),
        date_updated: column.date({ default: sql`(CURRENT_TIMESTAMP)` }),
    },
});

const User = defineTable({
    columns: {
        id: column.text({ primaryKey: true }),
        username: column.text(),
        password_hash: column.text(),
    },
});

const Session = defineTable({
    columns: {
        id: column.text({
            primaryKey: true,
        }),
        expiresAt: column.date(),
        userId: column.text({
            references: () => User.columns.id,
        }),
    },
});

// https://astro.build/db/config
export default defineDb({
    tables: { Likes, User, Session },
});
