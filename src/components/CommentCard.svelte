<script>
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    export let comment;

    // const fontColor = comment.fontColor;
    // console.log('fontColor', fontColor);
    // const fontType = comment.fontType;

    const LOCAL_REPORTED_KEY = `reported-${comment.id}`;
    const LOCAL_HIDDEN_KEY = `hidden-${comment.id}`;

    let reported = comment.reported;
    let hidden = false;
    onMount(() => {
        hidden =
            Boolean(localStorage.getItem(LOCAL_HIDDEN_KEY)) ||
            Boolean(localStorage.getItem(LOCAL_REPORTED_KEY)) ||
            false;
        reported = Boolean(localStorage.getItem(LOCAL_REPORTED_KEY));
    });

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
</script>

<div class="comment-container">
    {#if hidden}
        <div>
            <p class="opacity-50">Comment hidden</p>
            <button class="text-xs" on:click={handleShow}>Show</button>
        </div>
    {:else}
        <div
            class="my-4 py-2 max-w-full {reported ? 'opacity-30' : ''}"
            in:fade
        >
            <!-- <pre>{JSON.stringify(comment, null, 2)}</pre> -->
            <p class="font-bold break-words">{comment.author}</p>
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
            <p
                class={`my-4 break-words whitespace-pre-wrap p-4 rounded font-mono`}
            >
                {comment.body}
            </p>

            <div class="flex gap-4 text-xs mt-2">
                <form on:submit={handleReport}>
                    {#if reported}
                        <button disabled>Reported</button>
                    {:else}
                        <button>Report</button>
                    {/if}
                </form>
                <button on:click={handleHide}>Hide</button>
            </div>
        </div>
    {/if}
</div>

<style>
    .comment-container {
        background: #fff;
        padding: 1rem;
        margin-block: 0.5rem;
    }
    @media (prefers-color-scheme: dark) {
        .comment-container {
            background: #202b38;
        }
    }
</style>
