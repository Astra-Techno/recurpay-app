<template>
    <div class="bg-white flex flex-col relative">
      <!-- Toast Notification -->
      <transition name="fade">
        <div
          v-if="showToast"
          class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50"
        >
          {{ toastMessage }}
        </div>
      </transition>
  
      <!-- Main Content -->
      <div class="flex-1 p-6 flex flex-col items-center text-center space-y-6">
        <template v-if="loading">
          <!-- Loading Shimmer -->
          <div class="animate-pulse space-y-6 w-full flex flex-col items-center">
            <div class="bg-green-100 h-16 w-16 rounded-full"></div>
            <div class="h-6 bg-gray-300 w-32 rounded"></div>
            <div class="h-4 bg-gray-300 w-48 rounded"></div>
            <div class="h-3 bg-gray-200 w-40 rounded"></div>
            <div class="bg-white w-full p-4 rounded-xl shadow space-y-4 mt-6">
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </template>
  
        <template v-else-if="!transaction">
          <!-- Empty State -->
          <div class="flex flex-col items-center space-y-4">
            <div class="text-6xl">😕</div>
            <p class="text-gray-600 font-semibold">Receipt not found.</p>
            <button @click="$router.back()" class="text-sm mt-2 text-blue-500">
              Go Back
            </button>
          </div>
        </template>
  
        <template v-else>
          <!-- Dynamic Status Icon -->
          <div :class="[statusIcon.bg, 'rounded-full p-4 animate-rotate-in']">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path :class="statusIcon.color" stroke-linecap="round" stroke-linejoin="round" :d="statusIcon.icon" />
            </svg>
          </div>
  
          <!-- Amount -->
          <p class="text-3xl font-bold tracking-wide text-gray-800">
            {{ formatCurrency(transaction.amount_paid || 0) }}
          </p>
  
          <!-- Property Name -->
          <p class="text-lg font-bold text-gray-700">
            {{ transaction.property }}
          </p>
  
          <!-- Tenant/User Name -->
          <p class="text-sm text-gray-500">
            {{ transaction.tenant_name }}
          </p>
  
          <!-- Info Card -->
          <div class="bg-white rounded-xl shadow p-4 w-full space-y-4 mt-6">
            <div class="flex justify-between">
              <p class="text-xs text-gray-500">Payment Date</p>
              <p class="text-base font-semibold text-gray-800">{{ formattedDate(transaction.paid_on) }}</p>
            </div>
            <div class="border-t"></div>
  
            <div class="flex justify-between">
              <p class="text-xs text-gray-500">Payment Method</p>
              <p class="text-base font-semibold text-gray-800">{{ formatPaymentMode(transaction.payment_mode) }}</p>
            </div>
            <div class="border-t"></div>
  
            <div class="flex justify-between">
              <p class="text-xs text-gray-500">Transaction ID</p>
              <p class="text-base font-semibold text-gray-800 truncate">{{ transaction.transaction_ref || '-' }}</p>
            </div>
            <div class="border-t"></div>
  
            <div class="flex justify-between">
              <p class="text-xs text-gray-500">Payment Type</p>
              <p class="text-base font-semibold text-gray-800">{{ formatPaymentType(transaction.payment_type) }}</p>
            </div>
          </div>
        </template>
      </div>
  
      <!-- Bottom Actions (only for success) -->
      <div v-if="transaction && isSuccess" class="p-4 bg-white flex flex-wrap justify-around gap-2 border-t">
        <a @click="shareReceipt" class="text-blue-500 font-semibold text-sm cursor-pointer">
          Share
        </a>
        <a @click="downloadInvoice" class="text-blue-500 font-semibold text-sm cursor-pointer">
          Download Invoice
        </a>        
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed, getCurrentInstance } from 'vue'
  import { useRoute } from 'vue-router'
  import dayjs from 'dayjs'
  import useApiRequest from '@/composables/request'
  
  // Set page header
  getCurrentInstance().proxy.$setHeader('Payment Receipt', '', true, 'IconHome')

  const route = useRoute()
  const request = useApiRequest()
  
  const transaction = ref(null)
  const loading = ref(true)
  
  // Toast State
  const showToast = ref(false)
  const toastMessage = ref('')
  
  onMounted(async () => {
    try {
      const id = route.params.id
      const res = await request.fetch(`/item/PaymentTransactions?id=${id}`)
      await new Promise(resolve => setTimeout(resolve, 500))
  
      if (res.error) {
        transaction.value = null
      } else {
        transaction.value = res.data
      }
    } catch (error) {
      console.error('Error fetching transaction', error)
      transaction.value = null
    } finally {
      loading.value = false
    }
  })
  
  function formatCurrency(amount, currency = 'INR', locale = 'en-IN') {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
  }
  
  function formattedDate(date) {
    return dayjs(date).format('MMMM D, YYYY [at] h:mm A')
  }
  
  function formatPaymentMode(mode) {
    if (!mode) return 'Payment'
    return {
      upi: 'UPI',
      bank: 'Bank Transfer',
      cash: 'Cash',
      card: 'Card'
    }[mode.toLowerCase()] || mode
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
  
  function getStatusIcon(status) {
    switch (status) {
      case 'success':
        return {
          bg: 'bg-green-100',
          icon: 'M5 13l4 4L19 7', // Check mark
          color: 'text-green-600'
        }
      case 'pending':
        return {
          bg: 'bg-yellow-100',
          icon: 'M12 8v4l3 3', // Clock hand
          color: 'text-yellow-600'
        }
      case 'failed':
        return {
          bg: 'bg-red-100',
          icon: 'M6 18L18 6M6 6l12 12', // Cross mark
          color: 'text-red-600'
        }
      default:
        return {
          bg: 'bg-gray-100',
          icon: 'M5 13l4 4L19 7', // Default check
          color: 'text-gray-500'
        }
    }
  }
  
  const statusIcon = computed(() => {
    if (!transaction.value) return getStatusIcon('success')
    return getStatusIcon(transaction.value.status || 'success')
  })
  
  const isSuccess = computed(() => {
    return transaction.value?.status === 'success'
  })
  
  function shareReceipt() {
    if (!transaction.value) return
    if (navigator.share) {
      navigator.share({
        title: 'Payment Receipt',
        text: `Receipt for ₹${transaction.value.amount_paid} at ${transaction.value.property}`,
        url: window.location.href
      }).then(() => {
        showToastMessage('Receipt shared successfully!')
      }).catch((error) => console.log('Sharing failed', error))
    } else {
      alert('Sharing not supported in this browser.')
    }
  }
  
  function downloadInvoice() {
    if (!transaction.value) return
    window.open(`/api/transactions/${transaction.value.id}/invoice/download`, '_blank')
  }
  
  function showToastMessage(message) {
    toastMessage.value = message
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }
  </script>
  
  <style scoped>
  @keyframes rotateIn {
    0% {
      transform: rotate(-200deg) scale(0.3);
      opacity: 0;
    }
    100% {
      transform: rotate(0deg) scale(1);
      opacity: 1;
    }
  }
  .animate-rotate-in {
    animation: rotateIn 0.8s ease-out forwards;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style>
  