<template>
    <div class="min-h-screen">
      <!-- Back Button -->
      <div v-if="currentSection" class="mb-4">
        <span @click="currentSection = null" class="font-black cursor-pointer text-2xl text-[var(--ui-background)]">←</span>
      </div>
  
      <!-- Main Summary View -->
      <div v-if="!currentSection">
        <!-- Profile Header -->
        <div class="flex items-center gap-4 mb-6">
          <img :src="tenant.avatar" class="w-14 h-14 rounded-full object-cover" alt="Avatar" />
          <div>
            <h2 class="text-lg font-semibold truncate">{{ tenant.name }}</h2>
            <p class="text-sm text-gray-500">Tenant Details</p>
          </div>
        </div>
  
        <!-- Info Cards -->
        <div class="space-y-4">
          <!-- Balance Card -->
          <div class="flex items-center justify-between bg-white rounded-xl p-4 shadow">
            <div class="flex items-center gap-3">
              <div class="bg-gray-100 p-2 rounded-lg">
                <Icon icon="material-symbols:account-balance-wallet-outline" class="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p class="text-sm text-gray-800 font-medium">₹0.00</p>
                <p class="text-xs text-gray-500">Pending Rent Balance</p>
              </div>
            </div>
            <button class="text-sm text-green-600 font-semibold px-3 py-1 bg-green-50 rounded-lg">ADD PAYMENT</button>
          </div>
  
          <!-- Info Items -->
          <InfoItem icon="material-symbols:list-alt" title="All Transactions" subtitle="Payments, refunds, charges" @click="currentSection = 'transactions'" />
  
          <InfoItem icon="material-symbols:account-balance" title="Bank Details" subtitle="Linked account for rent auto-pay" buttonText="VERIFY" buttonColor="text-green-600 bg-green-100" showDot @click="currentSection = 'bank-details'" />
  
          <InfoItem icon="material-symbols:support-agent" title="Customer Support" subtitle="Chat, Call, Help Center" @click="currentSection = 'support'" />
  
          <InfoItem icon="material-symbols:bar-chart-rounded" title="Reports" subtitle="Rent receipts, payment history" @click="currentSection = 'reports'" />
        </div>
      </div>
  
      <!-- Detail Sections -->
      <div v-else>
        <component :is="sectionComponent" :tenant="tenant" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import InfoItem from '@/components/elements/InfoItem.vue'
  import Transactions from './Transactions.vue'
  import BankDetails from './BankDetail.vue'
  import Reports from './Report.vue'
  import Support from './Support.vue'
  
  const route = useRoute()
  const tenantId = route.params.id
  
  const tenant = ref({
    id: tenantId,
    name: 'Shanmugakani Vignesh',
    avatar: 'https://i.pravatar.cc/100?img=15',
    email: 'shan@example.com',
    phone: '+91 98765 43210',
    accountNumber: 'XXXX-1234',
    bankName: 'Axis Bank'
  })
  
  const currentSection = ref(null)
  
  const sectionComponent = computed(() => {
    switch (currentSection.value) {
      case 'transactions': return Transactions
      case 'bank-details': return BankDetails
      case 'reports': return Reports
      case 'support': return Support
      default: return null
    }
  })
  </script>