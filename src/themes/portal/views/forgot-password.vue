<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <img src="@/assets/images/logo.png" alt="RecurPay Logo" class="mx-auto w-32 mb-6" />
        <h2 class="text-3xl font-bold text-gray-900">Forgot Password</h2>
        <p class="mt-2 text-gray-600">Reset your password</p>
      </div>
      
      <div class="bg-white p-8 rounded-lg shadow-md">
        <p class="text-center text-gray-500">Forgot password page coming soon...</p>
        <div class="mt-6">
          <RouterLink to="/" class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors block text-center">
            Back to Login
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCurrentTitle } from '@/composables/use-meta'
useCurrentTitle('Forgot Password - RecurPay')
</script>