import type { CollectionEntry } from 'astro:content';

export function filterDrafts(entry: CollectionEntry<'blog' | 'projects'>) {
    return import.meta.env.DEV || !entry.data.draft;
}
