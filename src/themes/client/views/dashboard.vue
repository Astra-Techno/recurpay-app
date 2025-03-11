<template>
    <div class="pt-5"> 
        <h1>Welcome to <b>{{ $t(store.theme)  }}</b> Portal</h1>
    </div>
</template>
<script lang="ts" setup>
    import { useAppStore } from '@/stores/index';
    import { useMeta } from '@/composables/use-meta';

    useMeta({ title: 'Dashboard' });
    const store = useAppStore();

</script>
