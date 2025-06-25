<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <div class="mx-auto h-32 w-32 text-blue-600 mb-8">
          <Icon name="AlertCircle" :size="128" />
        </div>
        <h2 class="text-6xl font-bold text-gray-900 mb-4">404</h2>
        <h3 class="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h3>
        <p class="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      
      <div class="space-y-4">
        <button
          @click="$router.back()"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Go Back
        </button>
        
        <RouterLink
          to="/dashboard"
          class="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Go to Dashboard
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCurrentTitle } from '@/composables/use-meta'

useCurrentTitle('Page Not Found - RecurPay')
</script>