<template>
	<div v-show="show"
		class="screen_loader fixed inset-0 bg-primary z-[60] flex flex-col items-center place-content-center">
		<img src="@/assets/images/logo.svg" alt="MyProperties Logo" class="mb-12" />
		<div class="loader m-5"></div>
	</div>
</template>
<script setup>
const { show } = defineProps({
	show: {
		type: Boolean,
		default: true,
	},
})
</script>
<style scoped>
.loader {
	width: 50px;
	height: 50px;
	border: 6px solid #ffffff;
	border-top-color: var(--accent-small-area-splash);
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
