<template>
    <div class="space-y-4">
      <!-- Top Section -->
      <div class="flex justify-between items-center py-2">
        <p class="text-base font-bold text-gray-800" v-if="!grouped">{{ title }}</p>
        <router-link v-if="!grouped" :to="{ name: 'AddPayment', params: { property_id: propertyId } }">
          <button class="text-xs bg-blue-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-blue-600 transition">
            Add Payment
          </button>
        </router-link>
      </div>
  
      <!-- List Section -->
      <list
        ref="rowContents"
        class="w-full"
        tmpl="custom"
        :data-url="dataUrl"
        :sortBy="'p.id'"
        :sortOrder="'desc'"
        :filter-toggle="false"
        :messages="{ empty: 'No Payments to List' }"
        :page-limit="pageLimit"
        :show-pagination="pagination"
        :search="false"
      >
        <template #body="{ rows, loading }">
          <template v-if="loading">
            <!-- Skeleton Loader -->
            <div class="space-y-4 animate-fade-in">
              <div v-for="n in pageLimit" :key="n" class="bg-gray-100 rounded-2xl p-4 animate-pulse space-y-2 shadow-sm">
                <div class="h-4 bg-gray-300 rounded w-1/3"></div>
                <div class="h-3 bg-gray-200 rounded w-2/3"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </template>
  
          <template v-else-if="grouped">
            <!-- Grouped View -->
            <div class="space-y-2 animate-fade-in">
              <div v-for="(payments, groupTitle) in rows" :key="groupTitle" class="bg-white rounded-2xl shadow p-4 space-y-4">
                <div class="flex justify-between items-start pb-3 border-b">
                  <div>
                    <h2 class="text-lg font-bold text-gray-800">{{ groupTitle }}</h2>
                    <p class="text-xs text-gray-500">{{ payments[0]?.address1 }}</p>
                  </div>
                  <router-link :to="{ name: 'AddPayment', params: { property_id: payments[0].property_id } }">
                    <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full font-semibold hover:bg-blue-600 transition">
                      Add
                    </button>
                  </router-link>
                </div>
                <div class="space-y-3 pt-2">
                  <PaymentCard
                    v-for="payment in payments"
                    :key="payment.id"
                    :payment="payment"
                    displayType="dashboard"
                    class="hover:scale-[1.01] transition-transform transform"
                  />
                </div>
              </div>
            </div>
          </template>
  
          <template v-else>
            <!-- Flat List -->
            <div class="space-y-4 animate-fade-in">
              <PaymentCard
                v-for="payment in rows"
                :key="payment.id"
                :payment="payment"
                displayType="dashboard"
                class="hover:scale-[1.01] transition-transform transform"
              />
            </div>
          </template>
  
          <!-- View All Button -->
          <div v-if="rowContents?.total > 2 && pagination === false" class="text-center mt-8">
            <router-link :to="{ name: 'PaymentsList', params: { property_id: propertyId } }">
              <button
                class="text-xs w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full font-bold tracking-wide transition"
              >
                View All Payments
              </button>
            </router-link>
          </div>
  
        </template>
      </list>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, defineProps } from 'vue'
  import List from '@/components/List/List.vue'
  import { useAppStore } from '@/stores/index'
  import PaymentCard from '@/components/common/PendingPaymentCard.vue'
  
  const user = useAppStore().getUser()
  
  const props = defineProps({
    title: { type: String, default: 'Payments' },
    display: { type: String, default: 'dashboard' },
    pagination: { type: Boolean, default: false },
    pageLimit: { type: Number, default: 2 },
    propertyId: { type: Number, default: null },
    status: { type: String, default: 'all' }
  })
  
  const grouped = ref(false)
  
  const dataUrl = computed(() => {
    let pay_status = ''
    if (props.status === 'pending') pay_status = 'Pending=1'
    else if (props.status === 'due') pay_status = 'Due=1'
  
    const query = pay_status ? `&${pay_status}` : ''
  
    if (props.propertyId > 0) {
      return `list/Payments?property_id=${props.propertyId}${query}`
    } else {
      grouped.value = true
      return `group-list/Payments:allPayments${pay_status ? `?${pay_status}` : ''}`
    }
  })
  
  const rowContents = ref([])
  </script>
  
  <style scoped>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out;
  }
  </style>
  