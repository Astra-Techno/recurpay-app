<!-- Loader.vue -->
<template>
	<div class="loader-container z-[19]" v-if="finalLoading">
		<div class="loader"></div>
	</div>
</template>

<script setup>
import { isLoading } from '@/composables/axios';
import { computed } from 'vue';

const props = defineProps({
	loading: {
		type: Boolean,
		default: null // Use null to detect when it's explicitly set
	}
});

// Determine which loading state to use
const finalLoading = computed(() => props.loading !== null ? props.loading : isLoading);
</script>


<style scoped>
.loader-container {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.loader {
	position: relative;
	width: 40px;
	height: 40px;
	border: 5px solid #8C52FF;
	border-radius: 50%;
	border-top-color: var(--button-primary-text);
	animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
