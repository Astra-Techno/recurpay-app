<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Services</h1>
        <p class="text-gray-600 mt-1">Manage your subscriptions and services</p>
      </div>
      <button 
        @click="showAddService = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
      >
        <Icon name="Plus" :size="16" />
        <span>Add Service</span>
      </button>
    </div>

    <!-- Filter Tabs -->
    <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
      <button
        v-for="tab in filterTabs"
        :key="tab.key"
        @click="activeFilter = tab.key"
        class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
        :class="activeFilter === tab.key 
          ? 'bg-white text-gray-900 shadow-sm' 
          : 'text-gray-600 hover:text-gray-900'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Services Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="service in filteredServices"
        :key="service.id"
        class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      >
        <!-- Service Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <img 
              :src="service.logo" 
              :alt="service.name" 
              class="w-12 h-12 rounded-lg border border-gray-200"
            />
            <div>
              <h3 class="font-semibold text-gray-900">{{ service.name }}</h3>
              <p class="text-sm text-gray-500">{{ service.category }}</p>
            </div>
          </div>
          
          <!-- Status Badge -->
          <span 
            class="px-2 py-1 text-xs font-medium rounded-full"
            :class="getStatusBadgeClass(service.status)"
          >
            {{ service.status }}
          </span>
        </div>

        <!-- Service Details -->
        <div class="space-y-3 mb-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Amount</span>
            <span class="font-semibold text-gray-900">₹{{ formatCurrency(service.amount) }}</span>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Billing Cycle</span>
            <span class="text-sm text-gray-900 capitalize">{{ service.billingCycle }}</span>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Next Payment</span>
            <span class="text-sm text-gray-900">{{ formatDate(service.nextPayment) }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-2">
          <button
            @click="editService(service)"
            class="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Edit
          </button>
          
          <button
            v-if="service.status === 'active'"
            @click="pauseService(service)"
            class="flex-1 bg-orange-100 text-orange-700 py-2 px-3 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
          >
            Pause
          </button>
          
          <button
            v-else-if="service.status === 'paused'"
            @click="resumeService(service)"
            class="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
          >
            Resume
          </button>
          
          <button
            @click="deleteService(service)"
            class="bg-red-100 text-red-700 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors"
          >
            <Icon name="Trash2" :size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredServices.length === 0" class="text-center py-12">
      <Icon name="Grid3X3" :size="48" class="text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No services found</h3>
      <p class="text-gray-500 mb-4">
        {{ activeFilter === 'all' ? 'Add your first service to get started' : `No ${activeFilter} services found` }}
      </p>
      <button 
        @click="showAddService = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add Service
      </button>
    </div>

    <!-- Add/Edit Service Modal -->
    <transition name="modal-fade">
      <div v-if="showAddService || editingService" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900">
                {{ editingService ? 'Edit Service' : 'Add New Service' }}
              </h2>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                <Icon name="X" :size="20" />
              </button>
            </div>

            <form @submit.prevent="saveService" class="space-y-4">
              <!-- Service Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Service</label>
                <select 
                  v-model="serviceForm.serviceId"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a service</option>
                  <option 
                    v-for="option in availableServices" 
                    :key="option.id" 
                    :value="option.id"
                  >
                    {{ option.name }}
                  </option>
                </select>
              </div>

              <!-- Amount -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                <input
                  v-model="serviceForm.amount"
                  type="number"
                  step="0.01"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <!-- Billing Cycle -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Billing Cycle</label>
                <select 
                  v-model="serviceForm.billingCycle"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <!-- Next Payment Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Next Payment Date</label>
                <input
                  v-model="serviceForm.nextPayment"
                  type="date"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <!-- Auto Pay -->
              <div class="flex items-center space-x-3">
                <input
                  v-model="serviceForm.autoPay"
                  type="checkbox"
                  id="autoPay"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="autoPay" class="text-sm text-gray-700">Enable Auto Pay</label>
              </div>

              <!-- Action Buttons -->
              <div class="flex space-x-3 pt-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {{ editingService ? 'Update' : 'Add' }} Service
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCurrentTitle } from '@/composables/use-meta'
import { formatDate, currency } from '@/composables/helper'
import Signal from '@/composables/signal'
import useApiRequest from '@/composables/request'

useCurrentTitle('Services - RecurPay')

const request = useApiRequest()

// Reactive data
const activeFilter = ref('all')
const showAddService = ref(false)
const editingService = ref(null)

const services = ref([
  {
    id: 1,
    name: 'Netflix',
    category: 'Entertainment',
    logo: '/api/placeholder/48/48',
    amount: 649,
    billingCycle: 'monthly',
    nextPayment: new Date(Date.now() + 86400000 * 5),
    status: 'active',
    autoPay: true
  },
  {
    id: 2,
    name: 'Spotify Premium',
    category: 'Music',
    logo: '/api/placeholder/48/48',
    amount: 119,
    billingCycle: 'monthly',
    nextPayment: new Date(Date.now() + 86400000 * 12),
    status: 'active',
    autoPay: true
  },
  {
    id: 3,
    name: 'Amazon Prime',
    category: 'Shopping',
    logo: '/api/placeholder/48/48',
    amount: 1499,
    billingCycle: 'yearly',
    nextPayment: new Date(Date.now() + 86400000 * 25),
    status: 'paused',
    autoPay: false
  }
])

const availableServices = ref([
  { id: 1, name: 'Netflix', category: 'Entertainment' },
  { id: 2, name: 'Spotify Premium', category: 'Music' },
  { id: 3, name: 'Amazon Prime', category: 'Shopping' },
  { id: 4, name: 'Disney+ Hotstar', category: 'Entertainment' },
  { id: 5, name: 'YouTube Premium', category: 'Entertainment' }
])

const serviceForm = ref({
  serviceId: '',
  amount: '',
  billingCycle: 'monthly',
  nextPayment: '',
  autoPay: true
})

const filterTabs = [
  { key: 'all', label: 'All Services' },
  { key: 'active', label: 'Active' },
  { key: 'paused', label: 'Paused' },
  { key: 'expired', label: 'Expired' }
]

// Computed
const filteredServices = computed(() => {
  if (activeFilter.value === 'all') return services.value
  return services.value.filter(service => service.status === activeFilter.value)
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN').format(amount)
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'paused':
      return 'bg-orange-100 text-orange-800'
    case 'expired':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const editService = (service) => {
  editingService.value = service
  serviceForm.value = {
    serviceId: service.serviceId || '',
    amount: service.amount,
    billingCycle: service.billingCycle,
    nextPayment: service.nextPayment.toISOString().split('T')[0],
    autoPay: service.autoPay
  }
}

const closeModal = () => {
  showAddService.value = false
  editingService.value = null
  serviceForm.value = {
    serviceId: '',
    amount: '',
    billingCycle: 'monthly',
    nextPayment: '',
    autoPay: true
  }
}

const saveService = async () => {
  try {
    if (editingService.value) {
      // Update existing service
      const index = services.value.findIndex(s => s.id === editingService.value.id)
      if (index !== -1) {
        services.value[index] = {
          ...services.value[index],
          ...serviceForm.value,
          nextPayment: new Date(serviceForm.value.nextPayment)
        }
      }
      Signal.success('Service updated successfully')
    } else {
      // Add new service
      const selectedService = availableServices.value.find(s => s.id == serviceForm.value.serviceId)
      const newService = {
        id: Date.now(),
        name: selectedService.name,
        category: selectedService.category,
        logo: '/api/placeholder/48/48',
        amount: parseFloat(serviceForm.value.amount),
        billingCycle: serviceForm.value.billingCycle,
        nextPayment: new Date(serviceForm.value.nextPayment),
        status: 'active',
        autoPay: serviceForm.value.autoPay
      }
      services.value.push(newService)
      Signal.success('Service added successfully')
    }
    
    closeModal()
  } catch (error) {
    Signal.error('Failed to save service')
  }
}

const pauseService = async (service) => {
  const result = await Signal.confirm(
    'Pause Service',
    `Are you sure you want to pause ${service.name}?`,
    'Pause'
  )
  
  if (result.isConfirmed) {
    service.status = 'paused'
    Signal.success(`${service.name} has been paused`)
  }
}

const resumeService = async (service) => {
  service.status = 'active'
  Signal.success(`${service.name} has been resumed`)
}

const deleteService = async (service) => {
  const result = await Signal.confirm(
    'Delete Service',
    `Are you sure you want to delete ${service.name}? This action cannot be undone.`,
    'Delete'
  )
  
  if (result.isConfirmed) {
    const index = services.value.findIndex(s => s.id === service.id)
    if (index !== -1) {
      services.value.splice(index, 1)
      Signal.success(`${service.name} has been deleted`)
    }
  }
}

// Load services data
const loadServices = async () => {
  try {
    // Example API call using DataForge
    // const response = await request.post('/api/list/Service:userServices')
    // if (!response.error) {
    //   services.value = response.data.items
    // }
  } catch (error) {
    console.error('Failed to load services:', error)
  }
}

onMounted(() => {
  loadServices()
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
