import type { CollectionEntry } from 'astro:content';

export function filterDrafts(entry: CollectionEntry<'blog'>) {
    return import.meta.env.DEV || !entry.data.draft;
}
