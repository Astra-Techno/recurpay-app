<template>
    <div class="relative">
        <img
            :src="store.theme === 'dark' || store.isDarkMode ? '/assets/images/error/404-dark.svg' : '/assets/images/error/404-light.svg'"
            alt="404"
            class="mx-auto -mt-10 w-full max-w-xs object-cover md:-mt-14 md:max-w-xl"
        />
        <p class="mt-5 text-center text-base dark:text-white">The page you requested was not found!</p>
        <router-link to="/" class="btn btn-gradient mx-auto !mt-7 w-max border-0 uppercase shadow-none">Home</router-link>
    </div>
</template>
<script lang="ts" setup>
    import { useMeta } from '@/composables/use-meta';
    import { useAppStore } from '@/stores/index';
    const store = useAppStore();
    useMeta({ title: 'Error 404' });
</script>
