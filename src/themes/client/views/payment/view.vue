<template>
    <div class="min-h-screen bg-white text-gray-800">

  
      <!-- Payment Info Card -->
      <div class="bg-white mx-4  rounded-2xl shadow p-5">
        <div class="flex justify-between items-start sticky top-0 bg-white z-10">
          <div>
            <p class="text-3xl font-bold">₹15,000</p>
            <p class="text-sm text-gray-500">Due on May 5</p>
          </div>
          <span class="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">DUE</span>
        </div>
  
        <div class="mt-4 border-t pt-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium">Ram Kumar</p>
              <p class="text-xs text-gray-500">Frequency: Monthly</p>
              <p class="text-xs text-gray-500">Next Due Date: NA</p>
            </div>
          </div>
  
          <div class="mt-4">
            <h3 class="text-sm font-semibold mb-1">Notes</h3>
            <p class="text-sm text-gray-700">Payment for May rent</p>
          </div>
        </div>
  
        <!-- Action Buttons -->
        <div class="grid grid-cols-2 gap-3 mt-6">
          <button class="w-full py-2 bg-blue-100 text-blue-600 rounded-md font-medium text-sm flex items-center justify-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Mark as Paid
          </button>
          <button class="w-full py-2 bg-blue-100 text-blue-600 rounded-md font-medium text-sm flex items-center justify-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M22 2L11 13" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M2 22l11-11" />
            </svg>
            Send Reminder
          </button>
          <button class="w-full py-2 bg-gray-200 text-gray-800 rounded-md font-medium text-sm flex items-center justify-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Edit
          </button>
          <button class="w-full py-2 bg-gray-200 text-red-600 rounded-md font-medium text-sm flex items-center justify-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Delete
          </button>
        </div>
      </div>
  
      <!-- Payment History -->
      <div class="mt-6 px-4">
        <h2 class="text-sm font-semibold mb-2">Payment History</h2>
        <div class="bg-gray-100 rounded-xl p-4 flex justify-between items-center">
          <div>
            <p class="text-sm font-medium">April Rent</p>
            <p class="text-xs text-green-600 mt-1">Paid</p>
          </div>
          <p class="text-sm font-semibold">₹15,000</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // static demo
  </script>
  
  <style scoped>
  </style>
  