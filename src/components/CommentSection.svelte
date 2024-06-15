<script>
    import { onMount } from 'svelte';
    import CommentCard from './CommentCard.svelte';
    import Spinner from './Spinner.svelte';
    import { fly } from 'svelte/transition';

    export let url;
    export let initComments;

    let comments = initComments;
    let activeForm = false;
    let commentsHeading;
    let submitting = false;
    let errorMessage;
    let textArea;

    async function getComments() {
        const data = await fetch(
            `/api/comments/getComments?path=${encodeURIComponent(url)}`
        );
        return await data.json();
    }

    // Load comments on initialization
    onMount(async () => {
        comments = await getComments();
        author = localStorage.getItem('author') || '';
    });

    // form values
    let author = '';
    let body = '';

    function resetForm() {
        body = '';
        activeForm = false;
        submitting = false;
        errorMessage = '';
    }

    // Submit comment
    async function postComment(e) {
        e.preventDefault();

        const timeoutId = setTimeout(() => {
            errorMessage = 'Error. Try again later.';
            throw new Error('Server timed out');
        }, 20000);

        submitting = true;
        // capture form data to pass to action
        const formData = new FormData(e.target);
        const comment = {
            author: formData.get('author'),
            body: formData.get('body'),
            path: formData.get('path'),
            fontColor: formData.get('fontColor'),
            fontType: formData.get('fontType'),
        };

        console.log('comment', comment);

        // update name store
        localStorage.setItem('author', comment.author);

        // post comment
        const result = await fetch(`/api/comments/postComment`, {
            method: 'POST',
            body: JSON.stringify(comment),
        });
        if (!result.ok) {
            console.error('Error posting comment', result);
        }

        clearInterval(timeoutId);
        // reload comments
        comments = await getComments();

        // reset state
        resetForm();
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
            on:submit={postComment}
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

                <textarea
                    name="body"
                    id="body"
                    class="font-mono"
                    bind:value={body}
                    bind:this={textArea}
                    required
                ></textarea>
            </label>
            <input type="text" hidden name="path" value={url} />
            <!-- <pre>Font color: {fontColor}</pre> -->
            <!-- <pre>Font type: {fontType}</pre> -->

            <!-- <details>
                <summary>Options</summary>
                <div class="flex gap-4 items-center pb-6">
                    <label for="fontColor" class="flex gap-2 items-center"
                        >Font Color

                        <input
                            type="color"
                            name="fontColor"
                            id="fontColor"
                            bind:value={fontColor}
                        />
                    </label>

                    <label for="font" class="flex gap-2 items-center"
                        >Font Type
                        <select
                            name="fontType"
                            id="fontType"
                            bind:value={fontType}
                        >
                            <option value="sans">Sans Serif</option>
                            <option value="serif">Serif</option>
                            <option value="mono">Mono</option>
                        </select>
                    </label>
                </div>
            </details> -->

            <button
                type="submit"
                class="p-2"
                disabled={submitting || errorMessage}
            >
                {#if errorMessage}
                    {errorMessage}
                {:else if submitting}
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
    .faded {
        color: var(--text-color-faded);
        font-size: 0.75em;
    }
    button {
        background: #d0cfcf;
        padding: 0.5rem;
        border-radius: 6px;
    }

    button:hover {
        background: #9b9b9b;
    }

    input[type='color'] {
        min-height: 40px;
        min-width: 40px;
    }

    input,
    textarea,
    select {
        padding: 0.5rem;
        border-radius: 6px;
        background: #fff;
        border: 1px solid #aaa;
    }

    input:focus,
    textarea:focus,
    select {
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
        textarea,
        select {
            background: #202b38;
        }
    }
</style>
