<template>
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-800">My Payments</h2>
      </div>
  
      <div class="bg-white p-4 rounded shadow">
        <div class="space-y-2">
          <div
            v-for="(payment, index) in payments"
            :key="index"
            class="border-b pb-2 last:border-b-0 last:pb-0"
          >
            <p class="text-sm font-medium text-gray-700">
              {{ formatCurrency(payment.amount) }} — {{ payment.type }}
            </p>
            <p class="text-xs text-gray-500">
              Paid on {{ formattedDate(payment.date) }} via {{ payment.method }}
            </p>
          </div>
        </div>
  
        <div v-if="payments.length === 0" class="text-sm text-gray-400">
          No payments found.
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import dayjs from 'dayjs'
  
  const payments = ref([
    {
      amount: 12000,
      type: 'Rent',
      date: '2024-12-05',
      method: 'UPI'
    },
    {
      amount: 5500,
      type: 'Maintenance',
      date: '2025-02-12',
      method: 'Bank Transfer'
    }
  ])
  
  function formatCurrency(amount, currency = 'INR', locale = 'en-IN') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount)
  }
  
  function formattedDate(date) {
    return dayjs(date).format('MMM DD, YYYY')
  }
  </script>
  