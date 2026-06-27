import { db } from './db';
import { Session as SessionTable, User as UserTable } from './db/schema';
import { eq } from 'drizzle-orm';

export const SESSION_COOKIE_NAME = 'auth_session';
const SESSION_EXPIRES_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export interface Session {
    id: string;
    userId: string;
    expiresAt: Date;
    fresh: boolean;
}

export interface User {
    id: string;
    username: string;
}

export function generateId(bytes = 20): string {
    const arr = new Uint8Array(bytes);
    crypto.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function createSession(userId: string): Promise<Session> {
    const id = generateId();
    const expiresAt = new Date(Date.now() + SESSION_EXPIRES_MS);
    await db.insert(SessionTable).values({
        id,
        userId,
        expiresAt: expiresAt.toISOString(),
    });
    return { id, userId, expiresAt, fresh: false };
}

export async function validateSession(
    sessionId: string,
): Promise<{ session: Session | null; user: User | null }> {
    const [row] = await db
        .select({
            session: SessionTable,
            user: { id: UserTable.id, username: UserTable.username },
        })
        .from(SessionTable)
        .innerJoin(UserTable, eq(SessionTable.userId, UserTable.id))
        .where(eq(SessionTable.id, sessionId));

    if (!row) return { session: null, user: null };

    const expiresAt = new Date(row.session.expiresAt);
    const now = Date.now();

    if (now >= expiresAt.getTime()) {
        await db.delete(SessionTable).where(eq(SessionTable.id, sessionId));
        return { session: null, user: null };
    }

    let fresh = false;
    let finalExpiresAt = expiresAt;
    if (now >= expiresAt.getTime() - SESSION_EXPIRES_MS / 2) {
        finalExpiresAt = new Date(now + SESSION_EXPIRES_MS);
        await db
            .update(SessionTable)
            .set({ expiresAt: finalExpiresAt.toISOString() })
            .where(eq(SessionTable.id, sessionId));
        fresh = true;
    }

    return {
        session: {
            id: sessionId,
            userId: row.session.userId,
            expiresAt: finalExpiresAt,
            fresh,
        },
        user: row.user,
    };
}

export async function invalidateSession(sessionId: string): Promise<void> {
    await db.delete(SessionTable).where(eq(SessionTable.id, sessionId));
}
