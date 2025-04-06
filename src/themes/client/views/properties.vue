<template>
	<!--
	<div class="flex items-center justify-between mb-4">
		<h1 class="text-2xl font-bold">My Properties</h1>
	</div>
	-->
	<list class="w-full" :data-url="'list/Properties'" :sortBy="'p.id'" :sortOrder="'desc'" :filter-toggle="false"
		:messages="{ empty: 'There are no properties added!' }" :page-limit="10" :search="false">

		<template #body="{ rows }">
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				<div v-for="property in rows" :key="property.id"
					class="bg-white group rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border"
					@click="viewProperty(property.id)">

					<!-- Image Section -->
					<div class="relative">
						<img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6" :alt="property.name"
							class="w-full h-48 sm:h-56 object-cover">
						<div
							class="absolute top-3 right-6 bg-[var(--ui-background)] bg-opacity-75 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md animate-heartbeat">
							
							{{ formatCurrency(property.price) }} / Monthly
						</div>
					</div>

					<!-- Content Section -->
					<div class="p-4">
						<!-- Property Name -->
						<h3 class="font-bold text-xl truncate mb-2">{{ property.name }}</h3>

						<!-- Address -->
						<div class="flex gap-2 items-start mb-4">
							<!-- Location Icon -->
							<svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2"
								viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M12 11.5a2 2 0 100-4 2 2 0 000 4z" />
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M19.5 11.5c0 6-7.5 10-7.5 10s-7.5-4-7.5-10a7.5 7.5 0 1115 0z" />
							</svg>

							<!-- Address Text -->
							<p class="text-base font-medium leading-snug">
								<span v-if="property.address1">{{ property.address1 }}</span>
								<span v-if="property.address2">, {{ property.address2 }}</span><br>
								<span v-if="property.city">{{ property.city }}</span>
								<span v-if="property.state">, {{ property.state }}</span>
								<span v-if="property.postal_code"> - {{ property.postal_code }}</span>
							</p>
						</div>

						<!-- Property Details -->
						<div class="flex gap-4 font-medium mb-3">
							<!-- Beds -->
							<span class="flex items-center gap-1 text-bedroom">
								<Icon name="IconBedroom" />
								{{ property.bedrooms }} Beds
							</span>

							<!-- Baths -->
							<span class="flex items-center gap-1 text-bathroom">
								<Icon name="IconBathroom" />
								{{ property.bathrooms }} Baths
							</span>

							<!-- Area -->
							<span class="flex items-center gap-1 text-area">
								<Icon name="IconSquareFeet" />
								{{ property.square_footage }} sqft
							</span>
						</div>



						<!-- Tags -->
						<div class="flex flex-wrap gap-2 mt-2">
							<span v-for="(tag, index) in property.tags" :key="index"
								class="px-3 py-1 text-xs font-semibold rounded-full" :class="{
									'bg-blue-600 text-white': index === 0,
									'bg-gray-200 text-gray-900': index !== 0
								}">
								{{ tag }}
							</span>
						</div>
					</div>


				</div>
			</div>
		</template>
	</list>
</template>

<script setup>
import { useMeta } from '@/composables/use-meta'
import List from '@/components/List/List.vue'

useMeta({ title: 'My Properties' })

const formatCurrency = (value) => {
	return new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
		minimumFractionDigits: 0,
		maximumFractionDigits: 2
	}).format(value || 0)
}
</script>
