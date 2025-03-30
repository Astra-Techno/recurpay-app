import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDeviceStore = defineStore('device', () => {
	const isMobile = ref(window.innerWidth <= 768)

	// Update `isMobile` on window resize
	window.addEventListener('resize', () => {
		isMobile.value = window.innerWidth <= 768
	})

	return { isMobile }
})
