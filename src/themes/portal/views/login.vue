<template>
  <!-- 
    NOTE: For a true fintech experience, the logo should be an optimized SVG, not a PNG.
    This allows for crisp rendering on all devices, smaller file size, and the ability to style with CSS (e.g., for dark mode).
    The current `logo.svg` and `Logo_New.svg` in your assets are extremely complex and unoptimized. They should be redrawn.
  -->
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
    <div v-show="!showSplash" class="w-full max-w-sm login-form-animate">
      <!-- Logo -->
      <img src="@/assets/images/logo.png" alt="RecurPay Logo" class="mx-auto w-[180px] mb-6" />

      <!-- Welcome Message -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
        <p class="text-gray-600">{{ isOtpMode ? 'Enter the OTP sent to your number' : 'Sign in to your account' }}</p>
      </div>

      <!-- Dynamic Form Component -->
      <transition name="fade" mode="out-in">
        <LoginForm
          v-if="!isOtpMode"
          :is-loading="isLoading"
          v-model:credentials="credentials"
          :login-with-password="loginWithPassword"
        />
        <OtpForm
          v-else
          :is-loading="isLoading"
          v-model:credentials="credentials"
          :otp-sent="otpSent"
          :resend-timer="resendTimer"
          :send-OTP="sendOTP"
          :login-with-OTP="loginWithOTP"
        />
      </transition>

      <!-- Toggle Login Mode -->
      <div class="text-center mt-6">
        <a href="#" @click.prevent="toggleLoginMode" class="toggle-mode-link">
          {{ isOtpMode ? 'Login with Password instead' : 'Login with OTP instead' }}
        </a>
      </div>

      <!-- Register Link -->
      <p class="text-center text-sm text-gray-500 mt-8">
        {{ $t("Don't have an account?") }}
        <router-link to="/register" class="font-medium text-[var(--button-primary-background)] hover:underline">
          {{ $t('Register') }}
        </router-link>
      </p>

      <!-- Social Login -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            @click="loginWithGoogle"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <!-- NOTE: Assumes a global <Icon> component or a local BaseIcon -->
            <Icon name="Chrome" :size="20" /> 
            <span class="ml-2">Google</span>
          </button>

          <button
            type="button"
            @click="loginWithApple"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <Icon name="Apple" :size="20" />
            <span class="ml-2">Apple</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores'
import { useAuth } from '@/composables/useAuth'
import { useCurrentTitle } from '@/composables/use-meta'
import Signal from '@/composables/signal'
import LoginForm from '../components/LoginForm.vue'
import OtpForm from '../components/OtpForm.vue'

useCurrentTitle('Login - RecurPay')

const router = useRouter()
const appStore = useAppStore()
const { credentials, isOtpMode, isLoading, otpSent, resendTimer, toggleLoginMode, sendOTP, loginWithPassword, loginWithOTP } = useAuth()

const showSplash = ref(true)

const loginWithGoogle = async () => {
  try {
    // Implement Google OAuth login
    Signal.normal('Google login coming soon!')
  } catch (error) {
    Signal.error('Google login failed')
  }
}

const loginWithApple = async () => {
  try {
    // Implement Apple OAuth login
    Signal.normal('Apple login coming soon!')
  } catch (error) {
    Signal.error('Apple login failed')
  }
}

onMounted(() => {
  appStore.isShowMainLoader = false
  setTimeout(() => {
    showSplash.value = false
  }, 2500)
  if (appStore.user.token) {
    router.push('/dashboard')
  }
})
</script>

<style scoped>
/* Animation keyframes */
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

/* Splash screen animations */
.splash-animate {
  animation: slideInDown 0.8s ease-out;
}

.logo-animate {
  animation: bounceIn 1.2s ease-out 0.3s both;
}

/* Login form animations */
.login-form-animate {
  animation: riseFade 0.8s ease-out forwards;
  opacity: 1;
  transform: translateY(0);
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* NOTE: Most input/button styling is now handled by FormKit.
   You can create a `formkit.config.js` to theme it globally.
   The styles below are for elements outside the form. */
.resend-otp {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.resend-link {
  color: var(--button-primary-background, #3b82f6);
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
}

.resend-link:hover {
  color: #2563eb;
}

.resend-link:disabled {
  color: #9ca3af;
  cursor: not-allowed;
  text-decoration: none;
}

/* Toggle mode link */
.toggle-mode-link {
  color: var(--button-primary-background, #3b82f6);
  text-decoration: underline;
  font-size: 0.875rem;
}

.toggle-mode-link:hover {
  color: #2563eb;
}
</style>
