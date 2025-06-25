import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores'
import { useExtendedStore } from '@/themes/portal/stores/extendedStore'
import useApiRequest from '@/composables/request'
import Signal from '@/composables/signal'

export function useAuth() {
	const router = useRouter()
	const appStore = useAppStore()
	const extendedStore = useExtendedStore()
	const request = useApiRequest()

	// State
	const isOtpMode = ref(false)
	const isLoading = ref(false)
	const credentials = ref({
		email: '',
		password: '',
		otp: '',
	})
	const error = ref(null)
	const otpSent = ref(false)
	const resendTimer = ref(0)
	let resendInterval = null

	// Computed
	const otpValue = computed(() => credentials.value.otp || '')

	// Methods
	const clearError = () => {
		error.value = null
	}

	const toggleLoginMode = () => {
		isOtpMode.value = !isOtpMode.value
		clearError()
		resetOtpState()
	}

	const resetOtpState = () => {
		otpSent.value = false
		credentials.value.otp = ''
		resendTimer.value = 0
		if (resendInterval) {
			clearInterval(resendInterval)
			resendInterval = null
		}
	}

	const startResendTimer = () => {
		resendTimer.value = 30
		resendInterval = setInterval(() => {
			resendTimer.value--
			if (resendTimer.value <= 0) {
				clearInterval(resendInterval)
				resendInterval = null
			}
		}, 1000)
	}

	const sendOTP = async () => {
		clearError()
		isLoading.value = true
		try {
			// Replace with actual API call
			// await request.post('/api/auth/send-otp', { email: credentials.value.email });
			await new Promise(resolve => setTimeout(resolve, 1000))

			otpSent.value = true
			startResendTimer()
			Signal.success('An OTP has been sent to your device.')
		} catch (e) {
			error.value = e.response?.data?.message || 'Failed to send OTP. Please try again.'
			Signal.error(error.value)
		} finally {
			isLoading.value = false
		}
	}

	const loginWithPassword = async () => {
		clearError()
		isLoading.value = true
		try {
			// Replace with actual API call
			// const { data } = await request.post('/api/auth/login', credentials.value);
			await new Promise(resolve => setTimeout(resolve, 1500))
			const mockData = {
				user: { id: 1, name: 'Alex Johnson', email: credentials.value.email },
				token: 'mock-jwt-token-' + Date.now(),
			}

			appStore.setUser(mockData.user)
			appStore.setToken(mockData.token)
			extendedStore.user = mockData.user

			Signal.success('Login successful!')
			router.push('/dashboard')
		} catch (e) {
			error.value = e.response?.data?.message || 'Invalid credentials. Please try again.'
			Signal.error(error.value)
		} finally {
			isLoading.value = false
		}
	}

	const loginWithOTP = async () => {
		if (otpValue.value.length < 6) {
			error.value = 'Please enter the complete 6-digit OTP.'
			return
		}
		clearError()
		isLoading.value = true
		try {
			// Replace with actual API call
			// const { data } = await request.post('/api/auth/verify-otp', { email: credentials.value.email, otp: otpValue.value });
			await new Promise(resolve => setTimeout(resolve, 1500))
			const mockData = {
				user: { id: 1, name: 'Alex Johnson', email: credentials.value.email },
				token: 'mock-jwt-token-' + Date.now(),
			}

			appStore.setUser(mockData.user)
			appStore.setToken(mockData.token)
			extendedStore.user = mockData.user

			Signal.success('Login successful!')
			router.push('/dashboard')
		} catch (e) {
			error.value = e.response?.data?.message || 'Invalid OTP. Please try again.'
			Signal.error(error.value)
		} finally {
			isLoading.value = false
		}
	}

	onUnmounted(() => {
		if (resendInterval) {
			clearInterval(resendInterval)
		}
	})

	return {
		credentials,
		isOtpMode,
		isLoading,
		error,
		otpSent,
		resendTimer,
		toggleLoginMode,
		sendOTP,
		loginWithPassword,
		loginWithOTP,
	}
}