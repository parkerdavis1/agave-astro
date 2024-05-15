<script>
    let animationDuration = 300;
    let likeButton;
    let liked;
    let bounce;
    let count = 0;
    let clickCount = 0;
    function click() {
        bounce = false;
        console.log('LIKED!');
        count++;
        clickCount++;
        liked = true;
        bounce = true;
        setTimeout(() => {
            bounce = false;
        }, animationDuration);
        playSound();
    }

    let audioCtx;
    function randomNumber(min, max) {
        return min + Math.floor(Math.random() * max);
    }

    function playSound() {
        if (!audioCtx) {
            audioCtx = new AudioContext();
        }

        let gain = 0.1;
        let oscType = 'triangle';

        const osc = new OscillatorNode(audioCtx, {
            type: oscType,
        });
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(
            300 + clickCount * 20,
            audioCtx.currentTime + 0.1
        );

        const gainNode = new GainNode(audioCtx);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(gain, audioCtx.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);

        osc.connect(gainNode).connect(audioCtx.destination);
        osc.start();
        setTimeout(() => osc.stop(), 1000);
    }
</script>

<div class="flex items-center mt-8 gap-4">
    <button
        class="heart {liked ? 'liked' : ''} {bounce ? 'bounce' : ''} "
        on:click={click}
        bind:this={likeButton}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            ><path
                fill="currentColor"
                d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812T2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.387 2.25t-1.363 2.412t-2.625 2.963T13.45 19.7z"
            /></svg
        >
    </button>
    <div>{count}</div>
</div>

<style>
    .heart {
        font-size: 5rem;
    }
    .heart.liked {
        color: red;
    }
    .heart.bounce {
        animation: bounce 300ms cubic-bezier(0.17, 0.67, 0.74, 1.92);
    }

    @keyframes bounce {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-5px);
        }
    }
</style>
