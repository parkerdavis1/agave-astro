<script>
    import { onMount } from 'svelte';
    import CommentCard from './CommentCard.svelte';
    import Spinner from './Spinner.svelte';
    import { fly } from 'svelte/transition';
    import { actions } from 'astro:actions';

    export let url;
    export let initComments;

    console.log(encodeURIComponent(url));

    const POST_COMMENT_ENDPOINT = '/api/comments/postComment';

    let comments = initComments;
    let activeForm = false;
    let commentsHeading;
    let submitting = false;
    let errorMessage;

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

    // USE ASTRO ACTION
    async function postCommentAction(e) {
        e.preventDefault();
        try {
            const timeoutId = setTimeout(() => {
                errorMessage = 'Error. Try again later.';
                throw new Error('Server timed out');
            }, 20000);

            submitting = true;
            // capture form data to pass to action
            const formData = new FormData(e.target);

            // const comment = {
            //     author: formData.get('author'),
            //     body: formData.get('body'),
            //     path: formData.get('path'),
            // };

            // console.log('comment', comment);

            // update name store
            // localStorage.setItem('author', comment.author);
            localStorage.setItem('author', formData.get('author'));

            // post comment

            // Form encoded endpoint (progressive enhancement)
            // const result = await fetch(POST_COMMENT_ENDPOINT, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/x-www-form-urlencoded',
            //     },
            //     body: new URLSearchParams({ ...comment }),
            // });

            // JSON endpoint
            // const result = await fetch(POST_COMMENT_ENDPOINT, {
            //     method: 'POST',
            //     body: JSON.stringify(formData),
            // });

            const result = await actions.postComment(formData);

            console.log('result', result);
            if (!result.ok) {
                console.error('Error posting comment', result);
            }

            clearInterval(timeoutId);
            // reload comments
            comments = await getComments();

            // reset state
            resetForm();
        } catch (e) {
            console.error('Error posting comment', e);
        }
    }

    // USE API ENDPOINT
    async function postCommentAPI(e) {
        e.preventDefault();
        try {
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
            };

            // update name store
            localStorage.setItem('author', formData.get('author'));

            // POST COMMENT

            // astro action
            const result = await actions.postComment(formData);

            // Form encoded endpoint (progressive enhancement)

            // const result = await fetch(POST_COMMENT_ENDPOINT, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/x-www-form-urlencoded',
            //     },
            //     body: new URLSearchParams({ ...comment }),
            // });

            // JSON endpoint

            // const result = await fetch(POST_COMMENT_ENDPOINT, {
            //     method: 'POST',
            //     body: JSON.stringify(formData),
            // });

            console.log('result', result);
            if (!result.ok) {
                console.error('Error posting comment', result);
            }

            clearInterval(timeoutId);
            // reload comments
            comments = await getComments();

            // reset state
            resetForm();
        } catch (e) {
            console.error('Error posting comment', e);
        }
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
            action={POST_COMMENT_ENDPOINT}
            method="POST"
            class="py-5 flex flex-col gap-2"
            on:submit={postCommentAPI}
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
                    required
                ></textarea>
            </label>
            <input type="text" hidden name="path" value={url} />
            <!-- value={encodeURIComponent(url)} -->

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
