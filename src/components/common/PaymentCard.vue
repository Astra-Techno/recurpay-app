<template>
  <div
    v-if="displayType === 'card'"
    class="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 space-y-4 relative overflow-hidden"
  >
    <!-- Top: Payment Type and Amount -->
    <div class="flex justify-between items-center">
      <p class="text-sm font-bold text-gray-800">{{ getPaymentTypeLabel(payment.type) }}</p>
      <p class="text-sm font-bold text-gray-900">{{ formatCurrency(payment.amount) }}</p>
    </div>

    <!-- Bottom: Due Date and View Button -->
    <div class="flex justify-between items-center text-xs font-semibold">
      <p :class="isOverdue(payment.next_due_date) ? 'text-red-500' : 'text-blue-600'">
        Due: {{ formattedDate(payment.next_due_date) }}
      </p>
      <router-link :to="{ name: 'PaymentDetail', params: { id: payment.id } }">
        <button class="ripple-btn bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full transition">
          View
        </button>
      </router-link>
    </div>

    <!-- Floating Actions -->
    <div v-if="payment.pay_status" class="flex gap-2 mt-4 flex-wrap justify-end md:justify-end">
      <router-link
        v-if="payment.pay_status === 'pending'"
        :to="{ name: 'MarkAsPaid', params: { payment_id: payment.id } }"
      >
        <button
          class="ripple-btn text-xs bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-1 rounded-full transition w-full md:w-auto"
        >
          Mark As Paid
        </button>
      </router-link>
      <router-link
        v-else-if="payment.pay_status === 'due'"
        :to="{ name: 'SendReminder', params: { payment_id: payment.id } }"
      >
        <button
          class="ripple-btn text-xs bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-3 py-1 rounded-full transition w-full md:w-auto"
        >
          Send Reminder
        </button>
      </router-link>
    </div>
  </div>

  <!-- Default View -->
  <div
    v-else
    class="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 space-y-4 overflow-hidden"
  >
    <div class="flex justify-between items-center">
      <p class="font-bold text-gray-800">{{ payment.property }}</p>
      <router-link :to="{ name: 'PaymentDetail', params: { id: payment.id } }">
        <button class="ripple-btn text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full">
          View
        </button>
      </router-link>
    </div>

    <p class="text-xs font-semibold text-orange-600">{{ payment.address1 }}</p>

    <div class="flex justify-between items-center text-sm">
      <p class="text-gray-700">{{ getPaymentTypeLabel(payment.type) }} – {{ formatCurrency(payment.total_due) }}</p>
      <span class="text-xs font-bold text-orange-500">
        Due in {{ payment.due_in_days }} days
      </span>
    </div>

    <div v-if="payment.pay_status" class="flex gap-2 mt-4 flex-wrap justify-end md:justify-end">
      <router-link
        v-if="payment.pay_status === 'pending'"
        :to="{ name: 'MarkAsPaid', params: { payment_id: payment.id } }"
      >
        <button
          class="ripple-btn text-xs bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-1 rounded-full transition w-full md:w-auto"
        >
          Mark As Paid
        </button>
      </router-link>
      <router-link
        v-else-if="payment.pay_status === 'due'"
        :to="{ name: 'SendReminder', params: { payment_id: payment.id } }"
      >
        <button
          class="ripple-btn text-xs bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-3 py-1 rounded-full transition w-full md:w-auto"
        >
          Send Reminder
        </button>
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

<style scoped>
.ripple-btn {
  position: relative;
  overflow: hidden;
}
.ripple-btn::after {
  content: "";
  position: absolute;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transform: scale(0);
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  opacity: 0;
  transition: transform 0.5s, opacity 1s;
}
.ripple-btn:active::after {
  transform: scale(2);
  opacity: 1;
  transition: 0s;
}
</style>
