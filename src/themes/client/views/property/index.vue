<template>
	<div class="flex flex-col h-screen">

		<div class="mx-4 sticky top-0 bg-white z-10 px-2 shadow-sm  border-b">
			
			<p class="py-2 mt-1">{{ fullAddress }}</p>
		</div>

		<!-- Property Info Card -->
		<div class="mx-4 ">
			<div class="flex justify-between text-center border-b">
				<div class="flex-1 border-r">
					<p class="text-xl font-bold">{{ property.bedrooms ?? 0 }}</p>
					<p class="text-xs text-gray-500">Bedrooms</p>
				</div>
				<div class="flex-1 border-r">
					<p class="text-xl font-bold">{{ property.bathrooms ?? 0 }}</p>
					<p class="text-xs text-gray-500">Bathrooms</p>
				</div>
				<div class="flex-1 ">
					<p class="text-xl font-bold">{{ property.square_footage ?? 1000 }}</p>
					<p class="text-xs text-gray-500">Sq. Ft.</p>
				</div>
			</div>
			<div class="flex gap-3 mt-4">
				<button class="flex-1 py-2 success">Edit Property</button>
				<button class="flex-1 py-2 success">Add Tenant</button>
			</div>
		</div>

		<!-- Current Tenants -->
		<div class="mt-6 px-4">
			<h2 class="text-sm font-semibold mb-2">Current Tenants</h2>
			<div class="bg-gray-100 rounded-xl p-4 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
						<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2"
							viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
					</div>
					<div>
						<p class="text-sm font-medium">Ram Kumar</p>
						<p class="text-xs text-blue-600">Active</p>
					</div>
				</div>
				<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2"
					viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
				</svg>
			</div>
		</div>

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



</script>
