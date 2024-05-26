import rss from '@astrojs/rss';
import { filterDrafts } from '@utils/filterDrafts';
import getCombinedPosts from '@utils/getCombinedPosts';
import { metadata } from 'src/metadata.ts';

export async function GET(context) {
    const posts = (await getCombinedPosts()).filter(filterDrafts);
    const items = posts.map((post) => {
        let link = post.bms
            ? post.data.slug
            : `${context.site}blog/${post.slug}`;

        return {
            title: post.data.title,
            pubDate: post.data.date,
            link,
            description: post.data.description,
        };
    });

    return rss({
        title: metadata.title,
        description: metadata.description,
        site: context.site,
        items,
    });
}
