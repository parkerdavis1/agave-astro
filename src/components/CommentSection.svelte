<script>
    import { actions } from 'astro:actions';
    import { onMount } from 'svelte';
    import CommentCard from './CommentCard.svelte';
    export let url;

    let activeForm = true;
    let result;
    let comments;

    async function handleLeaveCommentClick() {
        activeForm = true;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        result = await actions.comment(formData);
        comments = await actions.getComments();
    }

    onMount(async () => {
        comments = await actions.getComments();
        console.log('comments', comments);
    });
</script>

<section>
    <h2 class="py-4">Comments</h2>
    {#if !activeForm}
        <button on:click={handleLeaveCommentClick}>Leave Comment</button>
    {:else}
        <form
            action=""
            class="py-5 flex flex-col gap-2"
            on:submit={handleSubmit}
        >
            <label for="author" class="flex flex-col"
                >Name

                <input type="text" name="author" autocomplete="off" />
            </label>
            <label for="body" class="flex flex-col"
                >Comment

                <textarea name="body" id="body"></textarea>
            </label>
            <input type="text" hidden name="path" value={url} />
            <button
                type="submit"
                class="dark:bg-[#0c151c] dark:hover:bg-[#040a0f] p-2"
                >Post</button
            >
        </form>
    {/if}
    <div>
        <pre>
            {JSON.stringify(result, null, 2)}
        </pre>
    </div>
    <div>
        {#if comments}
            {#each comments as comment (comment.id)}
                <CommentCard {comment} />
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
