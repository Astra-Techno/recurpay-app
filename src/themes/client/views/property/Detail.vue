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
				 <div class="flex flex-row w-full justify-between items-center mb-4">
				<div class="flex flex-col items-left space-y-2">
					
					<h2 class="text-2xl sm:text-4xl font-black italic">{{ property.name }}
						<button @click="showEdit(property.id)" class="transition-all" v-if="property.id > 0">
							<Pencil class="w-5 h-5" />
						</button>
						<EditPropertyModal ref="editRef" @updated="reloadList()" />

						

					</h2>

					<h4 class="text-gray-500 mt-1">{{ fullAddress }}</h4>
					<h5 class="text-xl sm:text-2xl font-semibold text-green-600">
						{{ formatCurrency(property.price) }} / Month
					</h5>

				</div>
				<div class="flex flex-col relative right-0">
					<button @click="open = true" class="text-base p-2 transition-all">+Add Tenant</button>							
				</div>
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
						<div><strong>Type:</strong> {{ property.property_type ?? 'Rental Home' }}</div>
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
					<h2 class="text-xl font-semibold mb-4">Tenants</h2>
					<list ref='tenants' class="w-full" tmpl="custom" :data-url="dataUrl" :sortBy="'pt.id'"
						:sortOrder="'desc'" :filter-toggle="false" :messages="{ empty: 'There are no tenants added!' }"
						:page-limit="50" :search="false">
						<template #body="{ rows }">
							<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
								<router-link v-for="tenant in rows" :key="tenant.id"
									:to="{ name: 'TenantDetail', params: { id: tenant.id } }">
									<div
										class="bg-white rounded-2xl shadow-md p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
										<!-- Avatar -->
										<img :src="tenant.avatar" alt="Avatar"
											class="w-16 h-16 rounded-full object-cover" />

										<!-- Tenant Info -->
										<div class="text-center sm:text-left">
											<h3 class="text-lg font-black italic ">
												{{ tenant.name }}
											</h3>
											<p class="font-bold">{{ tenant.property }}</p>
											<p>{{ tenant.address }}</p>

											<!-- Status -->
											<span :class="[
												'text-xs mt-2 inline-block rounded-full px-2 py-1',
												tenant.status === 'active'
													? 'bg-green-100 text-green-600'
													: tenant.status === 'vacated'
														? 'bg-yellow-100 text-yellow-600'
														: 'bg-red-100 text-red-600',
											]">
												{{ tenant.status.toUpperCase() }}
											</span>
										</div>
									</div>
								</router-link>
							</div>
						</template>
					</list>
				</section>


			</div>
		</div>
	</div>

	<Modal v-model="open" title=" ">
		<TenantCard :property="property" @submitted="handleClose()" />
	</Modal>

	<Modal v-model="payOpen" title=" ">
		<PaymentCard :property="property" @submitted="handleClose()" />
	</Modal>

</template>


<script setup>

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import useApiRequest from '@/composables/request'
import { Pencil } from 'lucide-vue-next'

import EditPropertyModal from './edit.vue';

import Modal from '@/components/elements/Modal.vue'
import List from '@/components/List/List.vue'
import TenantCard from '../Tenant/form.vue'
const emit = defineEmits(['submitted'])

const property = ref({
	images: [],
	tags: [],
})

const tenants = ref([]);

const fallbackImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'
const route = useRoute()
const request = useApiRequest()
const property_id = ref(0)
property_id.value = route.params.id || 0;
const dataUrl = computed(() => {
	return property_id.value > 0
		? `list/Tenants?property_id=${property_id.value}`
		: `list/Tenants`
})

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
	loadData();
});

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

// For Add Modal Popup
const handleClose = () => {
	open.value = false
	tenants.value.goFirst()
}
const open = ref(false)
const payOpen = ref(false)

</script>
