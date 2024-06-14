<script>
    export let comment;
    console.log('comment', comment);
</script>

<div class="border-red-400 border m-2 p-2">
    <p>{comment.author}</p>
    <p>{comment.body}</p>
</div>
