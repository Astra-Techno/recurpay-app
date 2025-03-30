<template>
	<div class="flex items-center justify-center">
		<div class="loader"></div>
	</div>
</template>

<style scoped>
.loader {
	width: 50px;
	height: 50px;
	border: 6px solid #8C52FF; 
	border-top-color: var(--button-primary-text);
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
