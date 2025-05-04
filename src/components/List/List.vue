<template>
	<div class="list-container">
		<!-- Instance-specific loader -->
		<!-- <loader :loading="isLoading"></loader> -->

		<SkeletonLoader v-if="isLoading" :count="3" class="mt-4" />

		<slot name="header-top"></slot>

		<div class="flex justify-between items-center">
			<slot name="header-title">
				<h2 class="header-title" v-if="title?.trim()">
					{{ title }}
				</h2>
			</slot>

			<div class="flex space-x-2" v-if="showEditOption">
				<button v-if="enableAdd" @click="openModal('add')" class="action-button">
					Add New
				</button>

				<select v-model="displayMode" class="border rounded px-3 py-1">
					<option value="normal">Normal View</option>
					<option value="edit-display">Edit Display</option>
					<option value="inline-edit">Inline Edit</option>
					<option value="popup-edit">Popup Edit</option>
				</select>
			</div>
		</div>

		<slot name="header-bottom"></slot>

		<!-- Add/Edit Modal -->
		<Modal :show="showModal" @close="closeModal">
			<template #header>
				<h3 class="text-lg font-semibold">{{ modalTitle }}</h3>
			</template>

			<FormKit type="form" @submit="handleSubmit" :actions="false">
				<div class="space-y-4">
					<template v-for="header in formHeaders" :key="header.field">
						<!-- Check if edit slot exists for this field -->
						<template v-if="$slots[`edit-${header.field}`]">
							<div class="formkit-outer">
								<label class="formkit-label">{{ header.title }}</label>
								<div class="formkit-inner">
									<slot :name="`edit-${header.field}`" :value="formData[header.field]"
										:item="formData" :field="header.field" />
								</div>
							</div>
						</template>
						<template v-else>
							<FormKit :type="header.inputType || 'text'" :name="header.field" :label="header.title"
								:validation="header.validation || ''" v-model="formData[header.field]"
								:options="header.options" />
						</template>
					</template>
				</div>

				<div class="modal-footer flex flex-row gap-2 my-4">
					<button type="button" @click="closeModal" class="action-button">
						Cancel
					</button>
					<button type="submit" class="action-button">
						{{ modalAction === 'add' ? 'Create' : 'Update' }}
					</button>
				</div>
			</FormKit>
		</Modal>

		<!-- Existing filter/search components -->
		<slot name="filter-toggle" v-if="filterToggle">
			<div class="filter-toggle">
				Search by:
				<label class="text-tcolor bg-transparent w-full pl-1 cursor-pointer py-2 text-default pt-2 pb-2"
					@click="open_search = !open_search">
					<img :src="open_search ? '/assets/images/close.svg' : '/assets/images/open.svg'"
						class="icon_size float-right cursor-pointer" />
				</label>
			</div>
		</slot>

		<div @click="handleSearchIconClick">
			<FormKit v-if="search" type="text" :label="searchLabel" :placeholder="searchPlaceHolder"
				v-model="filter.keyword" @keyup.enter="goFirst()" suffix-icon="search"
				suffix-icon-class="cursor-pointer" />
		</div>

		<slot name="filter" :filter="filter"></slot>
		<slot name="filter-bottom"></slot>

		<!-- Table template -->
		<div class="table-responsive" v-if="tmpl === 'table'">
			<table class="w-full">
				<thead>
					<tr class="t-head">
						<HeaderColumn v-for="(header, i) in headers" :key="i" :column="header"
							:active-sort-field="activeSortBy" :active-sort-direction="activeSortOrder"
							@sort="sort(header)">
							<slot :name="`head-${header.field}`" :header="header">{{ header.title }}</slot>
						</HeaderColumn>
						<th class="t-col text-left cursor-pointer align-middle"
							v-if="editable && displayMode !== 'edit-display'">Actions</th>
					</tr>
				</thead>

				<tbody>
					<tr class="t-row" v-if="!rows.length && !isLoading">
						<td :colspan="headers.length + ((editable && displayMode !== 'edit-display') ? 1 : 0)"
							class="!text-center">
							{{ $t(messages.empty ?? 'No more records found') }}
						</td>
					</tr>

					<tr class="t-row" v-for="(item, i) in visibleRows" :key="i" :class="{
						'cursor-pointer': emitRowClick,
						['row-' + i]: true,
						'edit-row': displayMode === 'edit-display',
						'bg-blue-50': editMode === i
					}" @click="handleRowClick(item)">
						<RowColumn v-for="(header, j) in headers" :key="j" :column="header" :item="item">
							<template
								v-if="displayMode === 'edit-display' || (displayMode === 'inline-edit' && editMode === i)">
								<template v-if="$slots[`edit-${header.field}`]">
									<!-- Pass the current value and handle changes -->
									<slot :name="`edit-${header.field}`" :value="item[header.field]" :item="item"
										:field="header.field" :title="header.title" />
								</template>
								<template v-else>
									<FormKit :type="header.inputType || 'text'" v-model="item[header.field]"
										:label="header.title" :placeholder="header.title" :options="header.options"
										outer-class="mb-0" />
								</template>
							</template>

							<template v-else>
								<slot :name="`row-${header.field}`" :item="item">
									{{ item[header.field] }}
								</slot>
							</template>
						</RowColumn>
						<td v-if="editable && displayMode !== 'edit-display'" class="t-col">
							<div class="flex flex-row gap-2">
								<template v-if="displayMode === 'inline-edit' && editMode === i">
									<Icon name="IconSave" @click="saveRow(i)" class="cursor-pointer" />
									<Icon name="X" :stroke-width="3" @click="cancelEdit" class="cursor-pointer" />
									<!--
									<button @click="saveRow(i)" class="action-button success">Save</button>
									<button @click="cancelEdit" class="action-button">Cancel</button>
									-->
								</template>
								<template v-else>

									<Icon name="IconPencil" v-if="displayMode === 'inline-edit'" class="cursor-pointer"
										@click.stop="editRow(i)" />

									<Icon name="IconPencil" v-if="displayMode === 'popup-edit'" class="cursor-pointer"
										@click.stop="openModal('edit', item)" />

									<Icon name="IconTrash" class="cursor-pointer" @click.stop="deleteItem(item)" />

									<!--
									<button v-if="displayMode === 'inline-edit'" @click.stop="editRow(i)"
										class="action-button">
										Edit
									</button>
									<button v-if="displayMode === 'popup-edit'" @click.stop="openModal('edit', item)"
										class="action-button">
										Edit
									</button>
									<button @click.stop="deleteItem(item)" class="action-button bg-red-500">
										Delete
									</button>
									-->
								</template>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Rest of existing templates -->
		<ul class="base-list" v-if="tmpl === 'list'">
			<li class="list-row" v-for="(item, i) in visibleRows" :key="i">
				<slot name="li-item" :item="item"></slot>
			</li>
			<li class="p-4 mb-4" v-if="!rows.length && !isLoading">
				<h2 class="text-base text-center">
					{{ $t(messages.empty) }}
				</h2>
			</li>
		</ul>

		<div class="grouped-list" v-if="tmpl === 'grouped-list'">
			<template v-for="(group, i) in groupLabels" :key="i">
				<h2 class="group-header">{{ group.group_label }} ({{ group.total }})</h2>
				<ul class="base-list">
					<li class="border rounded-[5px] p-4 mb-4" v-for="(item, j) in rows[group.group_label]" :key="j">
						<slot name="li-item" :item="item"></slot>
					</li>
				</ul>
			</template>
			<h2 v-if="!pagination.total" class="text-base text-center">
				{{ $t(messages.empty) }}
			</h2>
		</div>

		<slot name="body" :rows="rows"></slot>

		<Pagination v-if="showPagination && !lazyLoad && pagination.totalPages > 1" :options="pageOptions"
			:config="pagination" :title="title" @go-to="goTo" @go-first="goFirst" @go-last="goLast" @go-prev="goPrev"
			@go-next="goNext" @set-page-limit="setPageLimit" />

		<slot name="footer" v-if="rows.length"></slot>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import Modal from './Modal.vue';
import HeaderColumn from './HeaderColumn.vue';
import RowColumn from './RowColumn.vue';
import Pagination from './Pagination.vue';
import useApiRequest from '@/composables/request';
import Signal from '@/composables/signal';
import loader from '@/components/elements/Loader.vue';
import SkeletonLoader from '../common/SkeletonLoader.vue';

const props = defineProps({
	// Original props
	title: String,
	tmpl: { type: String, default: 'table' },
	headers: { type: Array, default: () => [] },
	items: { type: Array, default: () => [] },
	dataUrl: { type: String, default: '' },
	sortBy: String,
	sortOrder: { type: String, default: 'desc' },
	lazyLoad: { type: Boolean, default: false },
	showPagination: { type: Boolean, default: true },
	pageLimit: { type: Number, default: 20 },
	pageOptions: { type: Array, default: () => [10, 20, 30, 50, 100] },
	search: { type: Boolean, default: true },
	searchLabel: String,
	searchPlaceHolder: { type: String, default: 'Search..' },
	filterToggle: { type: Boolean, default: true },
	messages: { type: Object, default: () => ({}) },
	emitRowClick: { type: Boolean, default: false },
	showEditOption: { type: Boolean, default: false },
	editable: { type: Boolean, default: false },
	enableAdd: { type: Boolean, default: false },
	idField: { type: String, default: 'id' },
	formHeaders: { type: Array, default: () => [] },
	defaultDisplayMode: { type: String, default: 'normal' }
});

const emit = defineEmits(["row-click", "item-added", "item-updated", "item-deleted", "add-row", "save-row", "delete-row"]);

// Display mode state
const displayMode = ref(props.defaultDisplayMode);
const editMode = ref(null);
const editedItem = ref(null);

// Original reactive state
const isLoading = ref(false);
const filter = ref({});
const rows = ref([]);
const groupLabels = ref([]);
const activeSortBy = ref(props.sortBy);
const activeSortOrder = ref(props.sortOrder);
const open_search = ref(false);
const showModal = ref(false);
const modalAction = ref('add');
const formData = ref({});
const currentItem = ref(null);

const pagination = ref({
	page: 1,
	total: 0,
	totalPages: 0,
	itemStart: 0,
	itemCount: 0,
	buttons: [],
	limit: props.pageLimit,
});

// Computed properties
const visibleRows = computed(() => rows.value.slice(0, props.pageLimit));
const formHeaders = computed(() =>
	props.formHeaders.length > 0 ? props.formHeaders : props.headers
);
const modalTitle = computed(() =>
	modalAction.value === 'add' ? 'Add New Record' : 'Edit Record'
);

// Watch for changes in dataUrl and reload the list
watch(() => props.dataUrl, (newUrl) => {
	if (newUrl) {
		goFirst(); // Reset to the first page and reload data
	}
});

const total = ref(0);
const currentPage = ref(0);
const totalPages = ref(0);

onMounted(() => {
	loadItems();
});

watch(() => props.items, (newVal) => {
	rows.value = newVal;
});

const request = useApiRequest();

async function loadItems() {
	if (!isValidUrl()) {
		rows.value = props.items;
		return;
	}

	const params = {
		page: pagination.value.page,
		limit: pagination.value.limit,
		sort_by: activeSortBy.value,
		sort_order: activeSortOrder.value,
		...removeEmpty(filter.value),
	};

	isLoading.value = true;
	const response = await request.post(props.dataUrl, params);
	isLoading.value = false; // Hide loader

	if (response.error) {
		Signal.error(response.message);
		return;
	}

	rows.value = response.data.items;
	groupLabels.value = response.data.group_total ?? [];
	setupPagination(response.data.items.length, response.data.total);
}

// Methods
function handleRowClick(item) {
	if (displayMode.value === 'edit-display') {
		return;
	}
	emit("row-click", item);
}

function editRow(index) {
	if (displayMode.value === 'inline-edit') {
		editMode.value = index;
		editedItem.value = { ...rows.value[index] };
	}
}

function saveRow(index) {
	if (displayMode.value === 'inline-edit') {
		emit('save-row', {
			...rows.value[index],
			[props.idField]: rows.value[index][props.idField]
		});
		editMode.value = null;
	}
}

function cancelEdit() {
	if (displayMode.value === 'inline-edit') {
		if (editedItem.value) {
			Object.assign(rows.value[editMode.value], editedItem.value);
		}
		editMode.value = null;
		editedItem.value = null;
	}
}

// New modal methods
function openModal(action, item = null) {
	modalAction.value = action;
	currentItem.value = item;
	formData.value = item ? { ...item } : {};
	showModal.value = true;
}

function closeModal() {
	showModal.value = false;
	formData.value = {};
	currentItem.value = null;
}

async function handleSubmit() {
	try {
		isLoading.value = true;
		let response;

		if (modalAction.value === 'add') {
			response = await request.post(props.dataUrl, formData.value);
			emit('item-added', response.data);
		} else {
			const url = `${props.dataUrl}/${currentItem.value[props.idField]}`;
			response = await request.put(url, formData.value);
			emit('item-updated', response.data);
		}

		await loadItems();
		closeModal();
		Signal.success('Operation completed successfully');
	} catch (error) {
		Signal.error(error.message || 'Operation failed');
	} finally {
		isLoading.value = false;
	}
}

async function deleteItem(item) {
	emit('delete-row', item);
}

watch(displayMode, (newMode) => {
	if (newMode !== 'inline-edit') {
		editMode.value = null;
		editedItem.value = null;
	}
});

function removeEmpty(obj) {
	return Object.fromEntries(
		Object.entries(obj).filter(([_, value]) => {
			if (typeof value === 'object' && value !== null) {
				return Object.keys(removeEmpty(value)).length > 0;
			}
			return value !== null && value !== '' && (!Array.isArray(value) || value.length > 0);
		})
	);
}

function isValidUrl() {
	return props.dataUrl?.trim() && props.dataUrl.trim() !== '/';
}

function sort(column) {
	if (!column.sortField) return;

	if (activeSortBy.value === column.sortField && activeSortOrder.value === 'asc') {
		activeSortOrder.value = 'desc';
	} else {
		activeSortOrder.value = 'asc';
	}

	activeSortBy.value = column.sortField;
	goFirst();
}

function setupPagination(itemCount, itemTotal) {
	pagination.value.total = itemTotal;
	pagination.value.totalPages = Math.ceil(itemTotal / pagination.value.limit);
	pagination.value.itemStart = (pagination.value.page - 1) * pagination.value.limit + 1;
	pagination.value.itemCount = (pagination.value.page - 1) * pagination.value.limit + itemCount;

	total.value = itemTotal;
	currentPage.value = pagination.value.page;
	totalPages.value = pagination.value.totalPages;

	const displayedPages = 10;
	let buttonStart = Math.max(1, pagination.value.page - Math.floor(displayedPages / 2));
	const buttonEnd = Math.min(pagination.value.totalPages, buttonStart + displayedPages - 1);

	pagination.value.buttons = Array.from({ length: buttonEnd - buttonStart + 1 }, (_, i) => buttonStart + i);
}

const handleSearchIconClick = (event) => {
	// Check if the clicked element is the suffix icon
	if (event.target.closest('.formkit-suffixIcon')) {
		goFirst();
	}
};

function setPageLimit(n) {
	pagination.value.limit = n;
	loadItems();
}

function setPage(n) {
	pagination.value.page = n;
	loadItems();
}

function goTo(n) {
	setPage(n);
}

function goFirst() {
	setPage(1);
}

function goLast() {
	setPage(pagination.value.totalPages);
}

function goPrev() {
	if (pagination.value.page > 1) setPage(pagination.value.page - 1);
}

function goNext() {
	if (pagination.value.page < pagination.value.totalPages) setPage(pagination.value.page + 1);
}

function rowClick(item) {
	emit("row-click", item);
}

defineExpose({
	goFirst, goNext, goPrev, goTo, total, rows, currentPage, totalPages, filter, editRow, saveRow, cancelEdit,isLoading
});
</script>

<style>
.v-enter-active,
.v-leave-active {
	transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}

.icon_size {
	width: 20px;
}

/* Edit display mode styles */
.edit-row .formkit-wrapper {
	@apply mb-0;
}

.edit-row .formkit-input {
	@apply p-1 text-sm border border-gray-300 rounded;
}

/* Row highlight */
.edit-row {
	@apply bg-gray-50;
}

/* Mode selector */
select {
	@apply border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm;
}
</style>
