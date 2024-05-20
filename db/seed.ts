import { db, User, LikeCount } from 'astro:db';
import { hash } from '@node-rs/argon2';
import { generateIdFromEntropySize } from 'lucia';

// https://astro.build/db/seed
export default async function seed() {
    await db.insert(User).values({
        id: generateIdFromEntropySize(10),
        username: import.meta.env.ADMIN_USERNAME,
        password_hash: await hash(import.meta.env.ADMIN_PASSWORD, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1,
        }),
    });
}
