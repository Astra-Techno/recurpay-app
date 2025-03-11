<template>
    <div class="flex">
        <span  
            v-for="(star, index) in count" 
            :key="`star_${index}`"
            :class="['star-rating', (index < limit) && 'sel']"
            @click.stop="handleClick(index + 1)"
            @mousemove="handleMouseAction(star)"
            @mouseout="handleMouseAction()"
        >
            <div class="star-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
                    <path fill="currentColor" d="M11.41,8.41h0l1.14-.93,1.14-.93c.48-.39,.37-.74-.25-.77l-1.58-.09-2.5-.14-.41-1.05s0,0,0,0l-.53-1.38-.53-1.38c-.22-.58-.59-.58-.81,0l-1.07,2.75s0,0,0,0l-.41,1.05-2.5,.14-1.58,.09c-.62,.03-.73,.38-.25,.77l1.14,.93,1.14,.93h0l.87,.71-.57,2.15-.47,1.79c-.16,.6,.14,.81,.66,.48l2.48-1.6h0s.94-.61,.94-.61l.94,.61h0s1.24,.8,1.24,.8l1.24,.8c.52,.33,.82,.12,.66-.48l-.47-1.79-.57-2.15,.87-.71Z"></path>
                </svg>
            </div>
        </span>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    count: {
        type: Number,
        default: 5
    },
    disabled: {
        type: Boolean,
        default: false
    },
    modelValue: {
        type: Number,
        default: 0
    }
})  

const limit = ref(props.modelValue || 0);

const emit = defineEmits(['update:modelValue']);

const handleClick = val => {
    !props.disabled && emit('update:modelValue', val)
}

const handleMouseAction = (val = null) => {
    !props.disabled && (limit.value = (val === null) ? props.modelValue : val);
}
</script>

<style>
.star-rating {
    height: 25px;
    width: 25px;
    transition: all o.3s ease-in-out;
}
.star-icon {
    height: 100%;
}

.star-rating.sel {
    color: rgb(250 204 21 /1);
}
</style>