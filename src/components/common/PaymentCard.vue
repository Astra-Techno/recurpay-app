<template>
    <div class="rounded-xl p-4 border hover:bg-gray-50 transition space-y-2">
      <!-- Top: Payment Type and Amount -->
      <div class="flex justify-between items-center">
        <p class="text-sm font-bold text-gray-800">{{ getPaymentTypeLabel(payment.type) }}</p>
        <p class="text-sm font-bold text-gray-900">{{ formatCurrency(payment.amount) }}</p>
      </div>
  
      <!-- No Divider here anymore -->
  
      <!-- Bottom: Due Date and View Button in one line -->
      <div class="flex justify-between items-center pt-1">
        <p class="text-xs font-semibold"
           :class="isOverdue(payment.next_due_date) ? 'text-red-500' : 'text-blue-600'">
          Due: {{ formattedDate(payment.next_due_date) }}
        </p>
        
        <router-link :to="{ name: 'PaymentDetail', params: { id: payment.id } }">
          <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition">
            View
          </button>
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import dayjs from 'dayjs'
  
  defineProps({
    payment: Object
  })
  
  const paymentTypes = [
    { label: 'Rent', value: 'rent' },
    { label: 'Electricity Bill', value: 'electricity' },
    { label: 'Water Bill', value: 'water' },
    { label: 'Maintenance Fee', value: 'maintenance' },
    { label: 'Security Deposit', value: 'deposit' },
    { label: 'Other', value: 'other' }
  ]
  
  function getPaymentTypeLabel(type) {
    const found = paymentTypes.find(item => item.value === type)
    return found ? found.label : type
  }
  
  function formatCurrency(amount, currency = 'INR', locale = 'en-IN') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount)
  }
  
  function isOverdue(date) {
    const today = new Date().setHours(0, 0, 0, 0)
    const dueDate = new Date(date).setHours(0, 0, 0, 0)
    return dueDate < today
  }
  
  const formattedDate = (date) => {
    return dayjs(date).format('MMM DD, YYYY')
  }
  </script>
  