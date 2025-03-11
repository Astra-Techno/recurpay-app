<template>
    <div v-show="store.fullview == 0" class="dark:text-white-dark relative bottom-0 w-full text-center p-6 pt-0 mt-10">
         © Copyright Astra Techno Pty Ltd {{ new Date().getFullYear() }}.
    </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/stores/index';
const store = useAppStore();
</script>
