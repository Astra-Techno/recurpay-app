<template>
	<div class="w-full">
		<div class="text-lg font-bold text-center">
			Open AI Inspection System
		</div><br>
		<!-- Horizontal layout for State and Agent dropdowns -->
		<div class="flex space-x-4 mb-4">
			<!-- State Dropdown -->
			<div class="flex items-center">
				<label for="stateFilter" class="font-bold mr-2">State:</label>
				<select id="stateFilter" class="border border-gray-300 px-3 py-2 rounded" v-model="selectedState">
					<option v-for="state in uniqueStates" :key="state" :value="state">
						{{ state }}
					</option>
				</select>
			</div>

			<!-- Agent Dropdown -->
			<div class="flex items-center">
				<label for="agentFilter" class="font-bold mr-2">Agent:</label>
				<select id="agentFilter" class="border border-gray-300 px-3 py-2 rounded" v-model="selectedAgent">
					<option v-for="agent in filteredAgents" :key="agent.id" :value="agent.id">
						{{ agent.agent_company_name }}
					</option>
				</select>
			</div>

			<div class="flex items-center">
				<label for="inspectionTypeFilter" class="font-bold mr-2">Inspection Type:</label>
				<select id="inspectionTypeFilter" class="border border-gray-300 px-3 py-2 rounded"
					v-model="selectedInspectionType">
					<option v-for="type in inspectionTypes" :key="type" :value="type">
						{{ type }}
					</option>
				</select>
			</div>

			<!-- Go Button -->
			<div class="flex items-center justify-center space-x-4">
				<button @click="applyFilter" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
					Go
				</button>
			</div>

			<!-- Prompt Settings Button Aligned to the Right -->
			<div class="flex-grow flex justify-end">
				<button @click="openPromptModal" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
					Prompt Settings
				</button>
			</div>
		</div>

		<!-- Inspections Table -->
		<div class="overflow-x-auto">
			<table class="table-auto w-full border-collapse border border-gray-300">
				<thead>
					<tr class="bg-gray-200">
						<th class="border border-gray-300 px-4 py-2 text-left">ID</th>
						<th class="border border-gray-300 px-4 py-2 text-left">Address</th>
						<th class="border border-gray-300 px-4 py-2 text-center">Inspection Type</th>
						<th class="border border-gray-300 px-4 py-2 text-center">Media Count</th>
						<th class="border border-gray-300 px-4 py-2 text-center">Completed Date</th>
						<th class="border border-gray-300 px-4 py-2 text-center">Report</th>
						<th class="border border-gray-300 px-4 py-2 text-center">Action</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="inspection in items" :key="inspection.id" class="hover:bg-gray-100">
						<td class="border border-gray-300 px-4 py-2">{{ inspection.id }}</td>
						<td class="border border-gray-300 px-4 py-2">
							{{ inspection.property_address1 }}, {{ inspection.property_state }} {{
								inspection.property_postcode }}
						</td>
						<td class="border border-gray-300 px-4 py-2 text-center">{{ inspection.InspectionType || "N/A"
							}}</td>
						<td class="border border-gray-300 px-4 py-2 text-center">
							{{ inspection.media_count }}
						</td>
						<td class="border border-gray-300 px-4 py-2 text-center">{{ inspection.InspectionCompleted }}
						</td>
						<td class="border border-gray-300 px-4 py-2 text-center">
							<a :href="getPdfUrl(inspection.pdf_path)" target="_blank" class="text-blue-500 underline"
								v-if="inspection.pdf_path">
								View PDF
							</a>
							<span v-else>N/A</span>
						</td>
						<td class="border border-gray-300 px-4 py-2 text-center">
							<template v-if="inspection.media_count > 0">
								<RouterLink :to="`/ai/logs?context=inspection&context_id=${inspection.id}`"
									class="text-blue-500 underline">
									<button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
										Generate Comments
									</button>
								</RouterLink>
							</template>
							<template v-else>
								N/A
							</template>
						</td>
					</tr>
				</tbody>
			</table>
			<Pagination :currentPage="currentPage" :totalPages="totalPages" :pageNumbers="pageNumbers()"
				@prev-page="prevPage" @next-page="nextPage" @go-to-page="goToPage" />
		</div>

		<div v-if="!items.length && !loading" class="my-8 text-center">
			No inspections found
		</div>
	</div>

	<!-- Prompt popup -->
	<div v-if="showPromptModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div v-if="isSaving" class="fixed inset-0 z-[60] bg-white/[.6] grid place-content-center">
			<SimpleLoader class="place-content-center"></SimpleLoader>
		</div>

		<div class="bg-white rounded-lg shadow-lg w-3/4 h-3/4 overflow-auto p-6 relative">

			<!-- Header Section -->
			<div class="sticky top-0 flex justify-between items-center mb-4"
				style="background-color: #dddeff;padding:10px; z-index: 10">
				<h2 class="text-2xl font-semibold">Prompt</h2>
				<!-- Inspection Type Dropdown -->
				<div class="flex items-center space-x-4">
					<label for="modalInspectionTypeFilter" class="font-bold">Inspection Type:</label>
					<select id="modalInspectionTypeFilter" class="border border-gray-300 px-3 py-2 rounded"
						v-model="selectedInspectionType">
						<option v-for="type in inspectionTypes" :key="type" :value="type">
							{{ type }}
						</option>
					</select>
				</div>
				<!-- Save and Close Buttons -->
				<div class="flex space-x-4">
					<button @click="savePrompts" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
						Save
					</button>
					<button @click="closePromptModal"
						class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
						Close
					</button>
				</div>
			</div>

			<div class="modal-body" style="overflow-y: auto; max-height: calc(100% - 100px)">
				<p><b>System Prompt:</b></p>
				<!-- Content Section -->
				<textarea v-model="systemPrompts" placeholder="Enter something here..." rows="4"
					class="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"></textarea>
				<br><br>
				<p><b>Output Prompt:</b></p><br>
				<pre>{{ outputPrompts }}</pre>

				<p><br><b>User Prompt:</b></p>
				<br>
				<!-- User Prompts Table -->
				<table border="1" cellpadding="5" cellspacing="0"
					style="width: 100%; border-collapse: collapse; border: solid 1px gray">
					<thead>
						<tr>
							<th style="width: 20%;">Room Name</th>
							<th style="width: 80%;">Prompt</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(userPrompt, index) in userPrompts" :key="userPrompt.id">
							<td>{{ userPrompt.room_name }}</td>
							<td>
								<textarea v-model="userPrompt.prompt" rows="3"
									style="width: 100%; border: 1px solid silver;"></textarea>
							</td>
						</tr>
					</tbody>
				</table><br>
			</div>
		</div>
	</div>
	<div v-if="loading" class="fixed inset-0 z-[60] bg-white/[.6] grid place-content-center">
		<SimpleLoader class="place-content-center"></SimpleLoader>
	</div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useMeta } from "@/composables/use-meta";
import { useAppStore } from "@/stores";
import useListing from "@/composables/useListing";
import Signal from "@/composables/signal";
import useApiRequest from "@/composables/request";
import airequest from "@/themes/propertymanager/views/ai/request.vue";
import { RouterLink } from "vue-router";
import Pagination from "@/components/elements/Pagination.vue";
import SimpleLoader from "@/components/elements/SimpleLoader.vue";

useMeta({ title: "Open AI Inspection System" });
const appStore = useAppStore();
const request = useApiRequest();
const agents = ref([]); // All agents
const uniqueStates = ref([]); // List of unique states
const filteredAgents = ref([]); // Filtered agents for selected state
const selectedState = ref(""); // Selected state
const selectedAgent = ref(""); // Selected agent
const prompt = ref('');
const userPrompts = ref([]);
const systemPrompts = ref();
const outputPrompts = ref();
const selectedInspectionType = ref("");
const filters = ref();
const defaultPerPage = 20;
const showPromptModal = ref(false);
const isSaving = ref(false);
const inspectionTypes = ref([
	"Routine",
	// "Entry",
	// "Exit",
	// "Re-inspect",
	// "Pre-vacate",
	// "Min-standards",
	// "Warranty",
]);

const {
	items,
	loading,
	currentPage,
	totalPages,
	pageNumbers,
	prevPage,
	nextPage,
	goToPage,
	fetchItems,
	applyFilters,
} = useListing(
	`propertymanager/ai/inspections`, // API endpoint for inspections
	filters.value,
	defaultPerPage,
	true,
	Signal.error
);

watch(selectedState, (newState) => {
	filterAgentsByState();
});

watch(items, () => {
	console.log(items.value);
});

onMounted(async () => {
	loading.value = true;
	await fetchAgents(); // Fetch agents
	if (!selectedInspectionType.value && inspectionTypes.value.length > 0) {
		selectedInspectionType.value = inspectionTypes.value[0];
	}
	applyFilter();
	//await fetchItems(); // Fetch inspections
});

const openPromptModal = async () => {
	showPromptModal.value = true;
	await fetchPrompts();
};

const closePromptModal = () => {
	showPromptModal.value = false;
};

const fetchAgents = async () => {
	try {
		const response = await request.fetch("propertymanager/inspection/agents");


		agents.value = response.data;

		// Extract unique states from agents
		uniqueStates.value = [];
		for (const agent of response.data) {
			if (agent.state && !uniqueStates.value.includes(agent.state)) {
				uniqueStates.value.push(agent.state);
			}
		}

		//Automatically select the first state if no state is selected
		if (!selectedState.value && uniqueStates.value.length > 0) {
			selectedState.value = uniqueStates.value[0];
		}

		// Filter agents based on the selected state
		filterAgentsByState();
	} catch (error) {
		console.error("Failed to fetch agents:", error);
	}
};

// Filter agents based on the selected state
const filterAgentsByState = () => {
	filteredAgents.value = [];

	for (const agent of agents.value) {
		if (agent.state === selectedState.value) {
			filteredAgents.value.push(agent);
		}
	}

	if (filteredAgents.value.length > 0) {
		selectedAgent.value = filteredAgents.value[0].id;
	} else {
		selectedAgent.value = "";
	}
};

// Apply filter when the Go button is clicked
const applyFilter = async () => {
	filters.value = {}; // Reset filters

	if (selectedState.value) {
		filters.value.state = selectedState.value;
	}

	if (selectedAgent.value) {
		filters.value.agent = selectedAgent.value;
	}

	if (selectedInspectionType.value) {
		filters.value.inspectionType = selectedInspectionType.value;
	}

	console.log(JSON.stringify(filters.value));

	applyFilters(filters.value)

};

const fetchPrompts = async () => {
	isSaving.value = true;
	try {
		const response = await request.post('propertymanager/ai/prompts'); // Adjust the endpoint if necessary
		const { system, user, output } = response.data;

		// Assuming system prompt is a single prompt (adjust as per your API's response structure)
		if (system.length > 0) {
			systemPrompts.value = system.map(item => item.prompt).join('\n\n'); // Join prompts with double newline for readability
			userPrompts.value = user;
			outputPrompts.value = output;
		} else {
			prompt.value = 'No system prompts available';
		}
	} catch (err) {
		//error.value = 'Error fetching prompts: ' + (err.response?.data?.message || err.message);
		Signal.error('Error fetching prompts: ' + (err.response?.data));
	} finally {

	}
	isSaving.value = false;
};

const savePrompts = async () => {
	isSaving.value = true;
	try {
		const payload = {
			systemPrompts: systemPrompts.value,
			userPrompts: userPrompts.value
		};

		const response = await request.post('propertymanager/ai/update-prompt', payload);

		if (response.error) {
			Signal.error(response.error)
			return
		}
		Signal.success(response.message || "Prompts updated successfully!");
		closePromptModal();
	} catch (error) {
		Signal.error("An error occurred while saving prompts!");
	}
	isSaving.value = false;
};

function getPdfUrl(pdfPath) {
	if (!pdfPath) return ''; // Return empty string if no path is provided

	const isLocalPath = location.href.includes('192.168.3'); // Check the browser's current URL for '192.168.3'
	const baseUrl = isLocalPath
		? 'http://192.168.3.27/jentla25x/manager/'
		: 'https://manager.ourtradie.com.au/';
	return `${baseUrl}${pdfPath}`;
}

</script>
