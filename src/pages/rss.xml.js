import rss from '@astrojs/rss';
import { metadata } from 'src/metadata';

export function GET(context) {
    return rss({
        title: metadata.title,
        description: metadata.description,
        site: context.site,
        items: [],
    });
}
