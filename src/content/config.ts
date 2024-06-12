import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        tags: z.array(z.string().optional()).optional(),
        draft: z.boolean().default(false),
    }),
});

const projectCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        tags: z.array(z.string().toLowerCase().optional()).optional(),
        techtags: z.array(z.string()).optional().nullable(),
        githubUrl: z.string().url().optional().nullable(),
        liveUrl: z.string().url().optional().nullable(),
        featured: z.boolean().default(false),
    }),
});

export const collections = {
    blog: blogCollection,
    projects: projectCollection,
};
