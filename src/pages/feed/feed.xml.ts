import rss, { getRssString } from '@astrojs/rss';
import { filterDrafts } from '@utils/filterDrafts';
import getCombinedPosts from '@utils/getCombinedPosts';
import { metadata } from 'src/metadata.ts';
import { setDateTime } from '@utils/setDateTime';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
    const posts = (await getCombinedPosts()).filter(filterDrafts);
    const items = posts.map((post) => {
        let link = post.bms
            ? post.data.slug
            : `${context.site}blog/${post.slug}`;

        return {
            title: post.data.title,
            // set date time to noon in AZ time
            pubDate: new Date(setDateTime(post.data.date)),
            link,
            description: post.data.description,
        };
    });

    return rss({
        title: metadata.title,
        description: metadata.description,
        site: context.site || context.url.origin,
        items,
        stylesheet: '/rss/styles.xsl',
    });
}
