<template>
	<div class="flex flex-col items-center justify-center min-h-screen accent-splash">
		<img src="@/assets/images/logo.svg" alt="MyProperties Logo" class="mb-12" />
		<div v-show="!appStore.isShowMainLoader"
			class="w-auto max-w-md min-w-94 p-8 space-y-4 bg-primaryBg rounded shadow-md flex flex-col">
			<form @submit.prevent="handleLogin" class="space-y-4">
				<div>
					<label for="first_name" class="font-bold">{{
						$t('First Name')
					}}</label>
					<input id="first_name" v-model="first_name" type="text" :placeholder="$t('First Name')"
						class="w-full p-2 mt-2 border rounded" required />
				</div>
				<div>
					<label for="name" class="font-bold">{{
						$t('Last Name')
					}}</label>
					<input id="last_name" v-model="last_name" type="text" :placeholder="$t('Last Name')"
						class="w-full p-2 mt-2 border rounded" required />
				</div>
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
						Register
					</button>
				</div>
				
				<p class="mt-4 text-center">
					Already have an account?
					<router-link to="/login" class="text-blue-500 hover:underline">Login</router-link>
				</p>
			</form>
		</div>
	</div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
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

const first_name = ref('')
const last_name = ref('')
const email = ref('')
const password = ref('')

const handleLogin = async () => {
	appStore.isShowMainLoader = true
	try {
		const payload: Record<string, any> = {
			first_name: first_name.value,
			last_name: last_name.value,
			email: email.value,
			password: password.value
		}

		let response = await request.post('/register', payload);
		if (response.error || isEmpty(response.data)) {
			Signal.error(isEmpty(response.message) ? 'Registration failed!' : response.message);
			appStore.isShowMainLoader = false
			return;
		}

		//appStore.setToken(response.data.token)
		//appStore.setGuest('0')
		//appStore.setUser(response.data.user);
		Signal.success('Registration successful! Please login.')
		// Redirect to the intended route or fallback to /dashboard
		router.push('/login')

	} catch (error) {
		// No need to handle toast here for errors, as it's managed in the interceptor
		console.error('Registration failed', error)
		appStore.isShowMainLoader = false
	}
}
</script>
