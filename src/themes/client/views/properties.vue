<template>
	<div class="flex items-center mb-6">
		<h1 class="flex-1 text-2xl font-semibold">My Properties</h1>
	</div>

	<list class="w-full" :tmpl="'list'" :data-url="'list/Properties'" :sortBy="'p.id'"
		:sortOrder="'desc'" :filter-toggle="false" :messages="{ empty: 'There are no properties added!' }"
		:page-limit="10">
		<template #li-item="{ item }">
			<div class="flex flex-row border-b pb-2">
				<div class="flex-1">
					<div class="text-base font-bold">
						{{ item.name }}
					</div>
					<div class="text-secondry pt-2">{{ item.address1 }}, {{ item.address2 }} {{ item.city }} {{ item.state }}</div>
				</div>
				<div class="flex-none text-right">
					<span class="rounded-[5px] p-1 bg-badge text-white opacity-50">
						{{ item.name }}
					</span>
				</div>
			</div>
			<div class="flex flex-row pt-2">
				<div class="flex-1">
					<span class="flex-none text-right">
						{{ item.leaseType }}
					</span>
				</div>
			</div>
			<div class="flex flex-row pt-2">
				<div class="flex-1">
					<span class="flex-none text-right">
						${{ item.recommend_rent }} / {{ item.lperiod }}
					</span>
				</div>
				<div class="flex-1">
					<Icon name="Bed" /> {{ item.bedrooms }}
				</div>
				<div class="flex-1">
					<Icon name="ShowerHead" /> {{ item.bathrooms }}
				</div>
				<div class="flex-none text-right">
					<router-link :to="`/property/${item.id}`">
						<button class="btn secondary">
							Proceed
							<Icon name="IconRightArrow" />
						</button>
					</router-link>
				</div>
			</div>
		</template>
	</list>
</template>

<script setup>
import { useMeta } from '@/composables/use-meta'
import List from '@/components/List/List.vue'

useMeta({ title: 'Properties' })
</script>
