<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-2">
            Welcome back, {{ user?.name || 'User' }}! 👋
          </h1>
          <p class="text-blue-100">
            Here's what's happening with your account today.
          </p>
        </div>
        <div v-if="!deviceStore.isMobile" class="hidden md:block">
          <Icon name="Wallet" :size="48" class="text-blue-200" />
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Balance</p>
            <p class="text-xl font-bold text-gray-900">₹{{ formatCurrency(stats.balance) }}</p>
          </div>
          <div class="p-2 bg-green-100 rounded-lg">
            <Icon name="Wallet" :size="20" class="text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">This Month</p>
            <p class="text-xl font-bold text-gray-900">₹{{ formatCurrency(stats.thisMonth) }}</p>
          </div>
          <div class="p-2 bg-blue-100 rounded-lg">
            <Icon name="TrendingUp" :size="20" class="text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Services</p>
            <p class="text-xl font-bold text-gray-900">{{ stats.activeServices }}</p>
          </div>
          <div class="p-2 bg-purple-100 rounded-lg">
            <Icon name="Grid3X3" :size="20" class="text-purple-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Pending</p>
            <p class="text-xl font-bold text-gray-900">{{ stats.pendingPayments }}</p>
          </div>
          <div class="p-2 bg-orange-100 rounded-lg">
            <Icon name="Clock" :size="20" class="text-orange-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          v-for="action in quickActions"
          :key="action.label"
          @click="handleQuickAction(action.action)"
          class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
        >
          <div class="p-3 bg-gray-100 rounded-full mb-3">
            <Icon :name="action.icon" :size="24" class="text-gray-600" />
          </div>
          <span class="text-sm font-medium text-gray-900">{{ action.label }}</span>
        </button>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="p-6 border-b border-gray-100">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          <router-link 
            to="/transactions" 
            class="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </router-link>
        </div>
      </div>
      
      <div class="divide-y divide-gray-100">
        <div 
          v-for="transaction in recentTransactions" 
          :key="transaction.id"
          class="p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 rounded-full" :class="getTransactionIconBg(transaction.type)">
                <Icon :name="getTransactionIcon(transaction.type)" :size="16" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ transaction.description }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(transaction.date) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium" :class="getAmountColor(transaction.type)">
                {{ transaction.type === 'credit' ? '+' : '-' }}₹{{ formatCurrency(transaction.amount) }}
              </p>
              <p class="text-xs text-gray-500 capitalize">{{ transaction.status }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Services Overview (Desktop) -->
    <div v-if="!deviceStore.isMobile" class="grid md:grid-cols-2 gap-6">
      <!-- Active Services -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Active Services</h2>
          <router-link 
            to="/services" 
            class="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Manage
          </router-link>
        </div>
        
        <div class="space-y-3">
          <div 
            v-for="service in activeServices" 
            :key="service.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <img :src="service.logo" :alt="service.name" class="w-8 h-8 rounded" />
              <div>
                <p class="text-sm font-medium text-gray-900">{{ service.name }}</p>
                <p class="text-xs text-gray-500">Next: {{ formatDate(service.nextPayment) }}</p>
              </div>
            </div>
            <span class="text-sm font-medium text-gray-900">₹{{ formatCurrency(service.amount) }}</span>
          </div>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Payment Methods</h2>
          <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Add New
          </button>
        </div>
        
        <div class="space-y-3">
          <div 
            v-for="method in paymentMethods" 
            :key="method.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-white rounded border">
                <Icon :name="getPaymentMethodIcon(method.type)" :size="16" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ method.name }}</p>
                <p class="text-xs text-gray-500">{{ method.details }}</p>
              </div>
            </div>
            <span class="text-xs text-green-600 font-medium" v-if="method.isDefault">Default</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useExtendedStore } from '../stores/extendedStore'
import { useDeviceStore } from '../stores/useDeviceStore'
import { storeToRefs } from 'pinia'
import { useCurrentTitle } from '@/composables/use-meta'
import { formatDate, currency } from '@/composables/helper'
import useApiRequest from '@/composables/request'

useCurrentTitle('Dashboard - RecurPay')

const router = useRouter()
const extendedStore = useExtendedStore()
const deviceStore = useDeviceStore()
const { user } = storeToRefs(extendedStore)
const request = useApiRequest()

// Reactive data
const stats = ref({
  balance: 25430.50,
  thisMonth: 8750.00,
  activeServices: 12,
  pendingPayments: 3
})

const recentTransactions = ref([
  {
    id: 1,
    description: 'Netflix Subscription',
    amount: 649,
    type: 'debit',
    status: 'completed',
    date: new Date()
  },
  {
    id: 2,
    description: 'Wallet Top-up',
    amount: 5000,
    type: 'credit',
    status: 'completed',
    date: new Date(Date.now() - 86400000)
  },
  {
    id: 3,
    description: 'Spotify Premium',
    amount: 119,
    type: 'debit',
    status: 'pending',
    date: new Date(Date.now() - 172800000)
  }
])

const activeServices = ref([
  {
    id: 1,
    name: 'Netflix',
    logo: '/api/placeholder/32/32',
    amount: 649,
    nextPayment: new Date(Date.now() + 86400000 * 5)
  },
  {
    id: 2,
    name: 'Spotify',
    logo: '/api/placeholder/32/32',
    amount: 119,
    nextPayment: new Date(Date.now() + 86400000 * 12)
  },
  {
    id: 3,
    name: 'Amazon Prime',
    logo: '/api/placeholder/32/32',
    amount: 1499,
    nextPayment: new Date(Date.now() + 86400000 * 25)
  }
])

const paymentMethods = ref([
  {
    id: 1,
    name: 'HDFC Bank',
    details: '****1234',
    type: 'card',
    isDefault: true
  },
  {
    id: 2,
    name: 'UPI',
    details: 'user@paytm',
    type: 'upi',
    isDefault: false
  }
])

const quickActions = [
  { label: 'Add Money', icon: 'Plus', action: 'add-money' },
  { label: 'Pay Bills', icon: 'Receipt', action: 'pay-bills' },
  { label: 'Send Money', icon: 'Send', action: 'send-money' },
  { label: 'Scan QR', icon: 'QrCode', action: 'scan-qr' }
]

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN').format(amount)
}

const getTransactionIcon = (type) => {
  return type === 'credit' ? 'ArrowDownLeft' : 'ArrowUpRight'
}

const getTransactionIconBg = (type) => {
  return type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
}

const getAmountColor = (type) => {
  return type === 'credit' ? 'text-green-600' : 'text-red-600'
}

const getPaymentMethodIcon = (type) => {
  switch (type) {
    case 'card': return 'CreditCard'
    case 'upi': return 'Smartphone'
    case 'bank': return 'Building2'
    default: return 'Wallet'
  }
}

const handleQuickAction = (action) => {
  switch (action) {
    case 'add-money':
      router.push('/wallet/add-money')
      break
    case 'pay-bills':
      router.push('/payments/bills')
      break
    case 'send-money':
      router.push('/payments/send')
      break
    case 'scan-qr':
      router.push('/payments/scan')
      break
  }
}

// Load dashboard data
const loadDashboardData = async () => {
  try {
    // Example API calls using your DataForge endpoints
    // const response = await request.post('/api/list/Dashboard:stats')
    // if (!response.error) {
    //   stats.value = response.data
    // }
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>