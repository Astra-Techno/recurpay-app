<template>
    <div class="rating-wrap">
        <StarRating 
            v-if="context.ratingType === 'star'"
            v-bind="context.ratingProps"
            v-model="rating"
        />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import StarRating from './StarRating.vue';

const props = defineProps({
    context: Object
})

const rating = ref(props.context.value || 0);

watch(rating, (newVal, oldVal) => {
    (newVal !== oldVal) && props.context.node.input(newVal);
})
</script>