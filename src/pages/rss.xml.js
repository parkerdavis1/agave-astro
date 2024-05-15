import rss from '@astrojs/rss';
import getCombinedPosts from '@utils/getCombinedPosts';
import { metadata } from 'src/metadata';

export async function GET(context) {
    const posts = await getCombinedPosts();
    const items = posts.map((post) => {
        let link;
        let description;
        if (post.bms) {
            link = post.data.slug;
            description = `<a href="${link}">See Post</a>`;
        } else {
            link = `${context.site}blog/${post.slug}`;
            description = post.data.description;
        }

        return {
            title: post.data.title,
            pubDate: post.data.date,
            link,
            description,
        };
    });

    return rss({
        title: metadata.title,
        description: metadata.description,
        site: context.site,
        items,
    });
}
