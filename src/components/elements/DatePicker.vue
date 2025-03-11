<template>
	<FormKit type="datepicker" v-bind="attrs.all" overlay popover />
</template>

<script setup>
import { useAttrs, computed } from 'vue';

const rawAttrs = useAttrs();

const defaultValues  = {
    'format' : "DD MMM YYYY",
    'value-format' : "YYYY-MM-DD"
};

let attrs = computed(() => {
    let { ...all } = rawAttrs;

    for (let key in defaultValues) {
        if (all[key] == null)
            all[key] = defaultValues[key];
    }

    return {  all };
})
</script>
