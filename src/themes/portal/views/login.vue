<style scoped>
input::placeholder {
  color: #aaa;
}

/* SPLASH ANIMATION */
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInDown {
  0% {
    transform: translateY(-50px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes riseFade {
  0% {
    transform: translateY(40px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.splash-animate {
  animation: bounceIn 1s ease forwards;
}

.logo-animate {
  animation: slideInDown 1s ease-out forwards;
}

.login-form-animate {
  animation: riseFade 0.8s ease-out 0.2s forwards;
  opacity: 0;
  transform: translateY(40px);
}

/* FORM FIELD ENTRANCE */
.form-field {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 0.5s ease forwards;
}

.form-field:nth-child(1) { animation-delay: 0.6s; }
.form-field:nth-child(2) { animation-delay: 0.7s; }
.form-field:nth-child(3) { animation-delay: 0.8s; }
.form-field:nth-child(4) { animation-delay: 0.9s; }
.form-field:nth-child(5) { animation-delay: 1s; }

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

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

<template>
  <div class="relative flex flex-col items-center justify-center min-h-screen bg-white px-4">
    <!-- Splash Screen -->
    <transition name="fade">
      <div v-if="showSplash" class="absolute inset-0 flex flex-col items-center justify-center bg-white z-50 splash-animate">
        <img src="@/assets/images/logo.png" alt="RecurPay Logo" class="w-[160px] mb-3 logo-animate" />
        <p class="text-base font-semibold text-[var(--button-primary-background)] tracking-wide text-center max-w-[280px] animate-pulse">
          One place to manage all your subscriptions & payments.
        </p>
      </div>
    </transition>

    <!-- Login Container -->
    <transition name="fade-slide">
      <div v-show="!showSplash && !appStore.isShowMainLoader" class="w-full max-w-sm login-form-animate">
        <!-- Logo -->
        <img src="@/assets/images/logo.png" alt="RecurPay Logo" class="mx-auto w-[180px] mb-4" />

        <!-- Sub-tagline -->
        <div class="text-center mb-6">
       
        
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <input
            id="email"
            v-model="email"
            type="text"
            :placeholder="$t('Email or Phone')"
            class="input"
            required
          />

          <div v-if="isOtpMode" class="form-field">
            <input
              id="otp"
              v-model="otp"
              type="text"
              :placeholder="$t('Enter OTP')"
              class="input"
            />
            <p class="text-xs text-gray-400 mt-1">OTP sent to your number</p>
          </div>

          <div v-else class="form-field">
            <input
              id="password"
              v-model="password"
              type="password"
              :placeholder="$t('Password')"
              class="input"
            />
            <div class="text-right mt-1">
              <router-link to="/forgot-password" class="text-sm hover:underline">
                {{ $t('Forgot Password?') }}
              </router-link>
            </div>
          </div>

          <button type="submit" class="form-field w-full bg-[var(--button-primary-background)] text-white py-3 rounded-full font-semibold hover:bg-[#003382] transition-shadow shadow-md">
            {{ $t('Sign In') }}
          </button>

          <div class="form-field text-center mt-2">
            <a href="#" @click.prevent="toggleLoginMode" class="text-sm font-medium hover:underline">
              {{ isOtpMode ? 'Login with Password instead' : 'Login with OTP instead' }}
            </a>
          </div>
        </form>

        <p class="form-field text-center text-sm text-gray-500 mt-6">
          {{ $t("Don't have an account?") }}
          <router-link to="/register" class="font-medium  hover:underline">
            {{ $t('Register') }}
          </router-link>
        </p>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/index'
import { useRouter, useRoute } from 'vue-router'
import useApiRequest from '@/composables/request'
import Signal from '@/composables/signal'
import { isEmpty } from '@/composables/helper'
import { useMeta } from '@/composables/use-meta'

useMeta({ title: 'RecurPay Login' })

const appStore = useAppStore()
const router = useRouter()
const route = useRoute()
const request = useApiRequest()

const showSplash = ref(true)

onMounted(() => {
  setTimeout(() => {
    showSplash.value = false
  }, 1800)
})

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

    const redirectTo = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
    router.push(redirectTo)
  } catch (error) {
    console.error('Login failed', error)
    appStore.isShowMainLoader = false
  }
}
</script>
