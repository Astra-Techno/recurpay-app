<template>
	<div>
		<div class="space-y-4 mb-4">
			<!-- Heading Section -->
			<div class="text-lg font-bold text-center">
				Prompt details for Routine Inspection
				<br/>
				<span class="text-sm text-gray-600">
					{{ propertyDetails.property_address1 }}, {{ propertyDetails.property_state }} - {{
						propertyDetails.property_postcode
					}}
				</span>
			</div>

			<!-- Buttons Section -->
			<div class="flex justify-between">
				<!-- Back Button -->
				<div>
					<button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" @click="goBack">
						Back
					</button>
				</div>

				<!-- New Button -->
				<div>
					<!-- Generate Comments Button -->
					<button v-if="!shouldShowTabs" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
							@click="openAIAlert">
						Generate AI Comments
					</button>
				</div>
			</div>
		</div>
		<!-- Tabs Toggle -->
		<div class="tabs-container">
			<div
				v-for="tab in tabs"
				v-show="tab === 'Request' || shouldShowTabs"
				:key="tab"
				:class="{ active: activeTab === tab }"
				class="tab"
				@click="handleTabClick(tab)"
			>
				{{ tab }}
			</div>
		</div>

		<div v-if="activeTab === 'Request'" class="tab-content">
			<!-- Toggle -->
			<div class="flex items-center m-2">
				<div class="flex-1 text-xl font-bold">Prompt</div>
				<div class="flex-none flex items-center">
					<span class="toggle-label">Raw View</span>
					<label class="toggle-switch ml-2">
						<input v-model="isRawView" type="checkbox"/>
						<span class="slider"></span>
					</label>
				</div>
			</div>
			<!-- Content -->
			<div v-if="!isRawView">
				<div v-if="messages && messages.length">
					<!-- Display content in a grid format -->
					<div class="message-container m-2 border">
						<!-- Render content for each message -->
						<template v-for="(message, index) in messages" :key="index">
							<!-- Render Role -->
							<div class="role">
								{{ message.role }}
							</div>

							<!-- Render Content for each Role -->
							<div class="content px-2 pb-2">
								<template v-for="(item, idx) in message.content || []" :key="message.role + '-' + idx">
									<!-- Text Messages -->
									<div v-if="item.type === 'text' && !item.text.includes('ID of the Photo')" :class="{
										// 'highlight-input': item.text.includes('Area:') || item.text.includes('format:'),
										'highlight-area': item.text.includes('Area:'),
										'user-role': message.role === 'user',
										'system-role': message.role === 'system',
									}" class="text-content">
										<code v-if="item.text.includes('The output comments should be in the following format:') || item.text.includes('Area:')"
											  class="whitespace-pre">
											{{ item.text }}
										</code>
										<div v-else>
											{{ item.text }}
										</div>
									</div>

									<!-- Image URLs -->
									<div v-else-if="item.type === 'image_url'" class="image-content">
										<a :href="'/media/' + getImage(item.image_url.url)" target="_blank">
											<img :src="'/media/' + getThumbImage(item.image_url.url)" alt="Image"
												 class="image"/>
										</a>
									</div>
								</template>
							</div>
						</template>
					</div>
				</div>
				<div v-else>No data to display.</div>
			</div>
			<!-- Raw JSON View -->
			<div v-if="isRawView">
				<div>
					<JsonViewer :expandDepth="10" :expanded="true" :value="messages"/>
				</div>
			</div>
		</div>

		<div v-if="activeTab === 'Response'" class="tab-content">
			<div class="flex items-center m-2">
				<div class="flex-1 text-xl font-bold">Output</div>
				<div class="flex-none flex items-center">
					<span class="toggle-label">Raw View</span>
					<label class="toggle-switch ml-2">
						<input v-model="isRawView" type="checkbox"/>
						<span class="slider"></span>
					</label>
				</div>
			</div>
			<!-- Content -->
			<div v-if="response_result" style="min-height: 500px">
				<template v-if="isJson(response_result)">
					<div v-if="!isRawView">
						<div v-if="activeTab === 'Response'">
							<div class="message-container m-2 border">
								<div class="role">
									Info
								</div>
								<div class="content px-2 pb-2">
									Model: {{parsedResponseData.model}}
								</div>
								<div class="role">
									Token usage
								</div>
								<div class="content px-2 pb-2">
									<div>Total Tokens: {{ parsedResponseData.usage?.totalTokens || 'N/A' }}</div><br>
									<p>Prompt Tokens: {{ parsedResponseData.usage?.promptTokens || 'N/A' }}</p><br>
									<p>Completion Tokens: {{ parsedResponseData.usage?.completionTokens || 'N/A' }}</p>
								</div>
								<div class="role">
									Result
								</div>

								<div v-for="(area, id) in formattedData" :key="id" class="pl-4">

									<div class="text-content highlight-input highlight-area user-role">
										<!-- Area Name -->
										<div class="text-lg text-gray-600 pl-1">
											<span class="font-bold"> {{ area.name }}</span>
										</div>
									</div>

									<!-- Area Summary -->
									<div class="text-md text-gray-800 mt-2">
										<span class="font-bold">Summary:</span> {{ area.summary }}
									</div>

									<!-- List of Photos with Comments -->
									<div v-if="area.photos.length > 0" class="mt-4">
										<div v-for="(photo, index) in area.photos" :key="index" class="mb-4">
											<div class="flex items-center space-x-4">
												<!-- Photo -->
												<div class="image-content">
													<a :href="getInputImage(photo.path)" target="_blank">
														<img :src="getInputThumbImage(photo.path)" alt="Image"
															 class="image"/>
													</a>
												</div>
												<!-- Photo Comment -->
												<div class="flex-1 user-role">
													<p class="text-content">
														{{ photo.comment }}
													</p>
												</div>
											</div>
										</div>
									</div>
									<div v-else class="mt-4 text-gray-500">NONE</div>
								</div>
							</div>

						</div>
					</div>
					<!-- Raw View Section (JSON Viewer) -->
					<div v-if="isRawView">
						<JsonViewer :expandDepth="10" :expanded="true" :value="JSON.parse(response_result)"/>
					</div>
				</template>

				<template v-else>
					<pre class="whitespace-pre-wrap break-words">{{ response_result }}</pre>
				</template>
			</div>
		</div>

		<div v-if="activeTab === 'Compare'">
			<!-- Content -->

			<div v-if="response_result" class="tab-content">
				<div class="legend flex flex-col p-2 w-64 m-4">
					<div class="flex items-center mb-2">
						<div class="system-role w-10 h-4 rounded mr-2"></div>
						<span class="text-sm text-gray-600">Inspector Comments</span>
					</div>
					<div class="flex items-center">
						<div class="user-role w-10 h-4 bg-gray-100 rounded mr-2"></div>
						<span class="text-sm text-gray-600">AI Comments</span>
					</div>
				</div>
				<div class="place-content-center" style="min-height: 500px">
					<div v-for="(area, id) in formattedData" :key="id" class="pl-4">

						<div class="text-content highlight-input highlight-area user-role">
							<!-- Area Name -->
							<div class="text-lg text-gray-600 pl-1">
								<span class="font-bold"> {{ area.name }}</span>
							</div>
						</div>

						<!-- Area Summary -->
						<div class="text-md text-gray-800 mt-2 system-role" v-if="idMessageMap['r' + id]">
							{{ idMessageMap['r' + id] }}
						</div>
						<div class="text-md text-gray-800 mt-2 user-role">
							{{ area.summary }}
						</div>

						<!-- List of Photos with Comments -->
						<div v-if="area.photos.length > 0" class="mt-4 mb-5">
							<!-- Flex container for photos -->
							<div class="flex flex-wrap gap-6">
								<!-- Individual photo block -->
								<div v-for="(photo, index) in area.photos" :key="index" class="flex items-stretch space-x-4 w-auto">
									<!-- Photo -->
									<div class="w-64">
										<a :href="getInputImage(photo.path)" target="_blank">
											<img :src="getInputThumbImage(photo.path)" alt="Image" class="rounded-lg shadow-lg w-full"/>
										</a>
									</div>
									<!-- Comments -->
									<div class="flex flex-col justify-start rounded-lg w-64">
										<!-- User comment -->
										<div class="system-role p-2" v-if="idMessageMap['s' + photo.id]">
											<p class="text-content text-gray-600">
												<span>{{ idMessageMap['s' + photo.id] }}</span>
											</p>
										</div>
										<!-- AI comment -->
										<div class="user-role p-2 mt-2" v-if="photo.comment && photo.comment !== 'NONE'">
											<p class="text-content font-medium text-gray-800">
												{{ photo.comment }}
											</p>
										</div>
									</div>

								</div>
							</div>
						</div>

						<div v-else class="mt-4 text-gray-500">NONE</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Error Message -->
		<div v-if="error" class="mt-6 text-center text-red-600">
			<p>{{ error }}</p>
		</div>
	</div>

	<div v-if="loading" class="fixed inset-0 z-[60] bg-white/[.6] grid place-content-center">
		<SimpleLoader class="place-content-center"></SimpleLoader>
	</div>

	<ModalConfirm :show="showAIAlert" confirmButtonClass="bg-[#B71A1A]"
				  message="Are you sure you want to generate AI comments ?" title="Generate AI Comments"
				  @cancelled="cancelAIAlert" @confirmed="generateComments()"/>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue';
import useApiRequest from "@/composables/request";
import {RouterLink, useRoute} from "vue-router";
import ModalConfirm from "@/themes/landlord/layouts/ModalConfirm.vue";
import SimpleLoader from "@/components/elements/SimpleLoader.vue";
import Signal from "@/composables/signal";
import {JsonViewer} from "vue3-json-viewer"
import "vue3-json-viewer/dist/index.css";


// Reactive variables
const activeTab = ref('Request');
const tabs = ['Request', 'Response', 'Compare'];  // Tab names
const isRawView = ref(false);  // Default to formatted view (toggle off)
const messages = ref([]); // Ensure messages is initialized as an array
const images = ref([]);
const response_result = ref();
const parsedResponseData = ref([]);
const input = ref();
const loading = ref(false);
const error = ref('');
const insid = ref("");
const context = ref("");
const context_id = ref("");
const request = useApiRequest();
const route = useRoute();
const propertyDetails = ref({});
const logId = ref("");
const logStatusId = ref(-1);
const showAIAlert = ref(false);
const shouldShowTabs = computed(() => logStatusId.value === -1);
const mainSummary = ref('');
const areas = ref([]);
const areaGrid = ref([]);  // Declare areaGrid to store formatted area data
const idMessageMap = ref([]);
const goBack = () => {
	window.history.go(-1); // This will go back to the previous page
};

const handleTabClick = (tab) => {
	activeTab.value = tab;
	if (tab === 'Response') {
		//parseResponse(response_result.value);
		formatData();
	}
	else if (tab === 'Compare') {
		compareReport();
	}
};
const isJson = (str) => {
	try {
		JSON.parse(str);
		return true;
	} catch (e) {
		return false;
	}
}
const highlightJson = (jsonString) => {
	try {
		// Parse the string if it contains a preformatted JSON block
		const match = jsonString.match(/```json\n([\s\S]*?)\n```/);
		const extractedJson = match ? match[1] : jsonString;

		// Parse and format the extracted JSON
		const jsonObject = JSON.parse(extractedJson);
		return `<code>${JSON.stringify(jsonObject, null, 2).replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')}</code>`;
	} catch {
		// Return raw content if parsing fails
		return jsonString;
	}
}

const compareReport = async () => {
	loading.value = true;
	const response = await request.post('propertymanager/ai/ins-comments', {
		ins_id: insid.value
	});
	loading.value = false;
	const data = response.data.data;
	if(data) {
		for (let i = 0; i < data.length; i++) {
			const item = data[i];
			idMessageMap.value[item.id] = item.message;
		}
	}
}

const fetchContext = async () => {
	insid.value = route.query.context_id;
	const response = await request.post('propertymanager/ai/context', {
		context: route.query.context,
		context_id: route.query.context_id,
	});
	if (response.data) {
		propertyDetails.value = response.data;
	}
}

const openAIAlert = async () => {
	showAIAlert.value = true;
}
const generateComments = async () => {
	showAIAlert.value = false;
	loading.value = true;
	const response = await request.post('propertymanager/ai/generate', {
		method: 'POST',
		data: {
			logId: logId.value,
		}
	});

	if (response.data.message) {
		Signal.success(response.data.message);
		response_result.value = response.data.response_result;
		input.value = response.data.input;
		logStatusId.value = response.data.status;
	} else if (response.data.error) {
		Signal.error(response.data.error);
	} else if (response.error) {
		console.log('error is:' , response);
		Signal.error(response.message);
	}
	loading.value = false;
}

const formattedData = computed(() => {
	// Method to format the response data and input data
	return formatData()
})
const formatData = () => {
	const result = {};

	// Ensure input.value is not undefined or null before parsing
	if (!input.value) {
		console.error('Input data is missing or invalid.');
		return result;
	}

	console.log('input.value is');
	console.log(input.value);

	// Check if input.value and response_result.value are valid JSON strings
	let parsedInputData;
	try {
		parsedInputData = typeof input.value === 'string' ? JSON.parse(input.value) : input.value;
	} catch (e) {
		console.error('Error parsing input data:', e);
		return result;
	}

	console.log(parsedInputData);

	try {
		parsedResponseData.value = typeof response_result.value === 'string' ? JSON.parse(response_result.value) : response_result.value;
	} catch (e) {
		console.error('Error parsing response data:', e);
		return result;
	}

	// Log the parsed response data to inspect the structure
	console.log('Parsed Response Data:', parsedResponseData.value);

	// Ensure necessary fields exist
	if (
		parsedResponseData.value &&
		parsedResponseData.value.choices &&
		parsedResponseData.value.choices.length > 0
	) {
		const firstChoice = parsedResponseData.value.choices[0];

		// Log the message part of the first choice
		const message = firstChoice.message;

		// Parse the content from the message (since it's a stringified JSON)
		let content;
		try {
			// Check if the content is already a parsed JSON object or needs to be parsed again
			//content = typeof message.content === 'string' ? JSON.parse(message.content) : message.content;
			console.log("message.content is",message.content);
			//content = JSON.parse(message.content.replace(/\\n/g, '').replace(/\\"/g, '"'));
			content = message.content.replace(/^```json\n|```$/g, ""); // Removes ```json\n at the start and ``` at the end
			content = JSON.parse(content.replace(/\\n/g, '').replace(/\\"/g, '"'));
			console.log("message.content after is",message.content);
		} catch (e) {
			console.error('Error parsing message content:', e);
			return result;
		}

		// Check if the parsed content contains area data
		if (content && content.area) {
			const areas = content.area;
			const areaIds = Object.keys(areas);

			// Loop through all area IDs to build the result
			for (let i = 0; i < areaIds.length; i++) {
				const areaId = areaIds[i];
				const area = areas[areaId];
				const inputArea = parsedInputData[areaId];
				//console.log("inputArea is:",JSON.stringify(inputArea));
				//console.log("Response photo index:",JSON.stringify(area.photos));
				var photoStartIndex = 0;
				if(area.photos) {
					const photoIndexArray = Object.keys(area.photos); // Get all photo keys
					//console.log("photoIndexArray is:",JSON.stringify(photoIndexArray));
					if(photoIndexArray.length > 0) {
						photoStartIndex = photoIndexArray[0]*1;
						//console.log("photoStartIndex:",photoStartIndex);
					}
				}
				if (inputArea) {
					result[areaId] = {
						id: areaId,
						name: inputArea.name,
						photos: [],
						summary: area.summary,
					};

					if (inputArea.photos) {
						const photoKeys = Object.keys(inputArea.photos); // Get all photo keys
						//console.log("PhotoKeys are:",JSON.stringify(photoKeys));
						for (let j = 0; j < photoKeys.length; j++) {
							const photoKey = photoKeys[j];
							//const photoNumber = j + photoStartIndex;
							const photoNumber = photoKey;
							const photoPath = inputArea.photos[photoKey];

							// Map the comment based on the photoKey
							const photoComment = area.photos && area.photos[photoNumber]
								? area.photos[photoNumber] // Comment is now directly accessed from area.photos[photoKey]
								: "No comment available";

							// Push the result
							result[areaId].photos.push({
								path: `${photoPath}`,
								comment: photoComment,
								id:photoKey
							});
						}
					}
				}
			}
		} else {
			console.error('Missing area data in the response.');
		}
	} else {
		console.error('Invalid response_data format. Missing necessary fields or structure.');
	}

	console.log('result is');
	console.log(result);
	return result;
};


const parseResponse = async (response_data) => {
	try {
		// Parse the response data string
		const parsedResponse = JSON.parse(response_data);
		const content = parsedResponse.choices[0].message.content; // Extract content

		// Parse the content to extract the summary and area data
		const parsedData = JSON.parse(content);

		// Extract the main summary
		mainSummary.value = parsedData.summary;

		// Check if the 'area' exists and log it
		if (parsedData.area) {
			areas.value = parsedData.area;

			const areaDetails = Object.keys(parsedData.area).map(areaId => {
				const area = parsedData.area[areaId];

				// Find area message from messages.value where the areaId is mentioned
				let areaMessage;
				for (let i = 0; i < messages.value.length; i++) {
					if (messages.value[i].role === "user" && messages.value[i].content) {
						for (let j = 0; j < messages.value[i].content.length; j++) {
							const text = messages.value[i].content[j].text;
							if (text && text.includes("Area:")) {
								const regex = /Area:\s([A-Za-z\s]+)\s\(Area ID:\s(\d+)\)/;
								const match = text.match(regex);

								if (match) {
									// Extract area name and area ID
									let _areaName = match[1].trim(); // 'Roof'
									let _areaId = match[2]; // '2278'

									// Check if the areaId matches
									if (_areaId === areaId) {
										areaMessage = {
											areaName: _areaName,
											areaId: _areaId,
										};
									}
								}
							}
						}
					}
				}

				// If areaMessage is found, extract the details
				const areaName = areaMessage ? areaMessage.areaName : `Area (ID: ${areaId})`;

				// Return formatted area details
				return {
					areaName: `Area: ${areaName} (ID: ${areaId})`,
					areaId: areaId,
					areaSummary: area.summary,
					photoComments: area.photos,
				};
			});

			// Populate areaGrid with the area details
			areaGrid.value = areaDetails;

		} else {
			console.log("No area data available.");
		}
	} catch (error) {
		console.error("Error parsing response data:", error);
	}
};


const cancelAIAlert = async () => {
	showAIAlert.value = false;
}

onMounted(async () => {
	context.value = route.query.context;
	context_id.value = route.query.context_id;
	logId.value = route.query.log_id;

	fetchContext();
	if (context_id.value) {
		try {
			loading.value = true;

			// Fetch data
			const responseMessages = await request.post('propertymanager/ai/messages', {
				method: 'POST',
				data: {
					inspectionId: context_id.value,
					inspectionType: 'Routine',
					logId: logId.value,
				}
			});

			// Validate and assign messages
			messages.value = responseMessages.data.messages || [];
			images.value = responseMessages.data.images || [];
			response_result.value = responseMessages.data.responseResult;
			input.value = responseMessages.data.input;
			logId.value = responseMessages.data.logId;
			updateLogId(logId.value);
			logStatusId.value = responseMessages.data.logStatusId;
		} catch (err) {
			error.value = 'Error: ' + (err.response?.data?.message || err.message);
		} finally {
			loading.value = false;
		}
	}
});

function updateLogId(newLogId) {
	const url = new URL(window.location.href);
	url.searchParams.set('log_id', newLogId);
	window.history.replaceState(null, '', url.toString());
}

function getInputImage(url) {
	return  '/media/' + url;
}
function getInputThumbImage(url) {
	const lastSlashIndex = url.lastIndexOf('/');
	const thumbUrl = url.slice(0, lastSlashIndex) + '/thumb' + url.slice(lastSlashIndex);
	return '/media/' + thumbUrl || "Image not found";
}
function getImage(url) {
	const id = url.split('/').pop();
	return images.value[id] || "Image not found";
}

function getThumbImage(url) {
	const id = url.split('/').pop();
	const img_url = images.value[id] || "";
	const lastSlashIndex = img_url.lastIndexOf('/');
	// Insert 'thumb/' before the last part of the URL
	const thumbUrl = img_url.slice(0, lastSlashIndex) + '/thumb' + img_url.slice(lastSlashIndex);
	return thumbUrl || "Image not found";
}
</script>

<style scoped>
.message-container {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.role {
	font-weight: bold;
	text-transform: capitalize;
	padding: 10px;
	background-color: lightgray;
}

.content {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}

.text-content {
	flex-basis: 100%;
	font-weight: 500;
}

/* Content container */
.tab-content {
	padding: 5px;
	border: solid 1px #ccc;
	background-color: #fff;
	overflow: auto;
}

.image-content img {
	width: 57px;
	height: 57px;
	/* border-radius: 10%; */
	object-fit: cover;
	cursor: pointer;
}

.tabs-container {
	display: flex;
	width: 100%;
}

.tabs {
	display: flex;
}

.tab {
	padding: 10px 20px;
	cursor: pointer;
	border: solid 1px #e5e7eb;
	background-color: #e5e7eb;
	font-weight: bold;
	margin-right: 4px;
	/* Reduced margin between tabs */
}

.tab.active {
	background-color: #d3d3d3;
	/* color: white; */
}

/* Style for the grid table */
.grid-table {
	width: 100%;
	border-collapse: collapse;

	font-size: 16px;
	text-align: left;
}

.grid-table th,
.grid-table td {
	padding: 12px 15px;
	border: 1px solid #ddd;
}

.grid-table th {
	background-color: #f4f4f4;
	font-weight: bold;
}

.grid-table {
	width: 100%;
	border-collapse: collapse;
}

.grid-table th,
.grid-table td {
	padding: 10px;
	border: 1px solid #ccc;
	text-align: left;
}

.system-role {
	color: rgb(13, 13, 13);
	background-color: #dcedfb;
	padding: 5px;
	border-radius: 5px;
}

.user-role {
	color: rgb(13, 13, 13);
	/* background-color: #fbf2e4; */
	background-color: #e3f8d5;
	padding: 5px;
	border-radius: 5px;
}

.highlight-input {
	background-color: rgba(232, 232, 232, 0.5);
}

.highlight-area {
	font-weight: bold;
}

.generate-comments-btn {
	margin-left: auto;
	padding: 10px 20px;
	background-color: #032354;
	color: white;
	border: none;
	cursor: pointer;
}

.generate-comments-btn:hover {
	background-color: #0056b3;
}

.go-back-btn {
	margin-left: auto;
	padding: 10px 20px;
	margin-top: 10px;
	background-color: #007BFF;
	color: white;
	border: none;
	cursor: pointer;
}
</style>

<style scoped>
/* Toggle Switch Styles */
.toggle-container {
	display: flex;
	align-items: center;
	gap: 10px;
	margin: 10px 0 0 10px;
}

.toggle-switch {
	position: relative;
	display: inline-block;
	width: 60px;
	height: 34px;
}

.toggle-switch input {
	opacity: 0;
	width: 0;
	height: 0;
}

.slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #ccc;
	transition: .4s;
	border-radius: 34px;
}

.slider:before {
	position: absolute;
	content: "";
	height: 26px;
	width: 26px;
	left: 4px;
	bottom: 4px;
	background-color: white;
	transition: .4s;
	border-radius: 50%;
}

input:checked + .slider {
	background-color: #007BFF;
}

input:checked + .slider:before {
	transform: translateX(26px);
}

.toggle-label {
	font-weight: bold;
	color: #333;
}

.prompts-heading {
	font-size: 20px;
	font-weight: bold;
	margin-bottom: 10px;
	color: #333;
}
</style>
<style scoped>
::v-deep(.jv-container.jv-light .jv-item.jv-string) {
	color: green;
	font-size: 16px;
	font-weight: 500;
	font-family: Menlo;
}

::v-deep(.jv-key) {
	font-family: Menlo;
	font-size: 16px;
	font-weight: 500;
}

::v-deep(.jv-item.jv-number.jv-number-integer.jv-push) {
	font-family: Menlo;
	font-size: 16px;
	font-weight: 500;
	color: red;
}
</style>
