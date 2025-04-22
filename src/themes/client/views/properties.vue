<template>
	<section class="px-4 pb-4">
	  
	  <list
		class="w-full"
		tmpl="custom"
		:data-url="'list/Properties'"
		:sortBy="'p.id'"
		:sortOrder="'desc'"
		:filter-toggle="false"
		:messages="{ empty: 'There are no properties added!' }"
		:page-limit="10"
		:search="false"
	  >
		<template #body="{ rows }">
		  <div class="space-y-2">
			<div
			  v-for="property in rows"
			  :key="property.id"
			  class="bg-white p-4 rounded shadow"
			>
			  <div class="flex justify-between items-center mb-2">
				<p class="font-semibold">{{ property.name }}</p>
				<router-link :to="{ name: 'PropertyView', params: { id: property.id } }">
				  <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">View</button>
				</router-link>
			  </div>
			  <div class="flex gap-2">
				<router-link :to="{ name: 'AddTenant', params: { property_id: property.id } }">
				  <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">Add Tenant</button>
				</router-link>
				<router-link :to="{ name: 'AddPayment', params: { property_id: property.id } }">
				  <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">Add Payment</button>
				</router-link>
			  </div>
			</div>
		  </div>
		</template>
	  </list>
	</section>
  </template>
  
  <script setup>
  import List from '@/components/List/List.vue'
  import { getCurrentInstance } from 'vue'

  getCurrentInstance().proxy.$setHeader('My Properties', '', true, 'IconHome')
  </script>