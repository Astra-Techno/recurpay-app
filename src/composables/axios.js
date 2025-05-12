import axios from 'axios'
import { useAppStore } from '@/stores'
//import router from "@/router/index";

import { ref } from 'vue'

const isLoading = ref(false)

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

const axiosClient = axios.create({
	baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
})

axiosClient.interceptors.request.use(
	config => {
		const appStore = useAppStore()
		isLoading.value = true
		config.headers.Authorization = `Bearer ${appStore.user.token}`
		config.headers['X-Site-Origin'] =
			`${import.meta.env.VITE_PROJECT_BASE || 'propertymanager'}`
		config.headers['X-User-TimeZone'] = userTimeZone
		config.headers['Accept'] = 'application/json'
		if (appStore.headers) {
			for (const key in appStore.headers) {
				config.headers[key] = appStore.headers[key]
			}
		}
		return config
	},
	error => {
		isLoading.value = false
		return Promise.reject(error)
	},
)

axiosClient.interceptors.response.use(
	response => {
		isLoading.value = false
		return response
	},
	error => {
		isLoading.value = false
		if (error.response != null && error.response.status === 401) {
			useAppStore().commit('setToken', null)
			//router.push({name: 'login'})
		} else if (error.response != null && error.response.status === 400) {
			if (
				error.response.data &&
				error.response.data.message == 'Unauthenticated.'
			) {
				useAppStore().setToken(null)
				window.location.href = '/'
			}
		}
		throw error
	},
)

export { axiosClient, isLoading }