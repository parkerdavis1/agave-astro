import { defineDb, defineTable, column, sql } from 'astro:db';

const QuailLikes = defineTable({
    columns: {
        path: column.text(),
        date_updated: column.date({ default: sql`(CURRENT_TIMESTAMP)` }),
    },
});

const Comments = defineTable({
    columns: {
        id: column.text({ primaryKey: true }),
        path: column.text(),
        author: column.text(),
        body: column.text(),
        fontColor: column.text({ default: 'currentColor' }),
        fontType: column.text({ default: 'sans' }),
        date: column.date({ default: sql`(CURRENT_TIMESTAMP)` }),
        reported: column.boolean({ default: false }),
        deleted: column.boolean({ default: false }),
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
    tables: { QuailLikes, User, Session, Comments },
});
