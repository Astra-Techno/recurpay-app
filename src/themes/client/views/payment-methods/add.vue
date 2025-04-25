<template>
    <div class="min-h-screen bg-gray-50 p-4 text-gray-800">

      <!-- Selection Cards -->
      <div class="space-y-4">
        <div
          class="flex items-center justify-between p-4 border rounded-xl bg-white shadow cursor-pointer hover:shadow-md"
          :class="{ 'ring-2 ring-blue-500': selectedType === 'bank' }"
          @click="selectedType = 'bank'"
        >
          <div class="flex items-center gap-3">
            <div class="text-2xl">🏦</div>
            <div class="font-semibold">Bank Account</div>
          </div>
          <div>
            <input type="radio" name="paymentType" value="bank" :checked="selectedType === 'bank'" />
          </div>
        </div>
  
        <div
          class="flex items-center justify-between p-4 border rounded-xl bg-white shadow cursor-pointer hover:shadow-md"
          :class="{ 'ring-2 ring-blue-500': selectedType === 'upi' }"
          @click="selectedType = 'upi'"
        >
          <div class="flex items-center gap-3">
            <div class="text-2xl">🏷️</div>
            <div class="font-semibold">UPI</div>
          </div>
          <div>
            <input type="radio" name="paymentType" value="upi" :checked="selectedType === 'upi'" />
          </div>
        </div>
      </div>
  
      <!-- Continue Button -->
      <div class="absolute bottom-[4rem] w-[92%] text-center">
        <button
          class="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold disabled:opacity-50"
          :disabled="!selectedType"
          @click="proceedToForm"
        >
          Continue
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, getCurrentInstance } from 'vue'
  import { useRouter } from 'vue-router'

getCurrentInstance().proxy.$setHeader('💳 Choose Account Type', '', true, '')
  
  const selectedType = ref('')
  const router = useRouter()
  
  function proceedToForm() {
    if (selectedType.value === 'bank') {
      router.push('/payment-methods/add-bank')
    } else if (selectedType.value === 'upi') {
      router.push('/payment-methods/add-upi')
    }
  }
  </script>
  
  <style scoped>
  </style>
  