import type { CollectionEntry } from 'astro:content';

export function filterDrafts(entry: CollectionEntry<'blog'>) {
    return !entry.data.draft;
}
