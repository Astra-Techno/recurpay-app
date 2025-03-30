import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useAppStore } from '@/stores'
import useApiRequest from '@/composables/request'
import Signal from '@/composables/signal'

export const useExtendedStore = defineStore('extendedStore', () => {
	const appStore = useAppStore()
	const request = useApiRequest()

	// Reactive state
	const user = ref(JSON.parse(localStorage.getItem('user')) || {})
	const currentAccount = ref(
		JSON.parse(localStorage.getItem('currentAccount')) || {},
	)
	const loading = ref(false)

	// Logout
	function logout() {
		appStore.setUser(null)
		appStore.setToken(null)

		user.value = null
		localStorage.removeItem('user')

		currentAccount.value = null
		localStorage.removeItem('currentAccount')

		appStore.removeHeader('X-Admin-ID')
	}

	// Sync localStorage when state changes
	watch(
		user,
		newValue => {
			if (newValue) localStorage.setItem('user', JSON.stringify(newValue))
			else localStorage.removeItem('user')
		},
		{ deep: true },
	)

	return {
		user,
		loading,
		logout,
	}
})
