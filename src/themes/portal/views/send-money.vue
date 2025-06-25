<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <button @click="$router.back()" class="p-2 hover:bg-gray-100 rounded-lg">
          <Icon name="ArrowLeft" :size="20" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Send Money</h1>
          <p class="text-gray-600 mt-1">Transfer money to friends and family</p>
        </div>
      </div>
    </div>

    <!-- Send Money Form -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <form @submit.prevent="sendMoney" class="space-y-6">
        <!-- Recipient -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Send To</label>
          <div class="relative">
            <input
              v-model="form.recipient"
              type="text"
              placeholder="Enter phone number, UPI ID, or search contacts"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button 
              type="button"
              @click="showContacts = true"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Icon name="Users" :size="20" />
            </button>
          </div>
        </div>

               <!-- Amount -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
            <input
              v-model="form.amount"
              type="number"
              placeholder="0.00"
              class="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="1"
              step="0.01"
            />
          </div>
          
          <!-- Quick Amount Buttons -->
          <div class="flex space-x-2 mt-3">
            <button
              v-for="amount in quickAmounts"
              :key="amount"
              type="button"
              @click="form.amount = amount"
              class="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              ₹{{ amount }}
            </button>
          </div>
        </div>

        <!-- Message -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
          <textarea
            v-model="form.message"
            placeholder="Add a note..."
            rows="3"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
        </div>

        <!-- Payment Method -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
          <div class="space-y-2">
            <label
              v-for="method in paymentMethods"
              :key="method.id"
              class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors"
              :class="{ 'border-blue-500 bg-blue-50': form.paymentMethod === method.id }"
            >
              <input
                v-model="form.paymentMethod"
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

        <!-- Send Button -->
        <button
          type="submit"
          :disabled="!form.recipient || !form.amount || sending"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          <span v-if="sending">Sending...</span>
          <span v-else>Send ₹{{ form.amount || '0' }}</span>
        </button>
      </form>
    </div>

    <!-- Recent Recipients -->
    <div v-if="recentRecipients.length" class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Recipients</h3>
      
      <div class="grid grid-cols-4 gap-4">
        <button
          v-for="recipient in recentRecipients"
          :key="recipient.id"
          @click="selectRecipient(recipient)"
          class="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <img :src="recipient.avatar" :alt="recipient.name" class="w-12 h-12 rounded-full mb-2" />
          <span class="text-sm font-medium text-gray-900 truncate w-full text-center">{{ recipient.name }}</span>
        </button>
      </div>
    </div>

    <!-- Contacts Modal -->
    <transition name="modal-fade">
      <div v-if="showContacts" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900">Select Contact</h2>
              <button @click="showContacts = false" class="text-gray-400 hover:text-gray-600">
                <Icon name="X" :size="20" />
              </button>
            </div>
            
            <!-- Search -->
            <div class="mt-4">
              <input
                v-model="contactSearch"
                type="text"
                placeholder="Search contacts..."
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div class="overflow-y-auto max-h-96">
            <div class="p-4 space-y-2">
              <button
                v-for="contact in filteredContacts"
                :key="contact.id"
                @click="selectContact(contact)"
                class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <img :src="contact.avatar" :alt="contact.name" class="w-10 h-10 rounded-full" />
                <div>
                  <p class="font-medium text-gray-900">{{ contact.name }}</p>
                  <p class="text-sm text-gray-500">{{ contact.phone }}</p>
                </div>
              </button>
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
import Signal from '@/composables/signal'
import useApiRequest from '@/composables/request'

useCurrentTitle('Send Money - RecurPay')

const router = useRouter()
const request = useApiRequest()

// Reactive data
const sending = ref(false)
const showContacts = ref(false)
const contactSearch = ref('')

const form = ref({
  recipient: '',
  amount: '',
  message: '',
  paymentMethod: 'upi'
})

const quickAmounts = [100, 500, 1000, 2000, 5000]

const paymentMethods = ref([
  {
    id: 'upi',
    name: 'UPI',
    description: 'Instant transfer via UPI',
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

const recentRecipients = ref([
  {
    id: 1,
    name: 'John Doe',
    phone: '+91 98765 43210',
    avatar: '/api/placeholder/48/48'
  },
  {
    id: 2,
    name: 'Jane Smith',
    phone: '+91 87654 32109',
    avatar: '/api/placeholder/48/48'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    phone: '+91 76543 21098',
    avatar: '/api/placeholder/48/48'
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    phone: '+91 65432 10987',
    avatar: '/api/placeholder/48/48'
  }
])

const contacts = ref([
  {
    id: 1,
    name: 'Alice Brown',
    phone: '+91 98765 43210',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 2,
    name: 'Bob Davis',
    phone: '+91 87654 32109',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 3,
    name: 'Carol White',
    phone: '+91 76543 21098',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 4,
    name: 'David Miller',
    phone: '+91 65432 10987',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 5,
    name: 'Eva Garcia',
    phone: '+91 54321 09876',
    avatar: '/api/placeholder/40/40'
  }
])

// Computed
const filteredContacts = computed(() => {
  if (!contactSearch.value) return contacts.value
  
  return contacts.value.filter(contact =>
    contact.name.toLowerCase().includes(contactSearch.value.toLowerCase()) ||
    contact.phone.includes(contactSearch.value)
  )
})

// Methods
const selectRecipient = (recipient) => {
  form.value.recipient = recipient.phone
}

const selectContact = (contact) => {
  form.value.recipient = contact.phone
  showContacts.value = false
  contactSearch.value = ''
}

const sendMoney = async () => {
  try {
    sending.value = true
    
    // API call to send money
    // const response = await request.post('/api/task/Payment:sendMoney', form.value)
    // if (!response.error) {
    //   Signal.success('Money sent successfully!')
    //   router.push('/payments')
    // }
    
    // Mock success for demo
    await new Promise(resolve => setTimeout(resolve, 2000))
    Signal.success('Money sent successfully!')
    router.push('/payments')
    
  } catch (error) {
    Signal.error('Failed to send money')
  } finally {
    sending.value = false
  }
}

const loadRecentRecipients = async () => {
  try {
    // API call to load recent recipients
    // const response = await request.post('/api/list/Payment:recentRecipients')
    // if (!response.error) {
    //   recentRecipients.value = response.data.items
    // }
  } catch (error) {
    console.error('Failed to load recent recipients:', error)
  }
}

onMounted(() => {
  loadRecentRecipients()
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
