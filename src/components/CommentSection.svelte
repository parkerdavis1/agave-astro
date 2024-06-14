<script>
    import { actions } from 'astro:actions';
    import { onMount } from 'svelte';
    import CommentCard from './CommentCard.svelte';
    import Spinner from './Spinner.svelte';
    import { fade, fly, slide, scale } from 'svelte/transition';

    export let url;

    let activeForm = false;
    // let result;
    let comments;
    let commentsHeading;
    let submitting = false;

    async function getComments() {
        // const data = await fetch(`/api/comments/getComments`, {
        //     method: 'POST',
        //     body: JSON.stringify(url),
        // });
        // const data = await fetch(`/api/comments/${encodeURIComponent(url)}`);
        const data = await fetch(
            `/api/comments/getComments?path=${encodeURIComponent(url)}`
        );
        return await data.json();
    }

    // Load comments on initialization
    onMount(async () => {
        // comments = await actions.getComments(url);
        comments = await getComments();
    });

    // form values
    let author = localStorage.getItem('author') || '';
    let body = '';

    function resetForm() {
        body = '';
        activeForm = false;
    }

    // Submit comment
    async function handleSubmit(e) {
        e.preventDefault();
        submitting = true;
        // capture form data to pass to action
        const formData = new FormData(e.target);
        const comment = {
            author: formData.get('author'),
            body: formData.get('body'),
            path: formData.get('path'),
        };

        // update name store
        localStorage.setItem('author', comment.author);

        // post comment
        // result = await actions.postComment(formData);
        const result = await fetch(`/api/comments/postComment`, {
            method: 'POST',
            body: JSON.stringify(comment),
        });
        if (!result.ok) {
            console.error('Error posting comment', result);
        }
        // reload comments
        // comments = await actions.getComments(url);
        comments = await getComments();

        // reset state
        resetForm();
        submitting = false;
    }

    function scrollIntoView() {
        setTimeout(() => {
            commentsHeading.scrollIntoView({
                block: 'start',
                inline: 'nearest',
            });
        }, 100);
    }
</script>

<section>
    <h2 class="py-4" bind:this={commentsHeading}>Comments</h2>

    <details class="cursor-pointer" bind:open={activeForm}>
        <summary on:click={scrollIntoView}>Leave a comment</summary>
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
                disabled={submitting}
            >
                {#if submitting}
                    <p class="flex items-center justify-center gap-4">
                        Post <Spinner />
                    </p>
                {:else}
                    Post
                {/if}
            </button>
        </form>
    </details>
    <div class="my-5">
        {#if comments}
            {#each comments as comment (comment.id)}
                <div in:fly={{ x: -200, duration: 200 }}>
                    <!-- <div in:scale> -->
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
        border: 1px solid #aaa;
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
