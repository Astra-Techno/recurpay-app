<template>
	<div class="list-container">
		<!-- Instance-specific loader -->
		<loader :loading="isLoading"></loader>

		<slot name="header-top"></slot>

		<slot name="header-title">
			<h2 class="header-title" v-if="title?.trim()">
				{{ title }}
			</h2>
		</slot>

		<slot name="header-bottom"></slot>

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

		<div class="table-responsive" v-if="tmpl === 'table'">
			<table class="w-full">
				<thead>
					<tr class="t-head">
						<HeaderColumn v-for="(header, i) in headers" :key="i" :column="header"
							:active-sort-field="activeSortBy" :active-sort-direction="activeSortOrder"
							@sort="sort(header)">
							<slot :name="`head-${header.field}`" :header="header">{{ header.title }}</slot>
						</HeaderColumn>
					</tr>
				</thead>

				<tbody>
					<tr class="t-row" v-if="!rows.length">
						<td :colspan="headers.length" class="!text-center">
							{{ $t(messages.empty ?? 'No more records found') }}
						</td>
					</tr>

					<tr class="t-row" v-for="(item, i) in visibleRows" :key="i" :class="{'cursor-pointer' : emitRowClick, ['row-'+i] : true}" @click="rowClick(item)">
						<RowColumn v-for="(header, j) in headers" :key="j" :column="header" :item="item">
							<slot :name="`row-${header.field}`" :item="item"></slot>
						</RowColumn>
					</tr>
				</tbody>
			</table>
		</div>

		<ul class="base-list" v-if="tmpl === 'list'">
			<li class="list-row" v-for="(item, i) in visibleRows" :key="i">
				<slot name="li-item" :item="item"></slot>
			</li>
			<li class="p-4 mb-4" v-if="!rows.length">
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
import { ref, computed, watch, onMounted, defineEmits } from 'vue';
import HeaderColumn from './HeaderColumn.vue';
import RowColumn from './RowColumn.vue';
import Pagination from './Pagination.vue';
import useApiRequest from '@/composables/request';
import Signal from '@/composables/signal';
import loader from '@/components/elements/Loader.vue';

const props = defineProps({
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
});

const isLoading = ref(false);
const filter = ref({});
const rows = ref([]);
const groupLabels = ref([]);
const activeSortBy = ref(props.sortBy);
const activeSortOrder = ref(props.sortOrder);
const open_search = ref(false);
const emit = defineEmits(["row-click"]);

const pagination = ref({
	page: 1,
	total: 0,
	totalPages: 0,
	itemStart: 0,
	itemCount: 0,
	buttons: [],
	limit: props.pageLimit,
});

const visibleRows = computed(() => rows.value.slice(0, props.pageLimit));

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
	goFirst, goNext, goPrev, goTo, total, rows, currentPage, totalPages, filter
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
</style>
