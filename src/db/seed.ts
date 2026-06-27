import { db } from 'src/db';
import { User } from 'src/db/schema';
import { hash } from '@node-rs/argon2';
import { generateId } from 'src/auth';

export default async function seed() {
    await db.insert(User).values({
        id: generateId(),
        username: process.env.ADMIN_USERNAME!,
        password_hash: await hash(process.env.ADMIN_PASSWORD!, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1,
        }),
    });
    console.log('Seeded admin user');
}

seed().catch(console.error);
