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
			<div class="bg-white max-w-6xl mx-auto p-2 sm:p-4 space-y-10">

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

				</div>
				<!-- Gallery -->
				<div v-if="property.images?.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
					<img v-for="(img, i) in property.images" :key="i" :src="img"
						class="rounded-lg h-40 sm:h-52 object-cover border" />
				</div>

				<!-- Basic Information -->
				<section>
					<div class="bg-white p-6 rounded-2xl shadow-md space-y-6 mb-6">
						<h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
							<span class="inline-block">ℹ️</span>
							Basic Info
						</h2>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
							<div><strong>Type:</strong> {{ property.property_type ?? 'Rental Home' }}</div>
							<div><strong>Bedrooms:</strong> {{ property.bedrooms }}</div>
							<div><strong>Bathrooms:</strong> {{ property.bathrooms }}</div>
							<div><strong>Square Footage:</strong> {{ property.square_footage }} sqft</div>
						</div>
					</div>
				</section>

				<!-- Rental Information -->
				<div class="bg-white p-6 rounded-2xl shadow-md space-y-6 mb-6">
					<h3
						class="text-xl font-semibold mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
						<div class="flex items-center gap-2">
							<span class="text-blue-500 text-lg">💳</span>Payments
						</div>

						<button @click="payOpen = true" class="btn text-sm sm:text-base px-4 py-2 transition-all">
							+ Add Payment
						</button>
					</h3>

					<div v-if="payments.length === 0" class="text-center italic">No Payment Details Yet.</div>
					<list ref='payments' class="w-full" tmpl="custom" :data-url="paymentUrl" :sortBy="'pt.id'"
						:sortOrder="'desc'" :filter-toggle="false" :messages="{ empty: 'There are no Payments added!' }"
						:page-limit="50" :search="false">
						<template #body="{ rows }">
							<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
								<div v-for="p in rows" :key="p.id" @click="editPayment(p)"
									class="cursor-pointer rounded-2xl bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group overflow-hidden">

									<div class="p-5 space-y-2">
										<!-- Header: Payment Type + Edit -->
										<div class="flex justify-between items-start">
											<div class="text-lg font-semibold text-gray-800 tracking-tight">
												{{ p.type === 'other' ? p.other_type : capitalize(p.type) }}
											</div>
											
										</div>

										<!-- Subinfo: Date & Period -->
										<div class="text-sm text-gray-500">
											{{ formatDate(p.due_from) }} • {{ capitalize(p.period) }}
										</div>

										<!-- Amount -->
										<div class="text-2xl font-bold text-green-600 mt-3">
											₹{{ p.amount }}
										</div>

										<!-- Notes -->
										<div v-if="p.notes" class="text-sm text-gray-400 italic mt-2">
											"{{ p.notes }}"
										</div>
									</div>

									<!-- Subtle hover bar -->
									<div
										class="h-1 w-full bg-gradient-to-r from-transparent via-green-300 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300">
									</div>
								</div>

							</div>
						</template>
					</list>
				</div>


				<!-- Tenancy Details -->
				<section>
					<div class="bg-white p-6 rounded-2xl shadow-md space-y-6 mb-6">
						<h2
							class="text-xl font-semibold mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
							<div class="flex items-center gap-2">
								<span class="text-lg">👥</span>
								Tenants
							</div>

							<button @click="open = true" class="btn text-sm sm:text-base px-4 py-2 transition-all">
								+ Add Tenant
							</button>
						</h2>
						<list ref='tenants' class="w-full" tmpl="custom" :data-url="dataUrl" :sortBy="'pt.id'"
							:sortOrder="'desc'" :filter-toggle="false"
							:messages="{ empty: 'There are no tenants added!' }" :page-limit="50" :search="false">
							<template #body="{ rows }">
								<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
									<router-link v-for="tenant in rows" :key="tenant.id"
										:to="{ name: 'TenantDetail', params: { id: tenant.id } }">
										<div
											class="p-4 rounded-xl border border-gray-100 shadow-sm bg-gray-50 hover:bg-white transition">
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
					</div>
				</section>


			</div>
		</div>
	</div>

	<Modal v-model="open" title=" ">
		<TenantCard :property="property" @submitted="handleClose()" />
	</Modal>

	<Modal v-model="payOpen" title=" ">
		<PaymentCard :property="property" :payment-edit="payment" @submitted="handleClose()" />
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
import PaymentCard from '../payment/form.vue'
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
	loadData();
});

const loadData = async () => {
	const id = route.params.id
	if (!id) return

	const res = await request.fetch(`/entity/Property/${id}`)
	if (res.error) return

	property.value = res.data

	// Payments

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

const editPayment = (p) => {
	payment.value = { ...p };
	payOpen.value = true
	
}

</script>
