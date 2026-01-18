/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                textColor: 'hsl(var(--text-color-values) / <alpha-value>)',
            },
            fontSize: {
                xs: 'var(--step--2)',
                sm: 'var(--step--1)',
                base: 'var(--step-0)',
                lg: 'var(--step-1)',
                xl: 'var(--step-2)',
                '2xl': 'var(--step-3)',
                '3xl': 'var(--step-4)',
                '4xl': 'var(--step-5)',
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
