<template xmlns="http://www.w3.org/1999/html">
	<div class="w-full">

		<div class="space-y-4 mb-4">
			<!-- Heading Section -->
			<div class="text-lg font-bold text-center">
				AI Logs for Routine Inspection
				<br />
				<span class="text-sm text-gray-600">
				  {{ propertyDetails.property_address1 }}, {{ propertyDetails.property_state }} - {{ propertyDetails.property_postcode }}
				</span>
			</div>

			<!-- Buttons Section -->
			<div class="flex justify-between">
				<!-- Back Button -->
				<div>
					<div>
						<button  @click="goBack" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
							Back
						</button>
					</div>
				</div>

				<!-- New Button -->
				<div>
					<RouterLink :to="`/ai/request?context=${route.query.context}&context_id=${route.query.context_id}&log_id=0`">
						<button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
							New
						</button>
					</RouterLink>
				</div>
			</div>
		</div>

		<div class="overflow-x-auto">
			<table class="table-auto w-full border-collapse border border-gray-300">
				<thead>
				<tr class="bg-gray-200">
					<th class="border border-gray-300 px-4 py-2 text-left">ID</th>
					<th class="border border-gray-300 px-4 py-2 text-left">Created</th>
					<th class="border border-gray-300 px-4 py-2 text-left">Created By</th>
					<th class="border border-gray-300 px-4 py-2 text-center">Status</th>
					<th class="border border-gray-300 px-4 py-2 text-center">AI Model</th>
					<th class="border border-gray-300 px-4 py-2 text-center">Token Usage</th>
					<th class="border border-gray-300 px-4 py-2 text-center">Action</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="logs in items" :key="logs.id" class="hover:bg-gray-100">
					<td class="border border-gray-300 px-4 py-2">
						{{ logs.id }}
					</td>
					<td class="border border-gray-300 px-4 py-2">
						{{ logs.created_at }}
					</td>
					<td class="border border-gray-300 px-4 py-2">
						{{ logs.fullname }}
					</td>
					<td class="border border-gray-300 px-4 py-2 text-center">
						{{ logs.status }}
					</td>
					<td class="border border-gray-300 px-4 py-2 text-center">
						gpt-4o-mini
					</td>
					<td class="border border-gray-300 px-4 py-2 text-center">
						{{ logs.tokens }}
					</td>
					<td class="border border-gray-300 px-4 py-2 text-center">
						<RouterLink :to="`/ai/request?context=${route.query.context}&context_id=${route.query.context_id}&log_id=${ logs.id }`">
						<button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
							Proceed
						</button>
						</RouterLink>
					</td>
				</tr>
				</tbody>
			</table>
		</div>

		<div v-if="!items.length && !loading" class="my-8 text-center">
			No records found
		</div>
	</div>
	<div v-if="loading" class="fixed inset-0 z-[60] bg-white/[.6] grid place-content-center">
		<SimpleLoader class="place-content-center"  ></SimpleLoader>
	</div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useMeta } from "@/composables/use-meta";
import { useAppStore } from "@/stores";
import useListing from "@/composables/useListing";
import Signal from "@/composables/signal";
import useApiRequest from "@/composables/request";
import {RouterLink, useRoute} from "vue-router";
import SimpleLoader from "@/components/elements/SimpleLoader.vue";

useMeta({ title: "AI Logs" });
const appStore = useAppStore();
const request = useApiRequest();
const selectedInspectionType = ref("");
const route = useRoute();
const filters = ref();
const defaultPerPage = 10;
const showPromptModal = ref(false);
const context = ref("");
const context_id = ref(0);
const propertyDetails = ref({});

const { items, loading, fetchItems, applyFilters } = useListing(
	`propertymanager/ai/logs`, // API endpoint for inspections
	filters.value,
	defaultPerPage,
	true,
	Signal.error
);

const fetchContext = async () => {
	const response = await request.post('propertymanager/ai/context', {
		context: route.query.context,
		context_id: route.query.context_id
	});
	if (response.data) {
		propertyDetails.value = response.data;
	}
}
onMounted(async () => {
	context.value = route.query.context;
	context_id.value = route.query.context_id;
	filters.value = {};
	filters.value.context = context.value;
	filters.value.context_id = context_id.value;
	applyFilters(filters.value);
	fetchContext();
});
const goBack = () => {
	window.history.go(-1); // This will go back to the previous page
};
</script>
