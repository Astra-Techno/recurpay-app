<template>
	<div>
		<!-- Full-Width Hero Image -->
		<div class="w-full h-[300px] sm:h-[420px] relative -top-20 ">
			<img :src="property.cover || fallbackImage" alt="Property Cover" class="w-full h-full object-cover" />
			<div class="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80 flex items-end">
				<div class="px-6 sm:px-12 py-6 backdrop-blur-md bg-black/40 w-full">

				</div>
			</div>
		</div>

		<!-- Floating Card -->
		<div class="relative z-11 -mt-20 sm:-mt-32 px-4">
			<div class="bg-white rounded-2xl shadow-xl max-w-6xl mx-auto p-6 sm:p-10 space-y-10">

				<!-- Price Badge -->
				<div class="flex flex-col items-left space-y-2">
					<h2 class="text-2xl sm:text-4xl font-black italic">{{ property.name }}
						<button @click="showEdit(property.id)" class="transition-all" v-if="property.id>0">
							<Pencil class="w-5 h-5" />
						</button>
						<EditPropertyModal ref="editRef" @updated="reloadList()" />
					</h2>
					<h4 class="text-gray-500 mt-1">{{ fullAddress }}</h4>
					<h5 class="text-xl sm:text-2xl font-semibold text-green-600">
						{{ formatCurrency(property.price) }} / Month
					</h5>

				</div>

				<!-- Gallery -->
				<div v-if="property.images?.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
					<img v-for="(img, i) in property.images" :key="i" :src="img"
						class="rounded-lg h-40 sm:h-52 object-cover border" />
				</div>

				<!-- Basic Information -->
				<section>
					<h2 class="text-xl font-semibold mb-4">Basic Info</h2>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
						<div><strong>Type:</strong> {{ property.type ?? 'Rental Home' }}</div>
						<div><strong>Bedrooms:</strong> {{ property.bedrooms }}</div>
						<div><strong>Bathrooms:</strong> {{ property.bathrooms }}</div>
						<div><strong>Square Footage:</strong> {{ property.square_footage }} sqft</div>
					</div>
				</section>

				<!-- Rental Information -->
				<section>
					<h2 class="text-xl font-semibold mb-4">Rental Info</h2>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
						<div><strong>Lease Terms:</strong> {{ property.lease_terms }}</div>
						<div><strong>Furnishing:</strong> {{ property.furnishing || 'Unfurnished' }}</div>
						<div><strong>Available From:</strong> {{ property.availability }}</div>
					</div>
				</section>

				<!-- Tenancy Details -->
				<section>
					<h2 class="text-xl font-semibold mb-4">Tenancy</h2>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
						<div><strong>Tenant:</strong> {{ property.tenant_name || 'Vacant' }}</div>
						<div><strong>Lease Start:</strong> {{ property.lease_start || '—' }}</div>
						<div><strong>Lease End:</strong> {{ property.lease_end || '—' }}</div>
						<div><strong>Rent Cycle:</strong> {{ property.rent_cycle || 'Monthly' }}</div>
						<div><strong>Deposit:</strong> {{ formatCurrency(property.deposit) }}</div>
						<div><strong>Due Day:</strong> {{ property.due_day ? `Every ${property.due_day}` : '—' }}</div>
					</div>
				</section>
			</div>
		</div>
	</div>


</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import useApiRequest from '@/composables/request'
import { Pencil } from 'lucide-vue-next'

import EditPropertyModal from './edit.vue';


const property = ref({
	images: [],
	tags: [],
})

const fallbackImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'
const route = useRoute()
const request = useApiRequest()

const fullAddress = computed(() => {
	const p = property.value
	return [p.address1, p.address2, p.city, p.state, p.postal_code].filter(Boolean).join(', ')
})

const formatCurrency = (value) =>
	new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(value || 0)

onMounted(async () => {
	loadData()
})

const loadData = async () => {
	const id = route.params.id
	if (!id) return

	const res = await request.fetch(`/entity/Property/${id}`)
	if (res.error) return

	property.value = res.data
}

const editRef = ref(null)

const showEdit = (id) => {
	console.log(editRef.value);
	editRef.value?.open(id)
}

</script>
