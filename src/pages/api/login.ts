export const prerender = false;

import { createSession, SESSION_COOKIE_NAME } from 'src/auth';
import { verify } from '@node-rs/argon2';
import { db } from 'src/db';
import { User } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import type { APIContext } from 'astro';

export async function POST(context: APIContext): Promise<Response> {
    const formData = await context.request.formData();
    const username = formData.get('username');

    if (
        typeof username !== 'string' ||
        username.length < 3 ||
        username.length > 31 ||
        !/^[a-z0-9_-]+$/.test(username)
    ) {
        return new Response('Invalid username', { status: 400 });
    }

    const password = formData.get('password');
    if (
        typeof password !== 'string' ||
        password.length < 6 ||
        password.length > 255
    ) {
        return new Response('Invalid Password', { status: 400 });
    }

    const [existingUser] = await db
        .select()
        .from(User)
        .where(eq(User.username, username));

    if (!existingUser) {
        return new Response('Incorrect username or password', { status: 400 });
    }

    const validPassword = await verify(existingUser.password_hash, password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
    });

    if (!validPassword) {
        return new Response('Incorrect username or password', { status: 400 });
    }

    const session = await createSession(existingUser.id);
    context.cookies.set(SESSION_COOKIE_NAME, session.id, {
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: 'lax',
        expires: session.expiresAt,
        path: '/',
    });

    return context.redirect('/likes');
}
