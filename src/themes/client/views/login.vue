<template>
	<div class="flex flex-col items-center justify-center min-h-screen md:accent-splash">
		<img src="@/assets/images/logo.png" alt="MyProperties Logo" class="mb-6 w-[250px] brightness-0 invert" />
		<div v-show="!appStore.isShowMainLoader"
			class="w-auto max-w-md min-w-94 p-8 space-y-4 bg-primaryBg rounded shadow-md flex flex-col">
			<form @submit.prevent="handleLogin" class="space-y-4">
				<div>
					<label for="email" class="font-bold">{{
						$t('Email Address')
					}}</label>
					<input id="email" v-model="email" type="email" :placeholder="$t('Email Address')"
						class="w-full p-2 mt-2 border rounded" required />
				</div>
				<div>
					<label for="password" class="font-bold">{{
						$t('Password')
					}}</label>
					<input id="password" v-model="password" type="password" :placeholder="$t('Password')"
						class="w-full p-2 mt-2 border rounded" required />
				</div>

				<div class="w-full flex flex-col items-center justify-center">
					<button type="submit" class="my-6 px-6 py-2 text-white font-bold bg-primary rounded">
						Login
					</button>
				</div>
				
				<p class="mt-4 text-center">
					Don't have an account?
					<router-link to="/register" class="text-blue-500 hover:underline">Register</router-link>
				</p>
			</form>
		</div>
	</div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/index'
import { useRouter, useRoute } from 'vue-router'
import { useMeta } from '@/composables/use-meta'
import useApiRequest from '@/composables/request'
import Signal from '@/composables/signal'
import { isEmpty } from '@/composables/helper'

useMeta({ title: 'MyProperties Admin' })

const { VITE_PROJECT_BASE, VITE_API_BASE_URL } = import.meta.env;

const route = useRoute();
const router = useRouter()
const request = useApiRequest()
const appStore = useAppStore()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
	appStore.isShowMainLoader = true
	try {
		const payload: Record<string, any> = {
			email: email.value,
			password: password.value
		}

		let response = await request.post('/login', payload);
		if (response.error || isEmpty(response.data)) {
			Signal.error(isEmpty(response.message) ? 'Login failed!' : response.message);
			appStore.isShowMainLoader = false
			return;
		}

		appStore.setToken(response.data.token)
		appStore.setGuest('0')
		appStore.setUser(response.data.user);
		Signal.success('Logged in successfully')
		// Redirect to the intended route or fallback to /dashboard
		const redirectTo =
			typeof router.currentRoute.value.query.redirect === 'string'
				? router.currentRoute.value.query.redirect
				: '/dashboard'
		router.push(redirectTo)

	} catch (error) {
		// No need to handle toast here for errors, as it's managed in the interceptor
		console.error('Login failed', error)
		appStore.isShowMainLoader = false // Hide loader after login attempt
	}
}
</script>
