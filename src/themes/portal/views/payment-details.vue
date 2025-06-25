<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <button @click="$router.back()" class="p-2 hover:bg-gray-100 rounded-lg">
          <Icon name="ArrowLeft" :size="20" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Payment Details</h1>
          <p class="text-gray-600 mt-1">Transaction #{{ $route.params.id }}</p>
        </div>
      </div>
    </div>

    <!-- Payment Status -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div class="flex items-center justify-center mb-6">
        <div class="w-16 h-16 rounded-full flex items-center justify-center"
             :class="payment.status === 'completed' ? 'bg-green-100' : 
                     payment.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'">
          <Icon :name="payment.status === 'completed' ? 'CheckCircle' : 
                       payment.status === 'pending' ? 'Clock' : 'XCircle'" 
                :size="32"
                :class="payment.status === 'completed' ? 'text-green-600' : 
                        payment.status === 'pending' ? 'text-yellow-600' : 'text-red-600'" />
        </div>
      </div>
      
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">₹{{ formatCurrency(payment.amount) }}</h2>
        <p class="text-lg font-medium mb-1"
           :class="payment.status === 'completed' ? 'text-green-600' : 
                   payment.status === 'pending' ? 'text-yellow-600' : 'text-red-600'">
          {{ payment.status === 'completed' ? 'Payment Successful' : 
             payment.status === 'pending' ? 'Payment Pending' : 'Payment Failed' }}
        </p>
        <p class="text-gray-500">{{ formatDate(payment.date, 'DD MMM YYYY, hh:mm A') }}</p>
      </div>
    </div>

    <!-- Payment Information -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
      
      <div class="space-y-4">
        <div class="flex justify-between">
          <span class="text-gray-600">Transaction ID</span>
          <span class="font-medium text-gray-900">{{ payment.transactionId }}</span>
        </div>
        
        <div class="flex justify-between">
          <span class="text-gray-600">Payment Method</span>
          <span class="font-medium text-gray-900">{{ payment.paymentMethod }}</span>
        </div>
        
        <div class="flex justify-between">
          <span class="text-gray-600">Service</span>
          <span class="font-medium text-gray-900">{{ payment.service }}</span>
        </div>
        
        <div class="flex justify-between">
          <span class="text-gray-600">Category</span>
          <span class="font-medium text-gray-900">{{ payment.category }}</span>
        </div>
        
        <div class="flex justify-between">
          <span class="text-gray-600">Reference Number</span>
          <span class="font-medium text-gray-900">{{ payment.referenceNumber }}</span>
        </div>
      </div>
    </div>

    <!-- Recipient Information -->
    <div v-if="payment.recipient" class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Recipient Details</h3>
      
      <div class="flex items-center space-x-4">
        <img :src="payment.recipient.avatar || '/api/placeholder/48/48'" 
             :alt="payment.recipient.name" 
             class="w-12 h-12 rounded-full border border-gray-200" />
        <div>
          <h4 class="font-medium text-gray-900">{{ payment.recipient.name }}</h4>
          <p class="text-sm text-gray-500">{{ payment.recipient.phone || payment.recipient.email }}</p>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex space-x-3">
      <button 
        @click="downloadReceipt"
        class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
      >
        <Icon name="Download" :size="20" />
        <span>Download Receipt</span>
      </button>
      
      <button 
        @click="sharePayment"
        class="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2"
      >
        <Icon name="Share" :size="20" />
        <span>Share</span>
      </button>
    </div>

    <!-- Support -->
    <div class="bg-gray-50 rounded-xl p-4 text-center">
      <p class="text-sm text-gray-600 mb-2">Need help with this transaction?</p>
      <button 
        @click="contactSupport"
        class="text-blue-600 hover:text-blue-700 font-medium text-sm"
      >
        Contact Support
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCurrentTitle } from '@/composables/use-meta'
import { formatDate } from '@/composables/helper'
import Signal from '@/composables/signal'
import useApiRequest from '@/composables/request'

const route = useRoute()
const request = useApiRequest()

useCurrentTitle('Payment Details - RecurPay')

// Reactive data
const payment = ref({
  id: route.params.id,
  amount: 1299,
  status: 'completed',
  date: new Date(),
  transactionId: 'TXN' + Date.now(),
  paymentMethod: 'UPI',
  service: 'Netflix Premium',
  category: 'Entertainment',
  referenceNumber: 'REF' + Date.now(),
  recipient: {
    name: 'Netflix India',
    avatar: '/api/placeholder/48/48',
    email: 'billing@netflix.com'
  }
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN').format(amount)
}

const downloadReceipt = () => {
  // Generate and download receipt
  Signal.success('Receipt download started')
}

const sharePayment = () => {
  if (navigator.share) {
    navigator.share({
      title: 'Payment Receipt',
      text: `Payment of ₹${formatCurrency(payment.value.amount)} to ${payment.value.service}`,
      url: window.location.href
    })
  } else {
    // Fallback for browsers that don't support Web Share API
    navigator.clipboard.writeText(window.location.href)
    Signal.success('Payment link copied to clipboard')
  }
}

const contactSupport = () => {
  Signal.success('Redirecting to support...')
}

const loadPaymentDetails = async () => {
  try {
    // API call to load payment details
    // const response = await request.post('/api/item/Payment:details', { id: route.params.id })
    // if (!response.error) {
    //   payment.value = response.data
    // }
  } catch (error) {
    console.error('Failed to load payment details:', error)
  }
}

onMounted(() => {
  loadPaymentDetails()
})
</script>