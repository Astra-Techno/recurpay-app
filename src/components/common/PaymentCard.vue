<template>
  <div v-if="displayType == 'card'" class="bg-white p-4 rounded-l shadow hover:bg-gray-50 transition space-y-2">
    
    <!-- Top: Payment Type and Amount -->
    <div class="flex justify-between items-center">
      <p class="text-sm font-bold text-gray-800">{{ getPaymentTypeLabel(payment.type) }}</p>
      <p class="text-sm font-bold text-gray-900">{{ formatCurrency(payment.amount) }}</p>
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
      <router-link v-if="payment.pay_status === 'pending'"
        :to="{ name: 'MarkAsPaid', params: { payment_id: payment.id } }">
        <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">Mark As Paid</button>
      </router-link>
      <router-link v-if="payment.pay_status === 'due'"
        :to="{ name: 'SendReminder', params: { payment_id: payment.id } }">
        <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">Send Reminder</button>
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
        <p class="font-bold">{{ getPaymentTypeLabel(payment.type) }} – {{ formatCurrency(payment.total_due) }}</p>
        <span class="text-orange-600 font-bold text-xs">
          Due in {{ payment.due_in_days }} days
        </span>
      </div>
    </div>

    <div class="flex gap-2">
      <router-link v-if="payment.pay_status === 'pending'" :to="{ name: 'MarkAsPaid', params: { payment_id: payment.id } }">
        <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">Mark As Paid</button>
      </router-link>
      <router-link v-if="payment.pay_status === 'due'"
        :to="{ name: 'SendReminder', params: { payment_id: payment.id } }">
        <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">Send Reminder</button>
      </router-link>      
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'

defineProps({
  payment: Object,
  displayType: {
    type: String,
    default: 'card'
  }
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