<template>
  <div class="flex space-x-2 mb-4">
    <Icon name="IconTenant" />   
    <h1 class="text-2xl font-black italic" v-if="property_id == 0">My Tenants</h1>
    <h1 class="text-2xl font-black italic" v-else>{{property.name}} - Tenants</h1>
  </div>

  

  <list
    class="w-full"
    tmpl="custom"
    :data-url="dataUrl"
    :sortBy="'pt.id'"
    :sortOrder="'desc'"
    :filter-toggle="false"
    :messages="{ empty: 'There are no tenants added!' }"
    :page-limit="10"
    :search="false"
  >
    <template #body="{ rows }">
      <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        <router-link
          v-for="tenant in rows"
          :key="tenant.id"
          :to="{ name: 'TenantDetail', params: { id: tenant.id } }"
        >
          <div
            class="bg-white rounded-2xl shadow-md p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4"
          >
            <!-- Avatar -->
            <img
              :src="tenant.avatar"
              alt="Avatar"
              class="w-16 h-16 rounded-full object-cover"
            />

            <!-- Tenant Info -->
            <div class="text-center sm:text-left">
              <h3 class="text-lg font-black italic ">
                {{ tenant.name }}
              </h3>
              <p class="font-bold">{{ tenant.property }}</p>
              <p >{{ tenant.address }}</p>

              <!-- Status -->
              <span
                :class="[
                  'text-xs mt-2 inline-block rounded-full px-2 py-1',
                  tenant.status === 'active'
                    ? 'bg-green-100 text-green-600'
                    : tenant.status === 'vacated'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-red-100 text-red-600',
                ]"
              >
                {{ tenant.status.toUpperCase() }}
              </span>
            </div>
          </div>
        </router-link>
      </div>
    </template>
  </list>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useMeta } from '@/composables/use-meta'
import List from '@/components/List/List.vue'
import useApiRequest from '@/composables/request'
import { useRoute } from 'vue-router'
useMeta({ title: 'My Tenants' })  

const router = useRoute()
const property_id = ref(0)
const property = ref({})

property_id.value = router.params.id || 0;
const dataUrl = computed(() => {
  return property_id.value > 0
    ? `list/Tenants?property_id=${property_id.value}`
    : `list/Tenants`
})

onMounted(async () => {
 
  
  if (!property_id.value) 
  {
    return
  }
  const request = useApiRequest()
  const  response  = await request.fetch('/item/Properties?id=' + property_id.value)
  
  if (response.data ) {
    property.value = response.data;
  }
 
})
</script>
