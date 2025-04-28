<template>
    <div class="space-y-6 animate-fade-in">
  
      <!-- Title -->
      <h2 v-if="title" class="text-lg font-black text-gray-800 italic">{{ title }}</h2>
  
      <!-- List Component -->
      <list ref="rowContents" class="w-full" tmpl="custom" :data-url="dataUrl"
        :sortBy="'p.id'" :sortOrder="'desc'"
        :filter-toggle="false" :messages="{ empty: 'There are no transactions found.' }"
        :page-limit="pageLimit" :show-pagination="pagination" :search="false">
  
        <template #body="{ rows, isLoading }">
  
          <!-- Skeleton Loader -->
          <template v-if="isLoading">
            <div class="space-y-4">
              <div v-for="n in pageLimit" :key="n"
                class="bg-gray-100 rounded-2xl p-4 animate-pulse space-y-3">
                <div class="h-4 bg-gray-300 rounded w-1/3"></div>
                <div class="h-3 bg-gray-200 rounded w-2/3"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </template>
  
          <!-- Transaction Cards -->
          <template v-else>
            <div class="space-y-4">
              <TransactionCard
                v-for="payment in rows"
                :key="payment.id"
                :transaction="payment"
                :display-type="display"
                class="bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 hover:scale-[1.01] transition-transform duration-300 ease-out"
              />
            </div>
  
            <!-- No Transactions -->
            <div v-if="rows.length === 0" class="text-center text-gray-400 text-sm py-10">
              No Recent Payments Found
            </div>
  
            <!-- View All Button -->
            <div v-if="rowContents?.total > pageLimit && pagination === false" class="text-center mt-6">
              <router-link :to="{ name: 'Transactions', params: { property_id: propertyId } }">
                <button class="text-xs w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-semibold transition">
                  View All
                </button>
              </router-link>
            </div>
          </template>
  
        </template>
      </list>
  
    </div>
  </template>
  
  <script setup>
  import { computed, ref } from 'vue'
  import List from '@/components/List/List.vue'
  import TransactionCard from '@/components/common/TransactionCard.vue'
  import { useAppStore } from '@/stores/index'
  
  const user = useAppStore().getUser()
  
  const props = defineProps({
    title: { type: String, default: '' },
    display: { type: String, default: 'list' },
    pagination: { type: Boolean, default: false },
    pageLimit: { type: Number, default: 2 },
    propertyId: { type: Number, default: null },
    status: { type: String, default: 'all' },
  })
  
  const rowContents = ref([])
  
  const dataUrl = computed(() => {
    let pay_status = ''
    if (props.status === 'pending') pay_status = 'Pending=1'
    else if (props.status === 'due') pay_status = 'Due=1'
  
    const query = pay_status ? `&${pay_status}` : ''
  
    if (props.propertyId > 0) {
      return `list/PaymentTransactions?property_id=${props.propertyId}${query}`
    } else {
      return `list/PaymentTransactions${query}`
    }
  })
  </script>
  
  <style scoped>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out;
  }
  </style>
  