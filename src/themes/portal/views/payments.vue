<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Payments</h1>
        <p class="text-gray-600 mt-1">Send money, pay bills, and manage transactions</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <button
        v-for="action in paymentActions"
        :key="action.label"
        @click="handlePaymentAction(action.action)"
        class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-center"
      >
        <div class="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
          <Icon :name="action.icon" :size="24" class="text-blue-600" />
        </div>
        <h3 class="font-medium text-gray-900 mb-1">{{ action.label }}</h3>
        <p class="text-sm text-gray-500">{{ action.description }}</p>
      </button>
    </div>

    <!-- Recent Payments -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="p-6 border-b border-gray-100">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Recent Payments</h2>
          <div class="flex space-x-2">
            <!-- Filter Dropdown -->
            <select 
              v-model="paymentFilter"
              class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Payments</option>
              <option value="sent">Sent</option>
              <option value="received">Received</option>
              <option value="bills">Bills</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Payments List -->
      <div class="divide-y divide-gray-100">
        <div 
          v-for="payment in filteredPayments" 
          :key="payment.id"
          class="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
          @click="viewPaymentDetails(payment)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 rounded-full" :class="getPaymentIconBg(payment.type)">
                <Icon :name="getPaymentIcon(payment.type)" :size="16" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ payment.description }}</p>
                <div class="flex items-center space-x-2 mt-1">
                  <p class="text-xs text-gray-500">{{ formatDate(payment.date) }}</p>
                  <span class="text-xs text-gray-300">•</span>
                  <span 
                    class="text-xs px-2 py-0.5 rounded-full font-medium"
                    :class="getStatusBadgeClass(payment.status)"
                  >
                    {{ payment.status }}
                  </span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium" :class="getAmountColor(payment.type)">
                {{ payment.type === 'received' ? '+' : '-' }}₹{{ formatCurrency(payment.amount) }}
              </p>
              <p class="text-xs text-gray-500">{{ payment.method }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredPayments.length === 0" class="p-8 text-center">
        <Icon name="Receipt" :size="48" class="text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
        <p class="text-gray-500">Your payment history will appear here</p>
      </div>
    </div>

    <!-- Payment Methods -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Payment Methods</h2>
        <button 
          @click="showAddPaymentMethod = true"
          class="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
        >
          <Icon name="Plus" :size="16" />
          <span>Add New</span>
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="method in paymentMethods" 
          :key="method.id"
          class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
          :class="{ 'border-blue-500 bg-blue-50': method.isDefault }"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-white rounded border">
                <Icon :name="getPaymentMethodIcon(method.type)" :size="20" />
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ method.name }}</p>
                <p class="text-sm text-gray-500">{{ method.details }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span v-if="method.isDefault" class="text-xs text-blue-600 font-medium">Default</span>
              <button class="text-gray-400 hover:text-gray-600">
                <Icon name="MoreVertical" :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Payment Method Modal -->
    <transition name="modal-fade">
      <div v-if="showAddPaymentMethod" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl max-w-md w-full">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900">Add Payment Method</h2>
              <button @click="showAddPaymentMethod = false" class="text-gray-400 hover:text-gray-600">
                <Icon name="X" :size="20" />
              </button>
            </div>

            <div class="space-y-4">
              <!-- Payment Method Types -->
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="type in paymentMethodTypes"
                  :key="type.key"
                  @click="selectedPaymentType = type.key"
                  class="p-4 border rounded-lg text-center transition-colors"
                  :class="selectedPaymentType === type.key 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300'"
                >
                  <Icon :name="type.icon" :size="24" class="mx-auto mb-2" />
                  <p class="text-sm font-medium">{{ type.label }}</p>
                </button>
              </div>

              <!-- Form based on selected type -->
              <form @submit.prevent="addPaymentMethod" class="space-y-4">
                <div v-if="selectedPaymentType === 'card'">
                  <input
                    v-model="paymentMethodForm.cardNumber"
                    type="text"
                    placeholder="Card Number"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <div class="grid grid-cols-2 gap-3 mt-3">
                    <input
                      v-model="paymentMethodForm.expiryDate"
                      type="text"
                      placeholder="MM/YY"
                      class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      v-model="paymentMethodForm.cvv"
                      type="text"
                      placeholder="CVV"
                      class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div v-else-if="selectedPaymentType === 'upi'">
                  <input
                    v-model="paymentMethodForm.upiId"
                    type="text"
                    placeholder="UPI ID (e.g., user@paytm)"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div v-else-if="selectedPaymentType === 'bank'">
                  <input
                    v-model="paymentMethodForm.accountNumber"
                    type="text"
                    placeholder="Account Number"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                    required
                  />
                  <input
                    v-model="paymentMethodForm.ifscCode"
                    type="text"
                    placeholder="IFSC Code"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <!-- Action Buttons -->
                <div class="flex space-x-3 pt-4">
                  <button
                    type="button"
                    @click="showAddPaymentMethod = false"
                    class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Method
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentTitle } from '@/composables/use-meta'
import { formatDate } from '@/composables/helper'
import Signal from '@/composables/signal'
import useApiRequest from '@/composables/request'

useCurrentTitle('Payments - RecurPay')

const router = useRouter()
const request = useApiRequest()

// Reactive data
const paymentFilter = ref('all')
const showAddPaymentMethod = ref(false)
const selectedPaymentType = ref('card')

const payments = ref([
  {
    id: 1,
    description: 'Netflix Subscription',
    amount: 649,
    type: 'sent',
    status: 'completed',
    date: new Date(),
    method: 'UPI',
    category: 'bills'
  },
  {
    id: 2,
    description: 'Money from John',
    amount: 2500,
    type: 'received',
    status: 'completed',
    date: new Date(Date.now() - 86400000),
    method: 'Bank Transfer',
    category: 'transfer'
  },
  {
    id: 3,
    description: 'Electricity Bill',
    amount: 1850,
    type: 'sent',
    status: 'pending',
    date: new Date(Date.now() - 172800000),
    method: 'Card',
    category: 'bills'
  },
  {
    id: 4,
    description: 'Sent to Mom',
    amount: 5000,
    type: 'sent',
    status: 'completed',
    date: new Date(Date.now() - 259200000),
    method: 'UPI',
    category: 'transfer'
  }
])

const paymentMethods = ref([
  {
    id: 1,
    name: 'HDFC Bank Card',
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
  },
  {
    id: 3,
    name: 'SBI Account',
    details: '****5678',
    type: 'bank',
    isDefault: false
  }
])

const paymentMethodForm = ref({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  upiId: '',
  accountNumber: '',
  ifscCode: ''
})

const paymentActions = [
  {
    label: 'Send Money',
    description: 'Transfer to contacts',
    icon: 'Send',
    action: 'send-money'
  },
  {
    label: 'Pay Bills',
    description: 'Utilities & services',
    icon: 'Receipt',
    action: 'pay-bills'
  },
  {
    label: 'Scan QR',
    description: 'Quick payments',
    icon: 'QrCode',
    action: 'scan-qr'
  },
  {
    label: 'Request Money',
    description: 'Ask for payment',
    icon: 'Download',
    action: 'request-money'
  }
]

const paymentMethodTypes = [
  { key: 'card', label: 'Card', icon: 'CreditCard' },
  { key: 'upi', label: 'UPI', icon: 'Smartphone' },
  { key: 'bank', label: 'Bank', icon: 'Building2' }
]

// Computed
const filteredPayments = computed(() => {
  if (paymentFilter.value === 'all') return payments.value
  if (paymentFilter.value === 'bills') return payments.value.filter(p => p.category === 'bills')
  return payments.value.filter(payment => payment.type === paymentFilter.value)
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN').format(amount)
}

const getPaymentIcon = (type) => {
  switch (type) {
    case 'sent': return 'ArrowUpRight'
    case 'received': return 'ArrowDownLeft'
    default: return 'Receipt'
  }
}

const getPaymentIconBg = (type) => {
  switch (type) {
    case 'sent': return 'bg-red-100 text-red-600'
    case 'received': return 'bg-green-100 text-green-600'
    default: return 'bg-blue-100 text-blue-600'
  }
}

const getAmountColor = (type) => {
  return type === 'received' ? 'text-green-600' : 'text-red-600'
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-orange-100 text-orange-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPaymentMethodIcon = (type) => {
  switch (type) {
    case 'card': return 'CreditCard'
    case 'upi': return 'Smartphone'
    case 'bank': return 'Building2'
    default: return 'Wallet'
  }
}

const handlePaymentAction = (action) => {
  switch (action) {
    case 'send-money':
      router.push('/payments/send')
      break
    case 'pay-bills':
      router.push('/payments/bills')
      break
    case 'scan-qr':
      router.push('/payments/scan')
      break
    case 'request-money':
      router.push('/payments/request')
      break
  }
}

const viewPaymentDetails = (payment) => {
  router.push(`/payments/${payment.id}`)
}

const addPaymentMethod = async () => {
  try {
    let newMethod = {
      id: Date.now(),
      isDefault: false
    }

    switch (selectedPaymentType.value) {
      case 'card':
        newMethod = {
          ...newMethod,
          name: `Card ending ${paymentMethodForm.value.cardNumber.slice(-4)}`,
          details: `****${paymentMethodForm.value.cardNumber.slice(-4)}`,
          type: 'card'
        }
        break
      case 'upi':
        newMethod = {
          ...newMethod,
          name: 'UPI',
          details: paymentMethodForm.value.upiId,
          type: 'upi'
        }
        break
      case 'bank':
        newMethod = {
          ...newMethod,
          name: 'Bank Account',
          details: `****${paymentMethodForm.value.accountNumber.slice(-4)}`,
          type: 'bank'
        }
        break
    }

    paymentMethods.value.push(newMethod)
    
    // Reset form
    paymentMethodForm.value = {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      upiId: '',
      accountNumber: '',
      ifscCode: ''
    }
    
    showAddPaymentMethod.value = false
    Signal.success('Payment method added successfully')
  } catch (error) {
    Signal.error('Failed to add payment method')
  }
}

// Load payments data
const loadPayments = async () => {
  try {
    // Example API call using DataForge
    // const response = await request.post('/api/list/Payment:userPayments')
    // if (!response.error) {
    //   payments.value = response.data.items
    // }
  } catch (error) {
    console.error('Failed to load payments:', error)
  }
}

onMounted(() => {
  loadPayments()
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
