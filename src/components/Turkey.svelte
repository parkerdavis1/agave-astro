<script lang="ts">
    import { onMount } from 'svelte';

    let turkey: HTMLDivElement;
    let turkeyContainer: HTMLDivElement;
    let gobble: Sprite;

    onMount(() => {
        gobble = new Sprite({
            src: '/assets/turkey/turkey-sprite.m4a',
            sprite: {
                a: [0, 1000],
                b: [1000, 1000],
                c: [2000, 1100],
            },
        });
        turkeyAdjust();
        window.addEventListener('resize', turkeyAdjust);
        return () => window.removeEventListener('resize', turkeyAdjust);
    });

    function turkeyAdjust() {
        const pixelsPerSecond = 30;
        const width = turkeyContainer.clientWidth;
        const seconds = width / pixelsPerSecond + 's';
        document.documentElement.style.setProperty(
            '--animation-duration',
            seconds
        );
    }

    function gobblegobble() {
        const sprites = ['a', 'b', 'c'];
        const randomSprite =
            sprites[Math.floor(Math.random() * sprites.length)];
        gobble.play(randomSprite);
    }

    export class Sprite {
        constructor(settingsObj) {
            this.src = settingsObj.src;
            this.samples = settingsObj.sprite;

            this.init();
        }

        async init() {
            // Set up web audio
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
            // Load file
            this.audioBuffer = await this.getFile();
        }
        async getFile() {
            // Request file
            const response = await fetch(this.src);
            if (!response.ok) {
                console.log(`${response.url} ${response.statusText}`);
                throw new Error(`${response.url} ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
            // console.log(audioBuffer);
            return audioBuffer;
        }

        play(sampleName) {
            const startTime = this.samples[sampleName][0] / 1000;
            const duration = this.samples[sampleName][1] / 1000;
            const sampleSource = this.ctx.createBufferSource();
            sampleSource.buffer = this.audioBuffer;
            sampleSource.connect(this.ctx.destination);
            sampleSource.start(this.ctx.currentTime, startTime, duration);
        }
    }
</script>

<div class="turkey-container" bind:this={turkeyContainer}>
    <div class="turkey" bind:this={turkey} on:click={gobblegobble}></div>
</div>

<style>
    :root {
        --turkey-width: 75px;
        --animation-duration: 30s;
    }

    .turkey-container {
        position: relative;
        height: var(--turkey-width);
        overflow: hidden;
        border-bottom: 1px dashed hsl(var(--borders) / 20%);
    }

    .turkey {
        background-image: url('/assets/turkey/turkey.png');
        height: var(--turkey-width);
        width: var(--turkey-width);
        background-position: bottom;
        background-repeat: no-repeat;
        background-size: cover;
        position: absolute;
        bottom: 0;
        left: calc(-1 * var(--turkey-width));
        animation-name: trot;
        animation-duration: var(--animation-duration);
        animation-direction: normal;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }

    .turkey:hover {
        cursor: pointer;
    }

    @keyframes trot {
        0% {
            left: calc(-2 * var(--turkey-width));
        }
        100% {
            left: 100%;
        }
    }

    @media (prefers-reduced-motion) {
        .turkey {
            animation: none;
        }
    }
</style>
