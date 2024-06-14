<script>
    import { actions } from 'astro:actions';
    import { fade, crossfade } from 'svelte/transition';
    export let comment;

    const LOCAL_REPORTED_KEY = `reported-${comment.id}`;
    const LOCAL_HIDDEN_KEY = `hidden-${comment.id}`;

    let reported = Boolean(localStorage.getItem(LOCAL_REPORTED_KEY));
    let hidden =
        Boolean(localStorage.getItem(LOCAL_HIDDEN_KEY)) ||
        Boolean(localStorage.getItem(LOCAL_REPORTED_KEY)) ||
        false;

    async function handleReport(e) {
        e.preventDefault();

        // set localstorage state
        localStorage.setItem(LOCAL_REPORTED_KEY, 'TRUE');
        reported = Boolean(localStorage.getItem(LOCAL_REPORTED_KEY));
        localStorage.setItem(LOCAL_HIDDEN_KEY, 'TRUE');
        hidden = Boolean(localStorage.getItem(LOCAL_HIDDEN_KEY));

        // do server action
        // const updatedComment = await actions.reportComment(comment.id);
        const updatedComment = await fetch(`/api/comments/reportComment`, {
            method: 'POST',
            body: JSON.stringify(comment.id),
        });
        console.log('Comment reported', updatedComment);
    }

    function handleShow() {
        localStorage.setItem(LOCAL_HIDDEN_KEY, '');
        hidden = Boolean(localStorage.getItem(LOCAL_HIDDEN_KEY));
    }

    function handleHide() {
        localStorage.setItem(LOCAL_HIDDEN_KEY, 'TRUE');
        hidden = Boolean(localStorage.getItem(LOCAL_HIDDEN_KEY));
    }

    async function handleDelete() {
        await fetch(
            `/api/comments/deleteComment?secret=ipBPPkb3D9-Yv6&commentId=${comment.id}`,
            { method: 'POST' }
        );
    }
</script>

{#if hidden}
    <div>
        <p class="opacity-50">Comment hidden</p>
        <button class="text-xs" on:click={handleShow}>Show</button>
    </div>
{:else}
    <div class="my-4 py-2 max-w-full {reported ? 'opacity-30' : ''}" in:fade>
        <p class="font-bold">{comment.author}</p>
        <time datetime={comment.date} class="text-sm"
            >{new Date(comment.date).toLocaleString('us-en', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            })}</time
        >
        <p class="break-words">{comment.body}</p>
        <div class="flex gap-4 text-xs mt-2">
            <form on:submit={handleReport}>
                {#if reported}
                    <button disabled>Reported</button>
                {:else}
                    <button>Report</button>
                {/if}
            </form>
            <button on:click={handleHide}>Hide</button>
            <button on:click={handleDelete}>Delete</button>
        </div>
    </div>
{/if}
