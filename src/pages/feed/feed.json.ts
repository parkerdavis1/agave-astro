// export const prerender = false;

import getCombinedPosts from '@utils/getCombinedPosts';
import { metadata } from 'src/metadata';
import { filterDrafts } from '@utils/filterDrafts';
import { setDateTime } from '@utils/setDateTime';
import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;
type BMSPost = {
    bms: true;
    data: {
        date: Date;
        title: string;
        slug: string;
        description: string;
    };
};
type CombinedPost = BlogPost | BMSPost;

function isBMSPost(post: CombinedPost): post is BMSPost {
    return 'bms' in post && post.bms === true;
}

function formatPostMetadataForJsonFeed(post: CombinedPost) {
    const url = isBMSPost(post)
        ? post.data.slug
        : `${import.meta.env.SITE}/blog/${post.id}`;
    const formattedObject = {
        id: url,
        url: url,
        title: post.data.title,
        content_text: post.data.description,
        date_published: setDateTime(post.data.date),
    };
    return formattedObject;
}

export async function GET() {
    const posts = (await getCombinedPosts()).filter(filterDrafts);
    const formattedPosts = posts.map((post) =>
        formatPostMetadataForJsonFeed(post),
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
                'Cache-Control': 'no-cache',
            },
        },
    );
}
