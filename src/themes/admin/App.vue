<template>
    <div
        class="main-section antialiased relative font-RecurPay text-sm font-normal"
        :class="[store.sidebar ? 'toggle-sidebar' : '', store.menu, store.layout, store.rtlClass]"
    >
        <component v-bind:is="mainLayout"></component>
    </div>
</template>

<script  setup>
    import { computed } from 'vue';
    import defaultLayout from './layouts/default.vue';
    import fullLayout from './layouts/fullview.vue';
    import authLayout from './layouts/guest.vue';

    import { useMeta } from '@/composables/use-meta';
    import { useAppStore } from '@/stores/index';

    const store = useAppStore();


    // meta
    useMeta({ title: 'RecurPay' });
    const mainLayout = computed(() => {
        var layout = (store.mainLayout === 'auth' || store.user.token == null ? authLayout : ((store.fullview == 1) ? fullLayout: defaultLayout));
        return layout;
    });
</script>
