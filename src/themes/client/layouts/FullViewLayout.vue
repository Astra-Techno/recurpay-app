<template>
	<div>
		<div class="fixed bottom-6 ltr:right-6 rtl:left-6 z-50">
			<template v-if="showTopButton">
				<button type="button"
					class="btn btn-outline-primary rounded-full p-2 animate-pulse bg-[#fafafa] dark:bg-[#060818] dark:hover:bg-primary"
					@click="goToTop">
					<svg width="24" height="24" class="h-4 w-4" viewBox="0 0 24 24" fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd"
							d="M12 20.75C12.4142 20.75 12.75 20.4142 12.75 20L12.75 10.75L11.25 10.75L11.25 20C11.25 20.4142 11.5858 20.75 12 20.75Z"
							fill="currentColor" />
						<path
							d="M6.00002 10.75C5.69667 10.75 5.4232 10.5673 5.30711 10.287C5.19103 10.0068 5.25519 9.68417 5.46969 9.46967L11.4697 3.46967C11.6103 3.32902 11.8011 3.25 12 3.25C12.1989 3.25 12.3897 3.32902 12.5304 3.46967L18.5304 9.46967C18.7449 9.68417 18.809 10.0068 18.6929 10.287C18.5768 10.5673 18.3034 10.75 18 10.75L6.00002 10.75Z"
							fill="currentColor" />
					</svg>
				</button>
			</template>
		</div>
		<slot></slot>
		<div v-show="appStore.isShowMainLoader" class="fixed inset-0 top-24 flex items-center justify-center">
			<div class="loader"></div>
		</div>
	</div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/index'

const appStore = useAppStore()
const showTopButton = ref(false)
onMounted(() => {
	window.onscroll = () => {
		if (
			document.body.scrollTop > 50 ||
			document.documentElement.scrollTop > 50
		) {
			showTopButton.value = true
		} else {
			showTopButton.value = false
		}
	}
})

const goToTop = () => {
	document.body.scrollTop = 0
	document.documentElement.scrollTop = 0
}
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
