import { db } from 'src/db';
import { User } from 'src/db/schema';
import { hash } from '@node-rs/argon2';
import { generateId } from 'src/auth';

export default async function seed() {
    await db.insert(User).values({
        id: generateId(),
        username: 'parker',
        password_hash: await hash('techno79', {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1,
        }),
    });
}

seed().catch(console.error);
