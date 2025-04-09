<template>
	<div class="space-y-12 pb-12">
		<!-- Hero Section -->
		<div class="relative w-full h-[80vh] overflow-hidden rounded-b-3xl shadow-lg">
			<img
				:src="property.cover || fallbackImage"
				alt="Property Cover"
				class="object-cover w-full h-full"
			/>
			<!-- Overlay with property info -->
			<div
				class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 sm:p-10 flex flex-col justify-end text-white"
			>
				<h1 class="text-3xl sm:text-5xl font-bold drop-shadow">{{ property.name }}</h1>
				<p class="text-sm sm:text-lg mt-1 text-gray-100">
					{{ property.address1 }}, {{ property.city }}, {{ property.state }} - {{ property.postal_code }}
				</p>
				<div
					class="mt-4 inline-block bg-white text-gray-900 font-semibold text-sm sm:text-base px-4 py-1.5 rounded-full shadow-lg"
				>
					{{ formatCurrency(property.price) }} / Monthly
				</div>
			</div>
		</div>

		<!-- Gallery -->
		<section class="px-4 sm:px-6 lg:px-10">
			<h2 class="text-xl font-semibold text-gray-800 mb-4">Gallery</h2>
			<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
				<img
					v-for="(img, i) in property.images"
					:key="i"
					:src="img || fallbackImage"
					class="object-cover h-44 sm:h-52 w-full rounded-xl shadow border"
				/>
			</div>
		</section>

		<!-- Basic Information -->
		<section class="bg-white shadow rounded-2xl p-6 space-y-4 mx-4 sm:mx-6 lg:mx-10">
			<h2 class="text-xl font-bold text-gray-800">🏠 Basic Information</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base text-gray-700">
				<div><span class="font-medium">Address:</span> {{ property.address }}</div>
				<div><span class="font-medium">City:</span> {{ property.city }}</div>
				<div><span class="font-medium">State:</span> {{ property.state }}</div>
				<div><span class="font-medium">Postal Code:</span> {{ property.postal_code }}</div>
				<div><span class="font-medium">Type:</span> {{ property.type || 'Rental House' }}</div>
				<div><span class="font-medium">Bedrooms:</span> {{ property.bedrooms }}</div>
				<div><span class="font-medium">Bathrooms:</span> {{ property.bathrooms }}</div>
				<div><span class="font-medium">Square Footage:</span> {{ property.square_footage }} sqft</div>
			</div>
		</section>

		<!-- Rental Information -->
		<section class="bg-white shadow rounded-2xl p-6 space-y-4 mx-4 sm:mx-6 lg:mx-10">
			<h2 class="text-xl font-bold text-gray-800">📃 Rental Information</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base text-gray-700">
				<div><span class="font-medium">Monthly Rent:</span> {{ formatCurrency(property.price) }}</div>
				<div><span class="font-medium">Availability:</span> {{ property.availability }}</div>
				<div><span class="font-medium">Lease Terms:</span> {{ property.lease_terms }}</div>
				<div><span class="font-medium">Furnishing:</span> {{ property.furnishing || 'Unfurnished' }}</div>
			</div>

			<!-- Tags -->
			<div v-if="property.tags?.length" class="mt-4 flex flex-wrap gap-2">
				<span
					v-for="(tag, i) in property.tags"
					:key="i"
					class="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full"
				>
					{{ tag }}
				</span>
			</div>
		</section>

		<!-- Tenancy Details -->
		<section class="bg-white shadow rounded-2xl p-6 space-y-4 mx-4 sm:mx-6 lg:mx-10">
			<h2 class="text-xl font-bold text-gray-800">👥 Tenancy</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base text-gray-700">
				<div><span class="font-medium">Current Tenant:</span> {{ property.tenant_name || 'Vacant' }}</div>
				<div><span class="font-medium">Lease Start:</span> {{ property.lease_start || '—' }}</div>
				<div><span class="font-medium">Lease End:</span> {{ property.lease_end || '—' }}</div>
				<div><span class="font-medium">Rent Cycle:</span> {{ property.rent_cycle || 'Monthly' }}</div>
				<div><span class="font-medium">Deposit Amount:</span> {{ formatCurrency(property.deposit) }}</div>
				<div><span class="font-medium">Payment Due Day:</span> {{ property.due_day ? `Every ${property.due_day} of month` : '—' }}</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import useApiRequest from '@/composables/request'

const route = useRoute()
const property = ref({
	images: [],
	tags: []
})

const fallbackImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'

const formatCurrency = (value) => {
	return new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
		minimumFractionDigits: 0,
		maximumFractionDigits: 2
	}).format(value || 0)
}

onMounted(async () => {
	const id = route.params.id
	const request = useApiRequest()
	try {
		const res = await request.fetch(`/entity/Property/${id}`)
		property.value = res.data || {}
		if (!property.value.images?.length) {
			property.value.images = [fallbackImage]
		}
	} catch (error) {
		console.error('Failed to load property:', error)
	}
})
</script>
