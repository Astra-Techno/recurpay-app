<template>
    <svg height="32" viewBox="0 0 1024 1024" width="32" xmlns="http://www.w3.org/2000/svg">
        <path :fill="fill" 
            d="m1024 512-192-192v-288h-128v160l-192-192-512 512v32h128v320h106v-386l272-302 294 310v378h96v-320h128zm-428.6 319.8c-16.6-2.6-17-48-17-48s49-48 59.6-112.6c28.8 0 46.4-68.6 17.8-92.8 1.2-25.4 36.8-199.6-143.8-199.6s-145 174.2-143.8 199.6c-28.6 24.2-11 92.8 17.6 92.8 10.6 64.6 59.6 112.6 59.6 112.6s-.4 45.4-17 48c-53.6 8.4-254 96.2-254 192.2h675c0-96-200.4-183.6-254-192.2z" />
    </svg>
</template>
<script setup>
defineProps({
    width: {
        type: [Number, String],
        default: 32
    },
    height: {
        type: [Number, String],
        default: 26
    },
    fill: {
        type: String,
        default: 'var(--ui-background)'
    }
})
</script>