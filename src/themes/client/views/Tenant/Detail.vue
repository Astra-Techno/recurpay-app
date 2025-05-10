<template>
  <div class="min-h-screen bg-white p-4">
    <div class="max-w-md mx-auto space-y-4">
      <!-- Profile Card -->
      <div class="rounded-2xl p-4 flex items-center gap-4 shadow-md border border-gray-200">
        <div class="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-xl text-blue-700 font-bold">
          {{ tenantInitials }}
        </div>
        <div class="flex-1">
          <p class="text-lg font-semibold text-gray-900">{{ tenant.name }}</p>
          <p class="text-sm text-gray-700">{{ tenant.phone || 'No phone number' }}</p>
        </div>
        <span class="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Active</span>
      </div>

      <!-- Payment Summary -->
      <div class="rounded-2xl p-4 shadow-md border border-gray-200 space-y-2">
        <p class="font-semibold text-gray-800">Payment Summary</p>
        <div class="flex justify-between text-sm pt-2">
          <div>
            <p class="text-slate-500">Total Due</p>
            <p class="text-base font-semibold text-gray-900">₹{{ tenant.total_due || '0' }}</p>
          </div>
          <div class="text-right">
            <p class="text-slate-500">Upcoming Payments</p>
            <p class="text-base font-semibold text-gray-900">{{ tenant.upcoming_payments || '0' }}</p>
          </div>
        </div>
      </div>

      <!-- Lease Info -->
      <div class="rounded-2xl p-4 shadow-md border border-gray-200 space-y-2">
        <p class="font-semibold text-gray-800">Lease Info</p>
        <div class="flex justify-between text-sm pt-2">
          <div>
            <p class="text-slate-500">Move-in Date</p>
            <p class="text-base font-semibold text-gray-900">{{ tenant.move_in || 'NA' }}</p>
          </div>
          <div class="text-right">
            <p class="text-slate-500">Contract End Date</p>
            <p class="text-base font-semibold text-gray-900">{{ tenant.contract_end || 'NA' }}</p>
          </div>
        </div>
        <div class="pt-2">
          <p class="text-slate-500 text-sm">Deposit</p>
          <p class="text-base font-semibold text-gray-900">₹{{ tenant.deposit || '0' }}</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <button class="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-xl shadow-sm hover:bg-blue-700">
          Send Reminder
        </button>
        <button class="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-xl shadow-sm hover:bg-blue-700">
          Add Payment
        </button>
      </div>

      <button class="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-xl shadow-sm hover:bg-blue-700">
        View Payment History
      </button>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import useApiRequest from '@/composables/request'

const tenant = ref({})
const route = useRoute()
const request = useApiRequest()

onMounted(() => {
  loadData(getCurrentInstance().proxy)
})

const loadData = async (proxy) => {
  const tenantId = route.params.id || route.params.tenant_id
  const response = await request.post(`entity/User/${tenantId}`)
  if (!response.error) {
    tenant.value = {
      ...response.data,
      total_due: 15000,
      upcoming_payments: 1,
      move_in: 'Jan 10, 2024',
      contract_end: 'Jan 10, 2025',
      deposit: 30000
    }
  }
  proxy?.$setHeader?.('Tenant Details', '', true, 'IconUser')
}

const tenantInitials = computed(() => {
  if (!tenant.value.name) return '?'
  return tenant.value.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
})
</script>
