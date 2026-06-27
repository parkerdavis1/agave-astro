import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const QuailLikes = sqliteTable('QuailLikes', {
    path: text('path').notNull(),
    date_updated: text('date_updated').default(sql`(CURRENT_TIMESTAMP)`),
});

export const Comments = sqliteTable('Comments', {
    id: text('id').primaryKey(),
    path: text('path').notNull(),
    author: text('author').notNull(),
    body: text('body').notNull(),
    date: text('date').default(sql`(CURRENT_TIMESTAMP)`),
    reported: integer('reported', { mode: 'boolean' }).default(false),
    deleted: integer('deleted', { mode: 'boolean' }).default(false),
});

export const User = sqliteTable('User', {
    id: text('id').primaryKey(),
    username: text('username').notNull(),
    password_hash: text('password_hash').notNull(),
});

export const Session = sqliteTable('Session', {
    id: text('id').primaryKey(),
    expiresAt: text('expiresAt').notNull(),
    userId: text('userId')
        .notNull()
        .references(() => User.id),
});
