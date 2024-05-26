import getCombinedPosts from '@utils/getCombinedPosts';
import { metadata } from 'src/metadata';
import { filterDrafts } from '@utils/filterDrafts';

function formatPostMetadataForJsonFeed(post) {
    const url = post.bms
        ? post.data.slug
        : `${import.meta.env.SITE}/blog/${post.slug}`;
    const formattedObject = {
        id: url,
        url: url,
        title: post.data.title,
        content_text: post.data.description,
        date_published: new Date(post.data.date),
    };
    return formattedObject;
}

export async function GET(context) {
    const posts = (await getCombinedPosts()).filter(filterDrafts);
    const formattedPosts = posts.map((post) =>
        formatPostMetadataForJsonFeed(post)
    );

    return new Response(
        JSON.stringify({
            version: 'https://jsonfeed.org/version/1.1',
            title: metadata.title,
            home_page_url: import.meta.env.SITE,
            feed_url: import.meta.env.SITE + '/feed/feed.json',
            items: formattedPosts,
        }),
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
}
