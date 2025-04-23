<template>
  <div class="flex space-x-2 mb-4">
   
    <!--<h1 class="text-2xl font-black italic" v-if="property_id == 0">My Tenants</h1>
    <h1 class="text-2xl font-black italic" v-else>{{property.name}} - Tenants</h1>-->
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
      <div class=" px-4">
					<h2 class="text-base font-bold mb-2 leading-6 sticky top-0 bg-white z-10 py-2 shadow-sm">
            <template v-if="property_id == 0">My Tenants</template>
            <template v-else>
              
              {{ property.name }} - Tenants
              

            </template>
          </h2>
					<div v-for="tenant in rows"
						class="bg-gray-100 rounded-xl p-4 flex items-center justify-between  my-2">
						<div class="flex items-center gap-3">
							<div class="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
								<img :src="tenant.avatar" alt="Avatar" class="w-16 h-16 rounded-full object-cover" />
							</div>
							<div>
								<p class="text-base font-bold italic">{{ tenant.name }}</p>
								<p class="text-sm text-blue-600" :class="[
									'text-xs mt-2 inline-block rounded-full px-2 py-1',
									tenant.status === 'active'
										? 'bg-green-100 text-green-600'
										: tenant.status === 'vacated'
											? 'bg-yellow-100 text-yellow-600'
											: 'bg-red-100 text-red-600',
								]">{{ tenant.status.toUpperCase() }}</p>
							</div>
						</div>
						<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2"
							viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
						</svg>
					</div>				
					
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
import { getCurrentInstance } from 'vue'
onMounted(async () => {
 
  const { proxy } = getCurrentInstance()
  if (!property_id.value) 
  {
    proxy.$setHeader('My Tenants', '', true, 'IconHome')
    return
  }
  const request = useApiRequest()
  const  response  = await request.fetch('/item/Properties?id=' + property_id.value)
  
  if (response.data ) {
    property.value = response.data;
  }
  proxy.$setHeader(property.value.name+" - Tenants", '', true, 'IconHome')
})


</script>
