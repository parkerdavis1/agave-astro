import rss from '@astrojs/rss';
import { filterDrafts } from '@utils/filterDrafts';
import getCombinedPosts from '@utils/getCombinedPosts';
import { metadata } from 'src/metadata.ts';
import { setDateTime } from '@utils/setDateTime';

export async function GET(context) {
    const posts = (await getCombinedPosts()).filter(filterDrafts);
    const items = posts.map((post) => {
        let link = post.bms
            ? post.data.slug
            : `${context.site}blog/${post.slug}`;

        return {
            title: post.data.title,
            // set date time to noon in AZ time
            pubDate: setDateTime(post.data.date, 12),
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
