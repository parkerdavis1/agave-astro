import { SESSION_COOKIE_NAME, validateSession } from './auth';
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
    if (context.request.method !== 'GET') {
        const originHeader = context.request.headers.get('Origin');
        const hostHeader = context.request.headers.get('Host');
        if (
            !originHeader ||
            !hostHeader ||
            !verifyRequestOrigin(originHeader, [hostHeader])
        ) {
            return new Response(null, { status: 403 });
        }
    }

    const sessionId = context.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!sessionId) {
        context.locals.user = null;
        context.locals.session = null;
        return next();
    }

    const { session, user } = await validateSession(sessionId);

    if (session?.fresh) {
        context.cookies.set(SESSION_COOKIE_NAME, session.id, {
            httpOnly: true,
            secure: import.meta.env.PROD,
            sameSite: 'lax',
            expires: session.expiresAt,
            path: '/',
        });
    }

    if (!session) {
        context.cookies.set(SESSION_COOKIE_NAME, '', {
            httpOnly: true,
            secure: import.meta.env.PROD,
            sameSite: 'lax',
            maxAge: 0,
            path: '/',
        });
    }

    context.locals.session = session;
    context.locals.user = user;
    return next();
});

function verifyRequestOrigin(origin: string, allowedHosts: string[]): boolean {
    try {
        const originHost = new URL(origin).host;
        return allowedHosts.some((host) => host === originHost);
    } catch {
        return false;
    }
}
