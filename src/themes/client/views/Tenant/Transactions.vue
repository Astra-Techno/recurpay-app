<template>
    <div>
      <h2 class="text-lg font-semibold mb-4">All Transactions</h2>
      <ul class="space-y-3">
        <li v-for="tx in transactions" :key="tx.id" class="bg-white p-4 rounded-xl shadow text-sm">
          <div class="flex justify-between">
            <span class="font-medium">{{ tx.description }}</span>
            <span class="text-gray-700">₹{{ tx.amount }}</span>
          </div>
          <p class="text-xs text-gray-500 mt-1">{{ tx.date }}</p>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({ tenant: Object })
  
  const transactions = [
    { id: 1, description: 'March Rent', amount: 12000, date: '01 Mar 2024' },
    { id: 2, description: 'February Rent', amount: 12000, date: '01 Feb 2024' }
  ]
  </script>