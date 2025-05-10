<template>
  <div class="max-w-3xl mx-auto p-4">
    <div class="bg-white rounded-xl shadow-md p-6 space-y-6">
    

      <!-- Basic Info -->
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-bold">
          {{ tenantInitials }}
        </div>
        <div>
          <p class="text-lg font-semibold text-gray-900">{{ tenant.name }}</p>
          <p class="text-sm text-gray-600" v-if="tenant.email">{{ tenant.email}}</p>
          <p class="text-sm text-gray-600">{{ tenant.phone || 'No phone number' }}</p>
        </div>
      </div>

      <!-- Lease / Address Info -->
      <div v-if="tenant.address" class="pt-2 border-t">
        <p class="text-sm text-slate-600">Current Address</p>
        <p class="text-base text-gray-800 font-medium">{{ tenant.address }}</p>
      </div>

      <!-- Future Enhancements -->
      <div class="pt-4 border-t">
        <p class="text-sm text-slate-500 italic">Additional details like leases, documents, and activity logs can appear here.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted,computed,getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import useApiRequest from '@/composables/request'

const route = useRoute()
const request = useApiRequest()
const tenant = ref({})

onMounted(async () => {
  loadData(getCurrentInstance().proxy)
})
const loadData = async (proxy) => {
  const tenantId = route.params.id
  const response = await request.post(`entity/User/${tenantId}`)
  if (response.error) {
    console.error(response.message)
    return
  }
  tenant.value = response.data
  proxy.$setHeader('Tenant Detail', '', true, 'IconHome')
}

const tenantInitials = computed(() => {
  if (!tenant.value.name) return '?'
  return tenant.value.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
})
</script>
