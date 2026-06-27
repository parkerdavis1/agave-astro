export const prerender = false;

import { invalidateSession, SESSION_COOKIE_NAME } from 'src/auth';
import type { APIContext } from 'astro';

export async function POST(context: APIContext): Promise<Response> {
    if (!context.locals.session) {
        return new Response(null, { status: 401 });
    }
    await invalidateSession(context.locals.session.id);

    context.cookies.set(SESSION_COOKIE_NAME, '', {
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
    });

    return context.redirect('/login');
}
