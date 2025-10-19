<script lang="ts">
    const { posts } = $props();
    const searchParams = new URLSearchParams(window.location.search);
    const slug = searchParams.get('slug');
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
        throw new Error('Post not found');
    }
</script>

<div class="p-16 card relative">
    <div class="text-zinc-800 z-10 relative text-box">
        <h1 class="text-2xl text-bold">{post.data.title}</h1>
        <h2>Parker Davis</h2>
    </div>
    <div class="image">
        <slot></slot>
    </div>
</div>

<style>
    @import 'tailwindcss';

    h2 {
        color: #838383;
    }

    .image {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 350px;
    }

    .card {
        height: 400px;
        width: 800px;
    }
</style>
