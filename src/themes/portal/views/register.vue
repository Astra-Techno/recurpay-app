<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-white px-4">
    <img src="@/assets/images/logo.png" alt="MyProperties Logo" class="mb-6 w-[180px]" />

    <div v-show="!appStore.isShowMainLoader" class="w-full max-w-sm">
      <!-- Title -->
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-[var(--general-text-heading)]">Create Your Account</h1>
        <p class="text-sm text-[var(--general-text-disclaimer)]">Start managing your properties</p>
      </div>

      <!-- Register Form -->
      <form @submit.prevent="handleRegister" class="space-y-4">
        <input
          id="first_name"
          v-model="first_name"
          type="text"
          placeholder="First Name"
          class="input"
          required
        />

        <input
          id="last_name"
          v-model="last_name"
          type="text"
          placeholder="Last Name"
          class="input"
          required
        />

        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="Email Address"
          class="input"
          required
        />

        <div class="flex rounded-md overflow-hidden border border-[var(--ui-outline)] bg-white">
          <select
            v-model="country_code"
            class="bg-gray-100 px-3 text-sm text-gray-700 border-r border-[var(--ui-outline)] focus:outline-none"
          >
            <option value="+91">🇮🇳 +91</option>
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+61">🇦🇺 +61</option>
            <option value="+971">🇦🇪 +971</option>
          </select>
          <input
            id="mobile"
            v-model="phone"
            type="tel"
            placeholder="Mobile Number"
            class="w-full px-4 py-2 text-sm bg-transparent focus:outline-none border-none"
            required
          />
        </div>

        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Password"
          class="input"
          required
        />

        <button
          type="submit"
          class="w-full bg-[var(--button-primary-background)] text-white py-3 rounded-md font-semibold hover:opacity-90 transition"
        >
          Register
        </button>

        <p class="text-center text-sm text-[var(--general-text-disclaimer)] mt-4">
          Already have an account?
          <router-link to="/login" class="text-[var(--general-text-link-unvisited)] font-medium hover:underline">
            Login
          </router-link>
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
.input {
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: #fff;
  border: 1px solid var(--ui-outline);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: var(--ui-text);
  outline: none;
}
.input::placeholder {
  color: #aaa;
}
</style>
