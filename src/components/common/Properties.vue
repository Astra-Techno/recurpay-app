<template>
	
	<section  class="px-4 pb-4" v-show="rowContents?.total > 0">
		<h3 class="text-md font-semibold mb-2 flex justify-between">🏡 {{title}}
			<router-link :to="{ name: 'AddProperty', params: { mode: 'add' } }">
				<button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">Add Property</button>
			</router-link>
		</h3>
	
		<list ref="rowContents" class="w-full" tmpl="custom" :data-url="dataUrl" :sortBy="'p.id'"
			:sortOrder="'desc'" :filter-toggle="false" :messages="{ empty: 'There are no properties added!' }"
			:page-limit="pageLimit" :show-pagination="pagination" :search="false">
			<template #body="{ rows }">
				<div class="space-y-2">
					<div v-for="property in rows" :key="property.id" class="bg-white p-4 rounded shadow">
						<div class="flex justify-between items-center mb-2">
							<p class="font-semibold">{{ property.name }}</p>
							<p>{{ property.address1 }}</p>
							<router-link :to="{ name: 'PropertyView', params: { id: property.id } }">
								<button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">View</button>
							</router-link>
						</div>
						<div class="flex gap-2" v-if="owned">
							<router-link :to="{ name: 'AddTenant', params: { property_id: property.id } }">
								<button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">
									Add Tenant</button>
							</router-link>
							<router-link :to="{ name: 'AddPayment', params: { property_id: property.id } }">
								<button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">Add
									Payment</button>
							</router-link>
						</div>
					</div>
					<div v-if="rows.length === 0" class="text-center text-gray-500">No properties found.</div>
					<div v-if="rowscontents?.total > 2" class="text-center text-gray-500">
						<router-link :to="{ name: 'Properties' }">
							<button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">View All</button>
						</router-link>
					</div>
				</div>
			</template>
		</list>
	</section>
</template>

<script setup>
import { computed,defineProps, ref } from 'vue'
import List from '@/components/List/List.vue'
const props = defineProps({
	title: {
		type:String,
		required: true,
		default: 'Properties'

	},
	description: {
		type: String,
		required: false,
		default: 'No description provided.'
	},
	owned: {
		type: Boolean,
		default: false,
		required: true
	},
	display: {
		type: String,
		default: 'dashboard',
		required: false
	},
	pagination: {
		type: Boolean,
		default: false,
		required: false
	}
})

const dataUrl = computed(() => {
	if (props.owned) {
		return 'list/Properties?Owned=1'
	} else {
		return 'list/Properties?Rented=1'
	}
})

const pageLimit = computed(() => {
	if (props.display === 'dashboard') {
		return 2
	} else {
		return 10
	}
})


const rowContents = ref(null)
</script>