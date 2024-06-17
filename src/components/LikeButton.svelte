<script lang="ts">
    import { fade } from 'svelte/transition'
    import { onMount } from 'svelte'

    export let url: string
    export let initCount: number
    export let size: string = '3rem'

    const apiPath = `/api/likes?path=${url}`

    let likeButton: HTMLElement
    let liked = false
    let bounce: boolean
    let count = initCount || 0
    let previousCount: number

    onMount(async () => {
        liked = getLocalLiked()
        count = await getLikes()
    })

    async function getLikes() {
        const res = await fetch(apiPath)
        return await res.json()
    }

    function setLocalLiked(bool: boolean) {
        localStorage.setItem(url, String(bool))
        liked = bool
    }

    function getLocalLiked() {
        const liked = localStorage?.getItem(url) ?? false
        return Boolean(liked)
    }

    async function incrementDBLikes() {
        await fetch(apiPath, {
            method: 'POST',
        })
    }

    async function refreshCount() {
        const dbCount = await getLikes()
        if (dbCount > count) {
            count = dbCount
        }
    }

    function bounceQuail() {
        bounce = true
        setTimeout(() => {
            bounce = false
        }, 200)
        playSound()
    }

    async function click() {
        incrementDBLikes() // increment likes on DB
        // bounce = false; // reset animation
        previousCount = count
        count = count + 1 // update DOM optimistically
        setLocalLiked(true) // set liked color in local storage and update DOM
        bounceQuail()
        refreshCount() // if DB count is higher than local count, update visible count to that number
    }

    // AUDIO
    let audioCtx: AudioContext
    function randomNumber(min: number, max: number) {
        return min + Math.floor(Math.random() * max)
    }

    function playSound() {
        if (!audioCtx) {
            audioCtx = new AudioContext()
        }

        let gain = 0.1
        let oscType = 'sawtooth' as OscillatorType
        let length = 0.35
        // 350,980,840

        let freqs = {
            start: 350,
            mid: 980 + randomNumber(0, 100),
            end: 840,
        }

        const osc = new OscillatorNode(audioCtx, {
            type: oscType,
        })
        osc.frequency.setValueAtTime(freqs.start, audioCtx.currentTime)
        osc.frequency.linearRampToValueAtTime(
            freqs.mid,
            audioCtx.currentTime + length / 2
        )
        osc.frequency.linearRampToValueAtTime(
            freqs.end,
            audioCtx.currentTime + length
        )

        const gainNode = new GainNode(audioCtx)
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime)
        gainNode.gain.linearRampToValueAtTime(
            gain,
            audioCtx.currentTime + length / 2
        )
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + length)

        const filterNode = new BiquadFilterNode(audioCtx, {
            frequency: 1600,
            type: 'bandpass',
            Q: 1,
        })

        filterNode.frequency.setValueAtTime(
            freqs.start * 2,
            audioCtx.currentTime
        )
        filterNode.frequency.linearRampToValueAtTime(
            freqs.mid * 2,
            audioCtx.currentTime + length / 2
        )
        filterNode.frequency.linearRampToValueAtTime(
            freqs.end * 2,
            audioCtx.currentTime + length
        )

        osc.connect(gainNode).connect(filterNode).connect(audioCtx.destination)
        osc.start()
        osc.stop(audioCtx.currentTime + length)
    }
</script>

<div class="flex items-center justify-end mt-8 gap-4">
    <button
        class="quail {liked ? 'liked' : ''} {bounce ? 'bounce' : ''} "
        on:click={click}
        bind:this={likeButton}
        disabled={bounce}
        style="--size:{size}"
    >
        <!-- Quail Color Outline -->
        <svg
            width="1455"
            height="1121"
            viewBox="0 0 1455 1121"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g id="belly">
                <g id="Feet">
                    <path
                        id="Path"
                        fill="#302e2b"
                        fill-rule="evenodd"
                        stroke="#8d8d8d"
                        stroke-width="7"
                        d="M 580 939 L 589 954 L 557 998 L 505 1068 L 478 1087 L 420 1094 L 371 1094 L 357 1111 L 403 1121 L 420 1115 L 455 1116 L 533 1105 L 572 1099 L 557 1085 L 598 1005 L 652 932 L 572 932 L 580 939 Z"
                    />
                    <path
                        id="path1"
                        fill="#302e2b"
                        fill-rule="evenodd"
                        stroke="#8d8d8d"
                        stroke-width="7"
                        d="M 769 906 L 791 1035 L 724 1096 L 716 1106 L 744 1110 L 799 1068 L 814 1077 L 806 1098 L 806 1121 L 826 1107 L 843 1074 L 837 1035 L 838 1012 L 857 1009 L 870 1014 L 880 1003 L 897 1006 L 878 994 L 857 992 L 826 988 L 806 939 L 799 890 L 769 906 Z"
                    />
                </g>
                <path
                    id="path2"
                    fill="#4b1a0b"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 563 447 L 742 522 L 829 620 L 873 687 L 917 732 L 844 818 L 791 818 L 673 834 L 589 802 L 396 718 L 430 437 L 563 447 Z"
                />
                <path
                    id="path3"
                    fill="#ad957d"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 208 659 L 386 744 L 510 869 L 352 836 L 275 776 L 208 659 Z"
                />
                <path
                    id="path4"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 515 540 L 549 540 L 549 547 L 515 551 L 481 548 L 515 540 Z"
                />
                <path
                    id="path5"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 493 586 L 539 577 L 572 575 L 571 581 L 546 587 L 493 586 Z"
                />
                <path
                    id="path6"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 562 599 L 616 584 L 646 585 L 627 594 L 562 599 Z"
                />
                <path
                    id="path7"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 510 625 L 565 612 L 600 611 L 604 617 L 570 624 L 510 625 Z"
                />
                <path
                    id="path8"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 598 608 L 648 592 L 677 581 L 684 585 L 662 597 L 633 605 L 598 608 Z"
                />
                <path
                    id="path9"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 626 627 L 681 609 L 703 603 L 719 603 L 714 612 L 683 620 L 626 627 Z"
                />
                <path
                    id="path10"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 667 632 L 721 611 L 754 605 L 766 604 L 769 609 L 754 617 L 667 632 Z"
                />
                <path
                    id="path11"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 565 559 L 636 529 L 666 526 L 670 531 L 639 540 L 565 559 Z"
                />
                <path
                    id="path12"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 616 556 L 667 536 L 691 530 L 719 528 L 724 533 L 706 539 L 616 556 Z"
                />
                <path
                    id="path13"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 471 499 L 510 495 L 540 497 L 549 502 L 523 505 L 471 499 Z"
                />
                <path
                    id="path14"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 520 481 L 544 475 L 579 475 L 580 480 L 549 483 L 520 481 Z"
                />
                <path
                    id="path15"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 460 528 L 477 531 L 493 540 L 475 540 L 455 533 L 460 528 Z"
                />
                <path
                    id="path16"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 451 547 L 467 547 L 481 554 L 465 556 L 447 554 L 451 547 Z"
                />
                <path
                    id="path17"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 455 575 L 471 575 L 493 584 L 471 584 L 451 581 L 455 575 Z"
                />
                <path
                    id="path18"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 420 718 L 472 737 L 489 748 L 481 752 L 420 718 Z"
                />
                <path
                    id="path19"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 489 747 L 540 746 L 557 752 L 557 759 L 489 747 Z"
                />
                <path
                    id="path20"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 515 771 L 589 779 L 589 784 L 630 782 L 641 794 L 684 784 L 698 790 L 696 799 L 646 802 L 618 796 L 580 789 L 515 771 Z"
                />
                <path
                    id="path21"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 681 814 L 737 802 L 796 797 L 806 808 L 792 814 L 751 813 L 746 818 L 681 814 Z"
                />
                <path
                    id="path22"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 478 667 L 538 673 L 584 669 L 616 668 L 613 677 L 563 680 L 551 686 L 478 667 Z"
                />
                <path
                    id="path23"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 566 695 L 617 685 L 647 685 L 650 693 L 689 689 L 689 700 L 658 706 L 610 705 L 631 697 L 566 695 Z"
                />
                <path
                    id="path24"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 652 718 L 703 709 L 738 707 L 742 713 L 713 721 L 652 718 Z"
                />
                <path
                    id="path25"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 716 723 L 778 711 L 804 708 L 826 711 L 805 725 L 716 723 Z"
                />
                <path
                    id="path26"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 770 697 L 789 688 L 810 684 L 849 685 L 857 697 L 770 697 Z"
                />
                <path
                    id="path27"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 724 631 L 763 619 L 784 616 L 811 615 L 825 621 L 814 626 L 724 631 Z"
                />
                <path
                    id="path28"
                    fill="#d5e9e8"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 628 759 L 652 735 L 716 735 L 718 752 L 761 752 L 769 759 L 883 708 L 961 763 L 948 834 L 826 883 L 706 932 L 572 932 L 420 849 L 505 866 L 384 746 L 413 718 L 524 773 L 561.842102 789.847961 L 628 807 L 673 834 L 841 807 L 798 786 L 716 786 L 628 759 Z"
                />
                <path
                    id="path29"
                    fill="#0b0506"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 413 847 L 504 865 L 608 932 L 553 932 L 494 921 L 440 905 L 352 834 L 413 847 Z"
                />
            </g>
            <path
                id="body"
                fill="#8d8d8d"
                fill-rule="evenodd"
                stroke="none"
                d="M 343 162 L 378 189 L 425 241 L 517 291 L 672 323 L 827 400 L 927 464 L 1024 552 L 1082 633 L 1139 709 L 1262 788 L 1455 919 L 1383 884 L 1444 929 L 1383 899 L 1408 919 L 1376 905 L 1433 947 L 1289 880 L 1092 843 L 983 848 L 947 831 L 961 766 L 859 692 L 809 644 L 828 621 L 769 604 L 706 563 L 725 528 L 602 498 L 563 455 L 489 456 L 449 547 L 463 637 L 413 719 L 387 745 L 287 698 L 209 661 L 157 504 L 157 400 L 165 378 L 196 400 L 259 375 L 317 352 L 323 337 L 312 293 L 264 235 L 274 218 L 343 162 Z"
            />
            <g id="head">
                <path
                    id="path30"
                    fill="#080808"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 121 183 L 157 186 L 190 202 L 257 219 L 262 247 L 298 299 L 304 348 L 258 379 L 200 400 L 176 398 L 164 379 L 167 349 L 139 305 L 173 301 L 182 274 L 157 250 L 130 241 L 121 253 L 115 210 L 121 183 Z"
                />
                <path
                    id="path31"
                    fill="#fcfbf6"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 130 168 L 238 197 L 258 202 L 303 202 L 338 215 L 273 220 L 265 235 L 303 279 L 317 288 L 325 339 L 317 352 L 257 379 L 303 347 L 296 299 L 261 249 L 256 220 L 190 203 L 153 186 L 121 184 L 130 168 Z"
                />
                <path
                    id="path32"
                    fill="#130f0a"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 139 150 L 210 176 L 303 202 L 257 202 L 188 184 L 130 169"
                />
                <path
                    id="path33"
                    fill="#41291d"
                    fill-rule="evenodd"
                    stroke="#8d8d8d"
                    stroke-width="5"
                    d="M 157 135 L 143 150 L 109 102 L 76 88 L 56 93 L 22 118 L 5 112 L 3 61 L 0 36 L 32 2 L 55 0 L 79 11 L 115 52 L 139 96 L 157 135 Z"
                />
                <path
                    id="path34"
                    fill="#902f00"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 157 135 L 176 117 L 200 114 L 232 121 L 259 134 L 294 135 L 341 162 L 352 190 L 332 210 L 279 196 L 246 187 L 187 169 L 139 150"
                />
                <path
                    id="path35"
                    fill="#282828"
                    fill-rule="evenodd"
                    stroke="none"
                    d="M 121 251 L 109 274 L 102 301 L 105 313 L 121 304 C 121 304 134.634552 298.870361 139 303 C 139.484314 303.45813 139 305 139 305 L 174 303 L 183 274 L 159 249 L 130 241 L 121 251 Z"
                />
            </g>
        </svg>
    </button>
    {#await count}
        <div>{previousCount || ''}</div>
    {:then count}
        {#if count > 0}
            <div in:fade>{count}</div>
        {/if}
    {/await}
</div>

<style>
    button {
        --size: 3rem;
        /* --size: 4rem; */
    }
    svg {
        height: var(--size);
        width: var(--size);
    }

    .quail:not(.liked) path {
        fill: var(--text-color);
        stroke: var(--text-color);
        stroke-width: 5px;
        /* filter: grayscale(1); */
    }

    @media (prefers-color-scheme: dark) {
        .quail.liked path {
            filter: brightness(1.4);
        }
    }

    .quail.bounce {
        animation: bounce 200ms cubic-bezier(0.17, 0.67, 0.74, 1.92);
    }

    @keyframes bounce {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(calc(var(--size) / 12 * -1));
        }
    }
</style>
