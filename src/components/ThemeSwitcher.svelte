<script lang="ts">
    type Theme = 'light' | 'dark' | 'auto';

    let theme = $state<Theme>('auto');
    let isOpen = $state(false);

    // Initialize theme from localStorage on mount
    $effect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
            theme = savedTheme;
        }
    });

    // Listen for system theme changes when in auto mode
    $effect(() => {
        if (theme === 'auto') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = () => applyTheme(theme);
            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        }
    });

    function applyTheme(newTheme: Theme) {
        const isDark = newTheme === 'dark' ||
            (newTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }

    function setTheme(newTheme: Theme) {
        theme = newTheme;
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
        isOpen = false;
    }

    function toggleDropdown() {
        isOpen = !isOpen;
    }

    function closeDropdown() {
        isOpen = false;
    }

    function getDisplayName(t: Theme): string {
        switch(t) {
            case 'light': return 'Light';
            case 'dark': return 'Dark';
            case 'auto': return 'Auto';
        }
    }

    // Close dropdown when clicking outside
    $effect(() => {
        if (isOpen) {
            const handleClick = (e: MouseEvent) => {
                const target = e.target as HTMLElement;
                if (!target.closest('.theme-switcher')) {
                    closeDropdown();
                }
            };
            document.addEventListener('click', handleClick);
            return () => document.removeEventListener('click', handleClick);
        }
    });
</script>

<div class="theme-switcher">
    <button
        class="theme-button"
        onclick={toggleDropdown}
        aria-label="Theme selector"
        aria-expanded={isOpen}
    >
        <!-- <span>Theme</span> -->
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-moon-icon lucide-sun-moon"><path d="M12 2v2"/><path d="M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715"/><path d="M16 12a4 4 0 0 0-4-4"/><path d="m19 5-1.256 1.256"/><path d="M20 12h2"/></svg>
    </button>

    {#if isOpen}
        <div class="dropdown">
            <button
                class:active={theme === 'light'}
                onclick={() => setTheme('light')}
            >
                <span>Light</span>
            </button>
            <button
                class:active={theme === 'dark'}
                onclick={() => setTheme('dark')}
            >
                <span>Dark</span>
            </button>
            <button
                class:active={theme === 'auto'}
                onclick={() => setTheme('auto')}
            >
                <span>Auto</span>
            </button>
        </div>
    {/if}
</div>

<style>
    .active {
        text-decoration: underline;
    }

    button {
        cursor: pointer;
    }

    .dropdown {
        display: flex;
        flex-direction: column;
    }
</style>
