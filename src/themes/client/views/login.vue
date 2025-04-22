<template>	
	<div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-blue-500 px-4">
	  
  
	  <div v-show="!appStore.isShowMainLoader" class="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg">
		<!-- Title -->
		<div class="flex flex-row items-center text-center mb-6">
			<img src="@/assets/images/logo.png" alt="MyProperties Logo" class="mb-6 mx-auto w-[180px] brightness-0 invert-90" />
		  
		</div>
  
		<!-- Login Form -->
		<form @submit.prevent="handleLogin" class="space-y-4">
		  <!-- Common field -->
		  <div>
			<label for="email" class="text-sm font-medium text-gray-700 block mb-1">
			  {{ $t('Email or Phone') }}
			</label>
			<input
			  id="email"
			  v-model="email"
			  type="text"
			  :placeholder="$t('Email or Phone')"
			  class="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
			  required
			/>
		  </div>
  
		  <!-- OTP Login -->
		  <div v-show="isOtpMode">
			<label for="otp" class="text-sm font-medium text-gray-700 block mb-1">
			  {{ $t('OTP') }}
			</label>
			<input
			  id="otp"
			  v-model="otp"
			  type="text"
			  :placeholder="$t('Enter OTP')"
			  class="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<p class="text-xs text-gray-400 mt-1">OTP sent to your number</p>
		  </div>
  
		  <!-- Password Login -->
		  <div v-show="!isOtpMode">
			<label for="password" class="text-sm font-medium text-gray-700 block mb-1">
			  {{ $t('Password') }}
			</label>
			<input
			  id="password"
			  v-model="password"
			  type="password"
			  :placeholder="$t('Password')"
			  class="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<div class="text-right mt-1">
			  <router-link to="/forgot-password" class="text-sm text-blue-600 hover:underline">
				{{ $t('Forgot Password?') }}
			  </router-link>
			</div>
		  </div>
  
		  <!-- Submit -->
		  <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all">
			{{ $t('Login') }}
		  </button>
  
		  <!-- Toggle Button -->
		  <div class="text-center mt-2">
			<a href="#" @click="toggleLoginMode" class="text-[var(--general-text-link-unvisited)] font-medium hover:underline">
			  {{ isOtpMode ? 'Login with Password instead' : 'Login with OTP instead' }}
			</a>
		  </div>
  
		  <!-- Register -->
		  <p class="text-center text-sm text-gray-500 mt-4">
			{{ $t("Don't have an account?") }}
			<router-link to="/register" class="text-blue-600 font-medium hover:underline">
			  {{ $t('Register') }}
			</router-link>
		  </p>
		</form>
	  </div>
	</div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useAppStore } from '@/stores/index'
  import { useRouter, useRoute } from 'vue-router'
  import useApiRequest from '@/composables/request'
  import Signal from '@/composables/signal'
  import { isEmpty } from '@/composables/helper'
  import { useMeta } from '@/composables/use-meta'
  
  useMeta({ title: 'MyProperties Admin' })
  
  const appStore = useAppStore()
  const router = useRouter()
  const route = useRoute()
  const request = useApiRequest()
  
  const email = ref('')
  const password = ref('')
  const otp = ref('')
  const isOtpMode = ref(true)
  
  const toggleLoginMode = () => {
	isOtpMode.value = !isOtpMode.value
  }
  
  const handleLogin = async () => {
	appStore.isShowMainLoader = true
  
	try {
	  const payload: Record<string, any> = {
		email: email.value
	  }
  
	  if (isOtpMode.value) {
		payload.otp = otp.value
	  } else {
		payload.password = password.value
	  }
  
	  const response = await request.post('/login', payload)
	  if (response.error || isEmpty(response.data)) {
		Signal.error(isEmpty(response.message) ? 'Login failed!' : response.message)
		appStore.isShowMainLoader = false
		return
	  }
  
	  appStore.setToken(response.data.token)
	  appStore.setGuest('0')
	  appStore.setUser(response.data.user)
	  Signal.success('Logged in successfully')
  
	  const redirectTo = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
	  router.push(redirectTo)
	} catch (error) {
	  console.error('Login failed', error)
	  appStore.isShowMainLoader = false
	}
  }
  </script>
  
  <style scoped>
  input::placeholder {
	color: #aaa;
  }
  </style>
  