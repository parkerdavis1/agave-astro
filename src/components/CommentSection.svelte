<script>
    import { actions } from 'astro:actions';
    import { onMount } from 'svelte';
    import CommentCard from './CommentCard.svelte';
    import { fade, fly, slide, scale } from 'svelte/transition';

    export let url;

    let activeForm = false;
    let result;
    let comments;

    // form values
    let author = localStorage.getItem('author') || '';
    let body = '';

    function resetForm() {
        body = '';
        activeForm = false;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        localStorage.setItem('author', formData.get('author'));
        result = await actions.comment(formData);
        comments = await actions.getComments(url);
        resetForm();
    }

    onMount(async () => {
        comments = await actions.getComments(url);
    });
</script>

<section>
    <h2 class="py-4">Comments</h2>

    <details class="cursor-pointer" bind:open={activeForm}>
        <summary>Leave a comment</summary>
        <form
            action=""
            class="py-5 flex flex-col gap-2"
            on:submit={handleSubmit}
        >
            <label for="author" class="flex flex-col"
                >Name

                <input
                    type="text"
                    name="author"
                    autocomplete="off"
                    bind:value={author}
                    required
                />
            </label>
            <label for="body" class="flex flex-col"
                >Comment

                <textarea name="body" id="body" bind:value={body} required
                ></textarea>
            </label>
            <input type="text" hidden name="path" value={url} />
            <button
                type="submit"
                class="dark:bg-[#0c151c] dark:hover:bg-[#040a0f] p-2"
                >Post</button
            >
        </form>
    </details>
    <div class="my-5">
        {#if comments}
            {#each comments as comment (comment.id)}
                <!-- <div in:fly={{ x: -200, duration: 400 }}> -->
                <div in:scale>
                    <CommentCard {comment} />
                </div>
            {/each}
        {/if}
    </div>
</section>

<style>
    button {
        background: #d0cfcf;
        padding: 0.5rem;
        border-radius: 6px;
    }

    input,
    textarea {
        padding: 0.5rem;
        border-radius: 6px;
        background: #fff;
    }

    input:focus,
    textarea:focus {
        outline: solid #0096bfab 2px;
    }

    @media (prefers-color-scheme: dark) {
        button {
            background: #0c151c;
        }
        button:hover {
            background: #040a0f;
        }

        input,
        textarea {
            background: #202b38;
        }
    }
</style>
