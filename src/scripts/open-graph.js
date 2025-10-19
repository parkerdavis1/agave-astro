// borrowed heavily from https://www.emgoto.com/astro-social-card/

import fs from 'fs';
import { join } from 'path';
import puppeteer from 'puppeteer';

const CARD_WIDTH = 600;
const CARD_HEIGHT = 400;

const CONTENT_FOLDER = 'src/content/blog';
const OUTPUT_FOLDER = 'public/social-cards';

const BASE_URL = 'http://localhost:4321';
const TIMEOUT = 1000;

const LIMIT = 100;

async function timeoutFn(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const generateSocialCards = async (limit = LIMIT) => {
    const contentPath = join(process.cwd(), CONTENT_FOLDER);
    const outputPath = join(process.cwd(), OUTPUT_FOLDER);

    const postSlugs = fs
        .readdirSync(contentPath, { withFileTypes: true })
        .filter((path) => {
            const isMarkdownFile = (path) => /\.(md|mdx)$/i.test(path);
            return path.isDirectory()
                ? ['index.md', 'index.mdx'].some((file) =>
                      fs.existsSync(join(contentPath, path.name, file))
                  )
                : path.isFile() && isMarkdownFile(path.name);
        })
        .map((path) => path.name.replace(/\.(md|mdx)$/i, ''))
        .slice(0, limit);

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    console.log(`Found ${postSlugs.length} posts to process`);
    LIMIT &&
        console.log(
            `(Limited to ${LIMIT} posts. Remove LIMIT value to process all posts)`
        );

    for (const slug of postSlugs) {
        const outputFile = join(outputPath, `${slug}.png`);

        if (fs.existsSync(outputFile)) {
            console.log(`Skipping ${slug} - social card already exists`);
            continue;
        }

        const url = `${BASE_URL}/open-graph?slug=${slug}`;

        try {
            console.log(`Generating social card for ${slug}`);
            const page = await browser.newPage();
            await page.setViewport({
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                deviceScaleFactor: 2,
            });

            await page.goto(url);
            await timeoutFn(TIMEOUT);

            await page.screenshot({
                path: outputFile,
                clip: {
                    x: 0,
                    y: 0,
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                },
            });

            console.log(`Successfully generated social card for ${slug}`);
            await page.close();
        } catch (error) {
            console.error(`Failed to generate social card for ${slug}:`, error);
        }
    }

    await browser.close();
    console.log('Finished generating social cards');
};

generateSocialCards().catch(console.error);
