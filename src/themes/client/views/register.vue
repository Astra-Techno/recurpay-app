<template>
	<div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-blue-500 px-4">
	  <img src="@/assets/images/logo.png" alt="MyProperties Logo" class="mb-6 w-[180px] brightness-0 invert" />
  
	  <div v-show="!appStore.isShowMainLoader" class="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg">
		<!-- Title -->
		<div class="text-center mb-6">
		  <h1 class="text-2xl font-bold text-blue-600">Create Your Account</h1>
		  <p class="text-sm text-gray-500">Start managing your properties</p>
		</div>
  
		<!-- Register Form -->
		<form @submit.prevent="handleRegister" class="space-y-4">
		  <div>
			<label for="first_name" class="text-sm font-medium text-gray-700 block mb-1">First Name</label>
			<input id="first_name" v-model="first_name" type="text" class="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm" required />
		  </div>
  
		  <div>
			<label for="last_name" class="text-sm font-medium text-gray-700 block mb-1">Last Name</label>
			<input id="last_name" v-model="last_name" type="text" class="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm" required />
		  </div>
  
		  <div>
			<label for="email" class="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
			<input id="email" v-model="email" type="email" class="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm" required />
		  </div>

		  <div>
			<label for="mobile" class="text-sm font-medium text-gray-700 block mb-1">Mobile Number</label>
			<div class="flex rounded-lg overflow-hidden border border-gray-300 bg-gray-50">
				<select v-model="country_code" class="bg-gray-100 px-3 text-sm text-gray-700 border-r border-gray-300 focus:outline-none">
				<option value="+91">🇮🇳 +91</option>
				<option value="+1">🇺🇸 +1</option>
				<option value="+44">🇬🇧 +44</option>
				<option value="+61">🇦🇺 +61</option>
				<option value="+971">🇦🇪 +971</option>
				<!-- Add more as needed -->
				</select>
				<input id="mobile" v-model="phone" type="tel"
				class="w-full px-4 py-2 text-sm bg-transparent focus:outline-none bg-gray-50 border-none" required />
			</div>
		 </div>
  
		  <div>
			<label for="password" class="text-sm font-medium text-gray-700 block mb-1">Password</label>
			<input id="password" v-model="password" type="password" class="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm" required />
		  </div>
  
		  <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all">
			Register
		  </button>
  
		  <p class="text-center text-sm text-gray-500 mt-4">
			Already have an account?
			<router-link to="/login" class="text-blue-600 font-medium hover:underline">Login</router-link>
		  </p>
		</form>
	  </div>
	</div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAppStore } from '@/stores/index'
  import useApiRequest from '@/composables/request'
  import Signal from '@/composables/signal'
  import { isEmpty } from '@/composables/helper'
  
  const router = useRouter()
  const appStore = useAppStore()
  const request = useApiRequest()
  
  const first_name = ref('')
  const last_name = ref('')
  const email = ref('')
  const phone = ref('')
  const password = ref('')
  const country_code = ref('+91')
  
  const handleRegister = async () => {
	appStore.isShowMainLoader = true
  
	try {
	  const payload = {
		first_name: first_name.value,
		last_name: last_name.value,
		email: email.value,
		phone: `${country_code.value}${phone.value}`,
		password: password.value
	  }
  
	  const response = await request.post('/register', payload)
  
	  if (response.error) {
		Signal.error(isEmpty(response.message) ? 'Registration failed!' : response.message)
	  } else {
		Signal.success(response.message || 'Registration successful!')
		router.push('/login')
	  }
	} catch (error) {
	  console.error('Registration error:', error)
	} finally {
	  appStore.isShowMainLoader = false
	}
  }
  </script>
  
  <style scoped>
  input::placeholder {
	color: #aaa;
  }
  </style>
  