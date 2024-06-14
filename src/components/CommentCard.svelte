<script>
    import { fade } from 'svelte/transition';
    import { getContrastingColor } from '@utils/getContrastingColor';
    export let comment;

    // const fontColor = comment.fontColor;
    // console.log('fontColor', fontColor);
    // const fontType = comment.fontType;

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

    // function returnTailwindFont(fontType) {
    //     console.log('fonttype', fontType, typeof fontType);
    //     if (fontType === 'mono') {
    //         return 'font-mono';
    //     } else if (fontType === 'serif') {
    //         return 'font-serif';
    //     } else {
    //         return 'font-sans';
    //     }
    // }

    // function returnTailwindColor(color) {
    //     return `text-[${color}]`;
    // }

    // const contrastingColor = getContrastingColor(fontColor);
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
