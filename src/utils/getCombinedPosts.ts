import { getCollection } from 'astro:content';
import { filterDrafts } from '@utils/filterDrafts';

interface BMSItem {
    id: string;
    url: string;
    title: string;
    content_html: string;
    date_published: string;
    description: string;
}

export default async function getCombinedPosts() {
    const allPosts = await getCollection('blog', filterDrafts);

    // Birds make sound
    const response = await fetch('https://birdsmakesound.com/feed/feed.json');
    const { items } = await response.json();
    const formattedBMS = items.map((item: BMSItem) => ({
        bms: true,
        data: {
            date: new Date(item.date_published),
            title: item.title,
            slug: item.url,
            description: item.description,
        },
    }));

    const combinedPosts = [...allPosts, ...formattedBMS].sort(
        (a, b) => b.data.date.getTime() - a.data.date.getTime()
    );
    return combinedPosts;
}
