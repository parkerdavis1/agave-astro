<script>
    export let comment;
    console.log('comment', comment);
    let disabled;
    async function handleReport(e) {
        e.preventDefault();

        await fetch('https://parkerdavis-reportcomment.web.val.run', {
            method: 'POST',
            body: JSON.stringify(comment),
        });
        console.log('comment', comment);
    }
</script>

<div class="my-4 py-2 max-w-full">
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
    <form action="" on:submit={handleReport}>
        <button {disabled} class="text-sm">Report</button>
    </form>
</div>
