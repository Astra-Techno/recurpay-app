<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <button @click="$router.back()" class="p-2 hover:bg-gray-100 rounded-lg">
          <Icon name="ArrowLeft" :size="20" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Pay Bills</h1>
          <p class="text-gray-600 mt-1">Pay your utility bills and more</p>
        </div>
      </div>
    </div>

    <!-- Bill Categories -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Bill Categories</h2>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <button
          v-for="category in billCategories"
          :key="category.id"
          @click="selectedCategory = category"
          class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          :class="{ 'border-blue-500 bg-blue-50': selectedCategory?.id === category.id }"
        >
          <div class="p-3 rounded-full mb-2" :style="{ backgroundColor: category.color + '20' }">
            <Icon :name="category.icon" :size="24" :style="{ color: category.color }" />
          </div>
          <span class="text-sm font-medium text-gray-900">{{ category.name }}</span>
        </button>
      </div>
    </div>

    <!-- Bill Payment Form -->
    <div v-if="selectedCategory" class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ selectedCategory.name }} Bill Payment</h3>
      
      <form @submit.prevent="payBill" class="space-y-4">
        <!-- Service Provider -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Service Provider</label>
          <select
            v-model="billForm.provider"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Provider</option>
            <option
              v-for="provider in getProviders(selectedCategory.id)"
              :key="provider.id"
              :value="provider.id"
            >
              {{ provider.name }}
            </option>
          </select>
        </div>

               <!-- Account Number -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ selectedCategory.accountLabel || 'Account Number' }}
          </label>
          <input
            v-model="billForm.accountNumber"
            type="text"
            :placeholder="selectedCategory.placeholder || 'Enter account number'"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <!-- Fetch Bill Button -->
        <button
          type="button"
          @click="fetchBillDetails"
          :disabled="!billForm.provider || !billForm.accountNumber || fetchingBill"
          class="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          <span v-if="fetchingBill">Fetching Bill...</span>
          <span v-else>Fetch Bill Details</span>
        </button>

        <!-- Bill Details -->
        <div v-if="billDetails" class="bg-gray-50 rounded-lg p-4 space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Customer Name</span>
            <span class="font-medium text-gray-900">{{ billDetails.customerName }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Bill Amount</span>
            <span class="font-medium text-gray-900">₹{{ formatCurrency(billDetails.amount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Due Date</span>
            <span class="font-medium text-gray-900">{{ formatDate(billDetails.dueDate, 'DD MMM YYYY') }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Bill Period</span>
            <span class="font-medium text-gray-900">{{ billDetails.billPeriod }}</span>
          </div>
          
          <!-- Late Fee Warning -->
          <div v-if="billDetails.lateFee > 0" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div class="flex items-center space-x-2">
              <Icon name="AlertTriangle" :size="16" class="text-yellow-600" />
              <span class="text-sm text-yellow-800">
                Late fee of ₹{{ billDetails.lateFee }} will be added after due date
              </span>
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div v-if="billDetails">
          <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
          <div class="space-y-2">
            <label
              v-for="method in paymentMethods"
              :key="method.id"
              class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors"
              :class="{ 'border-blue-500 bg-blue-50': billForm.paymentMethod === method.id }"
            >
              <input
                v-model="billForm.paymentMethod"
                type="radio"
                :value="method.id"
                class="text-blue-600 focus:ring-blue-500"
              />
              <img :src="method.icon" :alt="method.name" class="w-8 h-8" />
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ method.name }}</p>
                <p class="text-sm text-gray-500">{{ method.description }}</p>
              </div>
              <span class="text-sm font-medium text-gray-900">{{ method.balance }}</span>
            </label>
          </div>
        </div>

        <!-- Pay Button -->
        <button
          v-if="billDetails"
          type="submit"
          :disabled="!billForm.paymentMethod || payingBill"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          <span v-if="payingBill">Processing Payment...</span>
          <span v-else>Pay ₹{{ formatCurrency(billDetails.amount) }}</span>
        </button>
      </form>
    </div>

    <!-- Recent Bills -->
    <div v-if="recentBills.length" class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Bills</h3>
      
      <div class="space-y-3">
        <div
          v-for="bill in recentBills"
          :key="bill.id"
          class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
        >
          <div class="flex items-center space-x-3">
            <div class="p-2 rounded-lg" :style="{ backgroundColor: bill.color + '20' }">
              <Icon :name="bill.icon" :size="20" :style="{ color: bill.color }" />
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ bill.provider }}</p>
              <p class="text-sm text-gray-500">{{ bill.accountNumber }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-medium text-gray-900">₹{{ formatCurrency(bill.amount) }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(bill.paidDate, 'DD MMM') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentTitle } from '@/composables/use-meta'
import { formatDate } from '@/composables/helper'
import Signal from '@/composables/signal'
import useApiRequest from '@/composables/request'

useCurrentTitle('Pay Bills - RecurPay')

const router = useRouter()
const request = useApiRequest()

// Reactive data
const selectedCategory = ref(null)
const fetchingBill = ref(false)
const payingBill = ref(false)
const billDetails = ref(null)

const billForm = ref({
  provider: '',
  accountNumber: '',
  paymentMethod: 'upi'
})

const billCategories = ref([
  {
    id: 'electricity',
    name: 'Electricity',
    icon: 'Zap',
    color: '#f59e0b',
    accountLabel: 'Consumer Number',
    placeholder: 'Enter consumer number'
  },
  {
    id: 'gas',
    name: 'Gas',
    icon: 'Flame',
    color: '#ef4444',
    accountLabel: 'Consumer Number',
    placeholder: 'Enter consumer number'
  },
  {
    id: 'water',
    name: 'Water',
    icon: 'Droplets',
    color: '#3b82f6',
    accountLabel: 'Consumer Number',
    placeholder: 'Enter consumer number'
  },
  {
    id: 'mobile',
    name: 'Mobile',
    icon: 'Smartphone',
    color: '#10b981',
    accountLabel: 'Mobile Number',
    placeholder: 'Enter mobile number'
  },
  {
    id: 'internet',
    name: 'Internet',
    icon: 'Wifi',
    color: '#8b5cf6',
    accountLabel: 'Customer ID',
    placeholder: 'Enter customer ID'
  },
  {
    id: 'dth',
    name: 'DTH/Cable',
    icon: 'Tv',
    color: '#f97316',
    accountLabel: 'Subscriber ID',
    placeholder: 'Enter subscriber ID'
  },
  {
    id: 'insurance',
    name: 'Insurance',
    icon: 'Shield',
    color: '#06b6d4',
    accountLabel: 'Policy Number',
    placeholder: 'Enter policy number'
  },
  {
    id: 'loan',
    name: 'Loan EMI',
    icon: 'CreditCard',
    color: '#ec4899',
    accountLabel: 'Loan Account',
    placeholder: 'Enter loan account number'
  }
])

const providers = ref({
  electricity: [
    { id: 'bescom', name: 'BESCOM' },
    { id: 'kseb', name: 'KSEB' },
    { id: 'tneb', name: 'TNEB' },
    { id: 'mseb', name: 'MSEB' }
  ],
  gas: [
    { id: 'indane', name: 'Indane Gas' },
    { id: 'hp', name: 'HP Gas' },
    { id: 'bharat', name: 'Bharat Gas' }
  ],
  mobile: [
    { id: 'airtel', name: 'Airtel' },
    { id: 'jio', name: 'Jio' },
    { id: 'vi', name: 'Vi (Vodafone Idea)' },
    { id: 'bsnl', name: 'BSNL' }
  ],
  internet: [
    { id: 'jio-fiber', name: 'Jio Fiber' },
    { id: 'airtel-xstream', name: 'Airtel Xstream' },
    { id: 'act', name: 'ACT Fibernet' },
    { id: 'bsnl-fiber', name: 'BSNL Fiber' }
  ]
})

const paymentMethods = ref([
  {
    id: 'upi',
    name: 'UPI',
    description: 'Instant payment via UPI',
    icon: '/api/placeholder/32/32',
    balance: 'Available'
  },
  {
    id: 'wallet',
    name: 'RecurPay Wallet',
    description: 'Use wallet balance',
    icon: '/api/placeholder/32/32',
    balance: '₹2,450'
  },
  {
    id: 'bank',
    name: 'Bank Account',
    description: 'HDFC Bank ****1234',
    icon: '/api/placeholder/32/32',
    balance: '₹15,230'
  }
])

const recentBills = ref([
  {
    id: 1,
    provider: 'BESCOM',
    accountNumber: '****5678',
    amount: 1250,
    paidDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    icon: 'Zap',
    color: '#f59e0b'
  },
  {
    id: 2,
    provider: 'Jio Fiber',
    accountNumber: '****9012',
    amount: 699,
    paidDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    icon: 'Wifi',
    color: '#8b5cf6'
  },
  {
    id: 3,
    provider: 'Airtel Mobile',
    accountNumber: '****3456',
    amount: 399,
    paidDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    icon: 'Smartphone',
    color: '#10b981'
  }
])

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN').format(amount)
}

const getProviders = (categoryId) => {
  return providers.value[categoryId] || []
}

const fetchBillDetails = async () => {
  try {
    fetchingBill.value = true
    
    // API call to fetch bill details
    // const response = await request.post('/api/task/Bill:fetchDetails', {
    //   category: selectedCategory.value.id,
    //   provider: billForm.value.provider,
    //   accountNumber: billForm.value.accountNumber
    // })
    // if (!response.error) {
    //   billDetails.value = response.data
    // }
    
    // Mock bill details for demo
    await new Promise(resolve => setTimeout(resolve, 2000))
    billDetails.value = {
      customerName: 'John Doe',
      amount: Math.floor(Math.random() * 2000) + 500,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      billPeriod: 'Jan 2024',
      lateFee: Math.random() > 0.7 ? 50 : 0
    }
    
  } catch (error) {
    Signal.error('Failed to fetch bill details')
  } finally {
    fetchingBill.value = false
  }
}

const payBill = async () => {
  try {
    payingBill.value = true
    
    // API call to pay bill
    // const response = await request.post('/api/task/Bill:payBill', {
    //   ...billForm.value,
    //   billDetails: billDetails.value
    // })
    // if (!response.error) {
    //   Signal.success('Bill paid successfully!')
    //   router.push('/payments')
    // }
    
    // Mock success for demo
    await new Promise(resolve => setTimeout(resolve, 3000))
    Signal.success('Bill paid successfully!')
    router.push('/payments')
    
  } catch (error) {
    Signal.error('Failed to pay bill')
  } finally {
    payingBill.value = false
  }
}

const loadRecentBills = async () => {
  try {
    // API call to load recent bills
    // const response = await request.post('/api/list/Bill:recent')
    // if (!response.error) {
    //   recentBills.value = response.data.items
    // }
  } catch (error) {
    console.error('Failed to load recent bills:', error)
  }
}

onMounted(() => {
  loadRecentBills()
})
</script>
