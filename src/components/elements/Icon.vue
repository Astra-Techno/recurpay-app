<script setup>
import { computed, defineAsyncComponent } from 'vue';
import * as lucideIcons from "lucide-vue-next";

const props = defineProps({
	name: {
		type: String,
		required: true
	},
	size: {
		type: [Number, String],
		default: 22
	},
	color: {
		type: String,
		default: 'currentColor'
	},
	strokeWidth: {
		type: [Number, String]
	},
	defaultClass: String
});

// Try to load Lucide icon first
const lucideIcon = lucideIcons[props.name];

// Dynamically import custom SVG icons if not found in Lucide
const customIcon = defineAsyncComponent(() =>
	import(`@/themes/${import.meta.env.VITE_PROJECT_BASE}/icons/${props.name}.vue`).catch(() => null)
);

// console.log(`/themes/${import.meta.env.VITE_PROJECT_BASE}/icons/${props.name}.vue`);

const iconComponent = computed(() => lucideIcon || customIcon);
</script>

<template>
	<component v-if="iconComponent" :is="iconComponent" :size="size" :color="color" stroke="currentColor"
		:stroke-width="strokeWidth" :default-class="defaultClass" />
</template>
