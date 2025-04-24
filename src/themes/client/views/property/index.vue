<template>
	<div class="flex flex-col h-screen">

		<div class="sticky top-0 bg-white z-10 px-6 py-4">

			<p class="py-2 mt-1">{{ fullAddress }}</p>


			<!-- Property Info Card -->
			<div>
				<div class="flex justify-between text-center border-t">
					<div class="flex-1 border-r p-2">
						<p class="text-lg font-bold">{{ property.bedrooms ?? 0 }}</p>
						<p class="text-sm text-gray-500">Bedrooms</p>
					</div>
					<div class="flex-1 border-r p-2">
						<p class="text-lg font-bold">{{ property.bathrooms ?? 0 }}</p>
						<p class="text-sm text-gray-500">Bathrooms</p>
					</div>
					<div class="flex-1 p-2">
						<p class="text-lg font-bold">{{ property.square_footage ?? 1000 }}</p>
						<p class="text-sm text-gray-500">Sq. Ft.</p>
					</div>
				</div>
				<div class="flex gap-3 mt-4">
					<router-link :to="{ name: 'editProperty', params: { id: payment.id } }">
						<button class="btn flex-1 py-2 secondary">Edit Property</button>
					</router-link>
		
					<button class="flex-1 py-2 primary">Add Tenant</button>
				</div>
			</div>
		</div>
		<list ref="tenantList" class="w-full" tmpl="custom" :data-url="tenantListUrl" :sortBy="'pt.id'"
			:sortOrder="'desc'" :filter-toggle="false" :messages="{ empty: 'There are no tenants added!' }"
			:page-limit="4" :search="false" :show-pagination="false">
			<template #body="{ rows }">
				<div class="mt-6 px-4 py-2">
					<h2 class="text-base font-bold mb-2">Current Tenants</h2>
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

					<div v-if="tenantList.total > 4" class="text-center mt-4">
						<router-link :to="{ name: 'TenantsListByProperty', params: { id: property_id } }"
							class="text-blue-600 btn text-center primary hover:underline">View All Tenants</router-link>
					</div>
				</div>
			</template>
		</list>


		<!-- Payments -->
		<div class="mt-6 px-4">
			<h2 class="text-sm font-semibold mb-2">Payments</h2>
			<div class="bg-gray-100 rounded-xl p-4 flex items-center justify-between">
				<div>
					<p class="text-sm font-medium">May Rent</p>
					<p class="text-xs text-blue-600 mt-1">Due: May 5</p>
				</div>
				<p class="text-sm font-semibold">₹15,000</p>
			</div>
		</div>

	</div>
</template>

<script setup>

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import useApiRequest from '@/composables/request'
import List from '@/components/List/List.vue'

import { getCurrentInstance } from 'vue'


const emit = defineEmits(['submitted'])

const property = ref({
	images: [],
	tags: [],
})

const tenants = ref([]);
const payment = ref({});
const payments = ref([]);

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

const paymentUrl = computed(() => {
	return property_id.value > 0
		? `list/Payments?property_id=${property_id.value}`
		: `list/Payments`
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
	const { proxy } = getCurrentInstance()
	loadData(proxy);
});

const loadData = async (proxy) => {
	const id = route.params.id
	if (!id) return

	const res = await request.fetch(`/entity/Property/${id}`)
	if (res.error) return

	property.value = res.data

	// Payments
	proxy.$setHeader(property.value.name, '', true, 'IconHome')
}

const editRef = ref(null)

const showEdit = (id) => {
	console.log(editRef.value);
	editRef.value?.open(id)
}

// For Add Modal Popup
const handleClose = () => {
	open.value = false
	payOpen.value = false
	tenants.value.goFirst()
	payments.value.goFirst()
}
const open = ref(false)
const payOpen = ref(false)


const capitalize = (str) => {
	if (!str || typeof str !== 'string') return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
}
const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
	year: 'numeric', month: 'short', day: 'numeric'
});

const tenantListUrl = computed(() => {
	return property_id.value > 0
		? `list/Tenants?property_id=${property_id.value}`
		: `list/Tenants`
})

const paymentListUrl = computed(() => {
	return property_id.value > 0
		? `list/Payments?property_id=${property_id.value}`
		: `list/Payments`
})
const tenantList = ref([])

</script>
