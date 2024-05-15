import { getCollection } from 'astro:content';
import { filterDrafts } from '@utils/filterDrafts';

export default async function getCombinedPosts() {
    const allPosts = await getCollection('blog', filterDrafts);

    // Birds make sound
    const response = await fetch('https://birdsmakesound.com/feed/feed.json');
    const { items } = await response.json();
    const formattedBMS = items.map((item) => ({
        bms: true,
        data: {
            date: new Date(item.date_published),
            title: item.title,
            slug: item.url,
        },
    }));

    const combinedPosts = [...allPosts, ...formattedBMS].sort(
        (a, b) => b.data.date.getTime() - a.data.date.getTime()
    );
    return combinedPosts;
    console.log(combinedPosts.map(post.data.title));
}
