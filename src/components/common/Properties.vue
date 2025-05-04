<template>
	<section  class="px-4 pb-4" v-show="rowContents?.total > 0">
		<h3 class="text-md font-semibold mb-2 py-4 flex justify-between sticky top-0 bg-white z-20">🏡 {{title}}
			<router-link :to="{ name: 'AddProperty', params: { mode: 'add' } }" v-if="owned">
				<button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">Add Property</button>
			</router-link>
		</h3>		
		<list ref="rowContents" class="w-full" tmpl="custom" :data-url="dataUrl" :sortBy="'p.id'"
			:sortOrder="'desc'" :filter-toggle="false" :messages="{ empty: 'There are no properties added!' }"
			:page-limit="pageLimit" :show-pagination="pagination" :search="false">
			<template #body="{ rows }">
				<div class="space-y-4">
					<div
					v-for="property in rows"
					:key="property.id"
					class="bg-white p-4 rounded-2xl shadow hover:shadow-md transition-all duration-200"
					>
					<!-- Top: Name + View -->
					<div class="flex justify-between items-center mb-1">
						<p class="text-lg font-semibold text-gray-800 truncate">{{ property.name }}</p>
						<router-link :to="{ name: 'PropertyView', params: { id: property.id } }">
						<button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600">
							View
						</button>
						</router-link>
					</div>

					<!-- Address Info -->
					<div class="text-sm text-gray-600 leading-snug mb-2">
						<p>{{ property.address1 }}</p>
						<p>{{ property.city }}, {{ property.state }} {{ property.zip }}</p>
					</div>

					<!-- Action buttons -->
					<div class="flex gap-2" v-if="owned">
						<router-link :to="{ name: 'AddTenant', params: { property_id: property.id } }">
						<button class="text-xs bg-emerald-500 text-white px-3 py-1 rounded-full hover:bg-emerald-600">
							Add Tenant
						</button>
						</router-link>
						<router-link :to="{ name: 'AddPayment', params: { property_id: property.id } }">
						<button class="text-xs bg-indigo-500 text-white px-3 py-1 rounded-full hover:bg-indigo-600">
							Add Payment
						</button>
						</router-link>
					</div>
					</div>

					<!-- No properties message -->
					<div v-if="rows.length === 0" class="text-center text-gray-500 text-sm">
					No properties to list.
					</div>

					<!-- View All button -->
					<div
					v-if="rowContents?.total > 2 && pagination === false"
					class="text-center mt-2"
					>
					<router-link
						:to="{ name: 'PropertiesList', params: { mode: owned ? 'owned' : 'rented' } }"
					>
						<button
						class="text-xs w-full bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600"
						>
						View All
						</button>
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
	},
	pageLimit: {
		type: Number,
		default: 2,
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


const rowContents = ref(null)
</script>