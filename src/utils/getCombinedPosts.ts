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

interface Bmsdata {
    bms: boolean;
    data: {
        date: Date;
        title: string;
        slug: string;
        description: string;
    };
}

export default async function getCombinedPosts() {
    const allPosts = await getCollection('blog', filterDrafts);
    const allTitles = allPosts.map((post) => post.data.title);

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

    const filteredBMS = formattedBMS.filter(
        ({ data }: Bmsdata) => !allTitles.includes(data.title)
    );

    const combinedPosts = [...allPosts, ...filteredBMS].sort(
        (a, b) => b.data.date.getTime() - a.data.date.getTime()
    );
    return combinedPosts;
}
