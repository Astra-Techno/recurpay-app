<template>
    <div v-if="displayType == 'card'" class="bg-white p-4 rounded-l shadow hover:bg-gray-50 transition space-y-2">
      
      <!-- Top: Payment Type and Amount -->
      <div class="flex justify-between items-center">
        <p class="text-sm font-bold text-gray-800">{{ getPaymentTypeLabel(payment.type) }}</p>
        <p class="text-sm font-bold text-gray-900">{{ currency(payment.amount) }}</p>
      </div>
      <!-- No Divider here anymore -->
  
      <!-- Bottom: Due Date and View Button in one line -->
      <div class="flex justify-between items-center">
        <p class="text-xs font-semibold" :class="isOverdue(payment.next_due_date) ? 'text-red-500' : 'text-blue-600'">
          Due: {{ formattedDate(payment.next_due_date) }}
        </p>
  
        <router-link :to="{ name: 'PaymentDetail', params: { id: payment.id } }">
          <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition">
            View
          </button>
        </router-link>
      </div>
      <div class="flex justify-between items-center">
        <router-link :to="`/pay-now/index/${payment.id}`">
          <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">Pay Now</button>
        </router-link>
      </div>
    </div>
    <div v-else class="bg-white p-4 rounded shadow">
      <div class="flex flex-col gap-2 mb-2">
        <!-- Top Row: Property Name + View Button -->
        <div class="flex justify-between items-start">
          <p class="font-semibold">{{ payment.property }}</p>
          <router-link :to="{ name: 'PaymentDetail', params: { id: payment.id } }">
            <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">
              View
            </button>
          </router-link>
        </div>
  
        <!-- Address -->
        <p class="text-xs font-bold text-orange-700">{{ payment.address1 }}</p>
  
        <!-- Payment and Due in Same Line -->
        <div class="flex justify-between items-center">
          <p class="font-bold">{{ getPaymentTypeLabel(payment.type) }} – {{ currency(payment.total_due) }}</p>
          <span class="text-orange-600 font-bold text-xs">
            Due in {{ payment.due_in_days }} days
          </span>
        </div>
      </div>
  
      <div class="flex gap-2">
        <router-link :to="`/pay-now/index/${payment.id}`">
          <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">Pay Now</button>
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import dayjs from 'dayjs'
  import { currency, ucfirst } from '@/composables/helper';
  
  defineProps({
    payment: Object,
    displayType: {
      type: String,
      default: 'card'
    }
  })
  
  function getPaymentTypeLabel(type) {
    return ucfirst(type);
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