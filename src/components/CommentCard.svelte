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
        actions.reportComment(comment.id);
        localStorage.setItem(LOCAL_REPORTED_KEY, 'TRUE');
        reported = Boolean(localStorage.getItem(LOCAL_REPORTED_KEY));
        localStorage.setItem(LOCAL_HIDDEN_KEY, 'TRUE');
        hidden = Boolean(localStorage.getItem(LOCAL_HIDDEN_KEY));

        await fetch('https://parkerdavis-reportcomment.web.val.run', {
            method: 'POST',
            body: JSON.stringify(comment),
        });
    }

    function handleShow() {
        localStorage.setItem(LOCAL_HIDDEN_KEY, '');
        hidden = Boolean(localStorage.getItem(LOCAL_HIDDEN_KEY));
        console.log('hidden', hidden);
        console.log(
            'local storage hidden',
            localStorage.getItem(LOCAL_HIDDEN_KEY)
        );
    }

    function handleHide() {
        localStorage.setItem(LOCAL_HIDDEN_KEY, 'TRUE');
        hidden = Boolean(localStorage.getItem(LOCAL_HIDDEN_KEY));
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
            <form action="" on:submit={handleReport}>
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
