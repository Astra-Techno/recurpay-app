// src/stores/uiPreferences.js
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useUIPreferencesStore = defineStore('uiPreferences', () => {
	// Initialize the compact sidebar preference from localStorage
	const isMiniSidebar = ref(
		JSON.parse(localStorage.getItem('isMiniSidebar')) || false,
	)

	// Watch for changes to save to localStorage
	watch(isMiniSidebar, newVal => {
		localStorage.setItem('isMiniSidebar', JSON.stringify(newVal))
	})

	// Toggle sidebar mode
	const toggleMiniSidebar = () => {
		isMiniSidebar.value = !isMiniSidebar.value
	}

	return {
		isMiniSidebar,
		toggleMiniSidebar,
	}
})
