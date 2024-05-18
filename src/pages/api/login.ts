export const prerender = false;
import { lucia } from 'src/auth';
import { verify } from '@node-rs/argon2';
import { db, User, eq } from 'astro:db';

import type { APIContext } from 'astro';

// const usernameSchema = z.string().min(3).max(31)

export async function POST(context: APIContext): Promise<Response> {
    const formData = await context.request.formData();
    const username = formData.get('username');

    if (
        typeof username !== 'string' ||
        username.length < 3 ||
        username.length > 31 ||
        !/^[a-z0-9_-]+$/.test(username)
    ) {
        return new Response('Invalid username', {
            status: 400,
        });
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
        return new Response('Incorrect username or password', {
            status: 400,
        });
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    );

    return context.redirect('/likes');
}
