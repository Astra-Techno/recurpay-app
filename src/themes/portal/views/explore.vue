<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Explore</h1>
        <p class="text-gray-600 mt-1">Discover new services and offers</p>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="relative">
      <Icon name="Search" :size="20" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search services, categories, or offers..."
        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <!-- Categories -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
      
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectCategory(category)"
          class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          :class="{ 'border-blue-500 bg-blue-50': selectedCategory?.id === category.id }"
        >
          <div class="p-3 rounded-full mb-2" :style="{ backgroundColor: category.color + '20' }">
            <Icon :name="category.icon" :size="24" :style="{ color: category.color }" />
          </div>
          <span class="text-sm font-medium text-gray-900">{{ category.name }}</span>
          <span class="text-xs text-gray-500">{{ category.count }} services</span>
        </button>
      </div>
    </div>

    <!-- Featured Offers -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Featured Offers</h2>
        <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="offer in featuredOffers"
          :key="offer.id"
          class="relative bg-gradient-to-r rounded-lg p-4 text-white overflow-hidden"
          :style="{ background: offer.gradient }"
        >
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-2">
              <img :src="offer.logo" :alt="offer.service" class="w-8 h-8 rounded" />
              <span class="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs font-medium">
                {{ offer.discount }}
              </span>
            </div>
            <h3 class="font-semibold mb-1">{{ offer.service }}</h3>
            <p class="text-sm opacity-90 mb-3">{{ offer.description }}</p>
            <button class="bg-white text-gray-900 px-3 py-1 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors">
              Get Offer
            </button>
          </div>
          <div class="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
        </div>
      </div>
    </div>

    <!-- Popular Services -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Popular Services</h2>
        <div class="flex space-x-2">
          <button
            v-for="filter in popularFilters"
            :key="filter"
            @click="popularFilter = filter"
            class="px-3 py-1 text-sm rounded-full transition-colors"
            :class="popularFilter === filter 
              ? 'bg-blue-100 text-blue-700 font-medium' 
              : 'text-gray-600 hover:text-gray-900'"
          >
            {{ filter }}
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="service in filteredPopularServices"
          :key="service.id"
          class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
          @click="viewService(service)"
        >
          <div class="flex items-start space-x-3">
            <img :src="service.logo" :alt="service.name" class="w-12 h-12 rounded-lg border border-gray-200" />
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">{{ service.name }}</h3>
              <p class="text-sm text-gray-500 mb-2">{{ service.category }}</p>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-900">₹{{ formatCurrency(service.price) }}/{{ service.billing }}</span>
                <div class="flex items-center space-x-1">
                  <Icon name="Star" :size="14" class="text-yellow-400 fill-current" />
                  <span class="text-sm text-gray-600">{{ service.rating }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-3 flex items-center justify-between">
            <span class="text-xs text-gray-500">{{ service.users }} users</span>
            <button class="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors">
              Add Service
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Trending Now -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Trending Now</h2>
      
      <div class="space-y-3">
        <div
          v-for="(trend, index) in trendingServices"
          :key="trend.id"
          class="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          @click="viewService(trend)"
        >
          <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-sm font-bold text-blue-600">{{ index + 1 }}</span>
          </div>
          
          <img :src="trend.logo" :alt="trend.name" class="w-10 h-10 rounded-lg border border-gray-200" />
          
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">{{ trend.name }}</h3>
            <p class="text-sm text-gray-500">{{ trend.category }}</p>
          </div>
          
          <div class="text-right">
            <p class="text-sm font-medium text-gray-900">₹{{ formatCurrency(trend.price) }}</p>
            <div class="flex items-center space-x-1">
              <Icon name="TrendingUp" :size="12" class="text-green-500" />
              <span class="text-xs text-green-600">+{{ trend.growth }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Service Detail Modal -->
    <transition name="modal-fade">
      <div v-if="selectedService" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900">Service Details</h2>
              <button @click="selectedService = null" class="text-gray-400 hover:text-gray-600">
                <Icon name="X" :size="20" />
              </button>
            </div>

            <div class="space-y-4">
              <!-- Service Header -->
              <div class="flex items-center space-x-4">
                <img :src="selectedService.logo" :alt="selectedService.name" class="w-16 h-16 rounded-lg border border-gray-200" />
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ selectedService.name }}</h3>
                  <p class="text-gray-500">{{ selectedService.category }}</p>
                  <div class="flex items-center space-x-2 mt-1">
                    <div class="flex items-center space-x-1">
                      <Icon name="Star" :size="14" class="text-yellow-400 fill-current" />
                      <span class="text-sm text-gray-600">{{ selectedService.rating }}</span>
                    </div>
                    <span class="text-gray-300">•</span>
                    <span class="text-sm text-gray-600">{{ selectedService.users }} users</span>
                  </div>
                </div>
              </div>

              <!-- Pricing -->
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Price</span>
                  <span class="text-lg font-semibold text-gray-900">₹{{ formatCurrency(selectedService.price) }}/{{ selectedService.billing }}</span>
                </div>
              </div>

              <!-- Description -->
              <div>
                <h4 class="font-medium text-gray-900 mb-2">About</h4>
                <p class="text-sm text-gray-600">{{ selectedService.description || 'No description available.' }}</p>
              </div>

              <!-- Features -->
              <div v-if="selectedService.features">
                <h4 class="font-medium text-gray-900 mb-2">Features</h4>
                <ul class="space-y-1">
                  <li v-for="feature in selectedService.features" :key="feature" class="flex items-center space-x-2 text-sm text-gray-600">
                    <Icon name="Check" :size="14" class="text-green-500" />
                    <span>{{ feature }}</span>
                  </li>
                </ul>
              </div>

              <!-- Action Buttons -->
              <div class="flex space-x-3 pt-4">
                <button
                  @click="selectedService = null"
                  class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  @click="addService(selectedService)"
                  class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Service
                </button>
              </div>
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

useCurrentTitle('Explore - RecurPay')

const router = useRouter()
const request = useApiRequest()

// Reactive data
const searchQuery = ref('')
const selectedCategory = ref(null)
const popularFilter = ref('All')
const selectedService = ref(null)

const categories = ref([
  { id: 1, name: 'Entertainment', icon: 'Play', color: '#e11d48', count: 25 },
  { id: 2, name: 'Utilities', icon: 'Zap', color: '#f59e0b', count: 18 },
  { id: 3, name: 'Shopping', icon: 'ShoppingBag', color: '#10b981', count: 32 },
  { id: 4, name: 'Food', icon: 'UtensilsCrossed', color: '#f97316', count: 15 },
  { id: 5, name: 'Transport', icon: 'Car', color: '#3b82f6', count: 12 },
  { id: 6, name: 'Health', icon: 'Heart', color: '#ec4899', count: 8 }
])

const featuredOffers = ref([
  {
    id: 1,
    service: 'Netflix Premium',
    description: 'Get 3 months free on annual plan',
    discount: '25% OFF',
    logo: '/api/placeholder/32/32',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    service: 'Spotify Family',
    description: 'Share with 6 family members',
    discount: '2 Months Free',
    logo: '/api/placeholder/32/32',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 3,
    service: 'Amazon Prime',
    description: 'Free delivery + Prime Video',
    discount: '₹500 OFF',
    logo: '/api/placeholder/32/32',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  }
])

const popularServices = ref([
  {
    id: 1,
    name: 'Netflix',
    category: 'Entertainment',
    price: 649,
    billing: 'month',
    rating: 4.8,
    users: '2.1M',
    logo: '/api/placeholder/48/48',
    type: 'Entertainment',
    description: 'Stream unlimited movies and TV shows',
    features: ['4K Ultra HD', 'Multiple profiles', 'Download for offline viewing', 'No ads']
  },
  {
    id: 2,
    name: 'Spotify Premium',
    category: 'Music',
    price: 119,
    billing: 'month',
    rating: 4.7,
    users: '1.8M',
    logo: '/api/placeholder/48/48',
    type: 'Entertainment',
    description: 'Ad-free music streaming with offline downloads',
    features: ['Ad-free listening', 'Offline downloads', 'High quality audio', 'Unlimited skips']
  },
  {
    id: 3,
    name: 'Amazon Prime',
    category: 'Shopping',
    price: 1499,
    billing: 'year',
    rating: 4.6,
    users: '3.2M',
    logo: '/api/placeholder/48/48',
    type: 'Shopping',
    description: 'Free delivery, Prime Video, and more benefits',
    features: ['Free delivery', 'Prime Video', 'Prime Music', 'Early access to deals']
  },
  {
    id: 4,
    name: 'Jio Fiber',
    category: 'Internet',
    price: 699,
    billing: 'month',
    rating: 4.3,
    users: '890K',
    logo: '/api/placeholder/48/48',
    type: 'Utilities',
    description: 'High-speed fiber internet connection',
    features: ['100 Mbps speed', '24/7 support', 'Free installation', 'No data limit']
  },
  {
    id: 5,
    name: 'Swiggy One',
    category: 'Food Delivery',
    price: 149,
    billing: 'month',
    rating: 4.4,
    users: '1.2M',
    logo: '/api/placeholder/48/48',
    type: 'Food',
    description: 'Free delivery on food orders',
    features: ['Free delivery', 'Extra discounts', 'Priority support', 'No surge pricing']
  },
  {
    id: 6,
    name: 'Ola Electric',
    category: 'Transport',
    price: 99,
    billing: 'month',
    rating: 4.2,
    users: '450K',
    logo: '/api/placeholder/48/48',
    type: 'Transport',
    description: 'Electric scooter subscription service',
    features: ['Unlimited rides', 'Free maintenance', 'Insurance included', '24/7 support']
  }
])

const trendingServices = ref([
  {
    id: 1,
    name: 'Disney+ Hotstar',
    category: 'Entertainment',
    price: 299,
    logo: '/api/placeholder/40/40',
    growth: 15
  },
  {
    id: 2,
    name: 'Zomato Pro',
    category: 'Food',
    price: 149,
    logo: '/api/placeholder/40/40',
    growth: 12
  },
  {
    id: 3,
    name: 'Uber One',
    category: 'Transport',
    price: 149,
    logo: '/api/placeholder/40/40',
    growth: 8
  },
  {
    id: 4,
    name: 'Adobe Creative',
    category: 'Software',
    price: 1675,
    logo: '/api/placeholder/40/40',
    growth: 22
  },
  {
    id: 5,
    name: 'Gym Membership',
    category: 'Health',
    price: 2000,
    logo: '/api/placeholder/40/40',
    growth: 18
  }
])

const popularFilters = ['All', 'Entertainment', 'Utilities', 'Shopping', 'Food', 'Transport']

// Computed
const filteredPopularServices = computed(() => {
  let filtered = popularServices.value

  if (selectedCategory.value) {
    filtered = filtered.filter(service => 
      service.type === selectedCategory.value.name || 
      service.category.toLowerCase().includes(selectedCategory.value.name.toLowerCase())
    )
  }

  if (popularFilter.value !== 'All') {
    filtered = filtered.filter(service => 
      service.type === popularFilter.value || 
      service.category.toLowerCase().includes(popularFilter.value.toLowerCase())
    )
  }

  if (searchQuery.value) {
    filtered = filtered.filter(service =>
      service.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  return filtered
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN').format(amount)
}

const selectCategory = (category) => {
  selectedCategory.value = selectedCategory.value?.id === category.id ? null : category
}

const viewService = (service) => {
  selectedService.value = service
}

const addService = async (service) => {
  try {
    // API call to add service to user's subscriptions
    // const response = await request.post('/api/task/Service:addUserService', {
    //   serviceId: service.id,
    //   planType: 'monthly' // or get from user selection
    // })
    // if (!response.error) {
    //   Signal.success(`${service.name} added to your services`)
    //   selectedService.value = null
    //   router.push('/services')
    // }
    
    Signal.success(`${service.name} added to your services`)
    selectedService.value = null
    router.push('/services')
  } catch (error) {
    Signal.error('Failed to add service')
  }
}

// Load explore data
const loadExploreData = async () => {
  try {
    // Example API calls using DataForge
    // const categoriesResponse = await request.post('/api/all/ServiceCategory:list')
    // if (!categoriesResponse.error) {
    //   categories.value = categoriesResponse.data
    // }

    // const servicesResponse = await request.post('/api/list/Service:popular')
    // if (!servicesResponse.error) {
    //   popularServices.value = servicesResponse.data.items
    // }

    // const offersResponse = await request.post('/api/all/Offer:featured')
    // if (!offersResponse.error) {
    //   featuredOffers.value = offersResponse.data
    // }
  } catch (error) {
    console.error('Failed to load explore data:', error)
  }
}

onMounted(() => {
  loadExploreData()
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
