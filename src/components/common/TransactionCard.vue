<template>
  <div v-if="displayType === 'list'" class="bg-white p-4 rounded shadow animate-fade-in">
    <div class="flex flex-col gap-2 mb-2">
      <!-- Top Row: Payment Mode + Payment Type Badge + View Button -->
      <div class="flex justify-between items-start">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <!-- Payment Mode -->
            <p class="text-sm font-semibold text-gray-800">
              {{ formatPaymentMode(transaction.payment_mode) }}
            </p>

            <!-- Payment Type Badge -->
            <span v-if="transaction.payment_type" :class="[
              'inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full',
              badgeColor(transaction.payment_type)
            ]">
              {{ formatPaymentType(transaction.payment_type) }}
            </span>
          </div>

          <!-- Paid On -->
          <p class="text-xs text-gray-500">
            {{ formattedDate(transaction.paid_on) }}
          </p>

          <!-- Transaction Ref -->
          <p v-if="transaction.transaction_ref" class="text-[11px] text-gray-400 truncate">
            Ref: {{ transaction.transaction_ref }}
          </p>

          <!-- Property Name -->
          <p v-if="transaction.property" class="text-[11px] text-blue-500 font-semibold truncate">
            {{ transaction.property }}
          </p>
        </div>

        <!-- View Button -->
        <router-link :to="{ name: 'TransactionDetail', params: { id: transaction.id } }">
          <button class="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition">
            View
          </button>
        </router-link>
      </div>

      <!-- Amount and Status Badge -->
      <div class="flex justify-between items-center">
        <p class="text-lg font-bold text-gray-900">
          {{ formatCurrency(transaction.amount_paid || 0) }}
        </p>

        <span :class="[
          'text-xs font-semibold px-3 py-1 rounded-full animate-status-bounce',
          transaction.status === 'success' ? 'bg-green-100 text-green-700' :
            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
        ]">
          {{ transaction.status.toUpperCase() }}
        </span>
      </div>
    </div>
  </div>


  <div v-else-if="displayType === 'dashboard'" class="flex justify-between items-center">
    <div class="text-sm text-gray-700 font-semibold truncate">
      {{ transaction.tenant_name }} — {{ transaction.property }}
    </div>
    <div :class="[
      'text-sm font-bold',
      transaction.status === 'success' ? 'text-green-600' : 'text-red-500'
    ]">
      {{ formatCurrency(transaction.amount_paid || 0) }}
      <span v-if="transaction.status === 'success'">Paid</span>
      <span v-else>Due</span>
    </div>
  </div>

  <div v-else-if="displayType === 'detail-list'"
    class="bg-white p-4 rounded-xl shadow hover:bg-gray-50 transition space-y-3 w-full animate-fade-in">

    <!-- Top Row -->
    <div class="flex justify-between items-start">
      <div class="flex flex-col">
        <p class="text-sm font-bold text-gray-800">
          {{ formatPaymentType(transaction.payment_type) }}
        </p>
        <p v-if="transaction.transaction_ref" class="text-[11px] text-gray-400 truncate mt-0.5">
          Ref: {{ transaction.transaction_ref }}
        </p>
      </div>

      <p class="text-sm font-bold text-gray-900">
        {{ formatCurrency(transaction.amount_paid || 0) }}
      </p>
    </div>

    <!-- Bottom Row -->
    <div class="flex justify-between items-center">
      <p class="text-xs font-semibold" :class="transaction.status === 'pending' ? 'text-yellow-500' :
        transaction.status === 'failed' ? 'text-red-500' :
          'text-green-600'">
        {{ formattedDate(transaction.paid_on) }}
      </p>

      <router-link :to="{ name: 'TransactionDetail', params: { id: transaction.id } }">
        <button class="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition">
          View
        </button>
      </router-link>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

defineProps({
  transaction: {
    type: Object,
    required: true
  },
  displayType: {
    type: String,
    default: 'list',
    required: false
  }
})

const router = useRouter()

function formatCurrency(amount, currency = 'INR', locale = 'en-IN') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount)
}

const formattedDate = (date) => {
  return dayjs(date).format('MMM DD, YYYY hh:mm A')
}

function formatPaymentMode(mode) {
  if (!mode) return 'Payment'
  if (mode.toLowerCase() === 'upi') return 'UPI Payment'
  if (mode.toLowerCase() === 'bank') return 'Bank Transfer'
  if (mode.toLowerCase() === 'cash') return 'Cash Payment'
  if (mode.toLowerCase() === 'card') return 'Card Payment'
  return mode.charAt(0).toUpperCase() + mode.slice(1) + ' Payment'
}

function formatPaymentType(type) {
  const labels = {
    rent: 'Rent',
    maintenance: 'Maintenance',
    electricity: 'Electricity Bill',
    water: 'Water Bill',
    deposit: 'Security Deposit',
    other: 'Other'
  }
  return labels[type] || type
}

function badgeColor(type) {
  switch (type) {
    case 'rent':
      return 'bg-indigo-100 text-indigo-700'
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-700'
    case 'electricity':
      return 'bg-blue-100 text-blue-700'
    case 'water':
      return 'bg-teal-100 text-teal-700'
    case 'deposit':
      return 'bg-purple-100 text-purple-700'
    case 'other':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes statusBounce {
  0% {
    transform: scale(0.95);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

.animate-status-bounce {
  animation: statusBounce 0.6s ease-in-out;
}
</style>