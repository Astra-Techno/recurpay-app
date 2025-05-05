<template>
	<div class="list-container">
		<!-- <loader :loading="_loaderGif"></loader> -->

        <SkeletonLoader :count="3" class="mt-4" />

        <slot name="header-top"></slot>

		<slot name="header-title">
			<h2 class="header-title" v-if="title != null && title.trim() != ''">{{ title }}</h2>
		</slot>

        <slot name="header-bottom"></slot>

		<slot name="filter-toggle" v-if="filterToggle == true">
		    <div class="filter-toggle">
		    	Search by:
		    	<label class="text-tcolor  bg-transparent w-full pl-1 cursor-pointer py-2 text-default pt-2 pb-2" @click="open_search = !open_search" >
		            <img v-if="!open_search" class="icon_size float-right cursor-pointer" src="/assets/images/open.svg"/>
		            <img v-if="open_search" class="icon_size float-right cursor-pointer" src="/assets/images/close.svg"/>
		        </label>
		    </div>
		</slot>

		<FormKit v-if="search" type="text" :label="searchLabel" :placeholder="searchPlaceHolder" v-model="filter.search"  @keyup.enter="goFirst()"/>

		<slot name="filter" :filter="filter"></slot>

		<slot name="filter-bottom"></slot>

		<div class="table-responsive" v-if="tmpl == 'table'">
		    <table class="w-full">
		        <thead>
		            <tr class="t-head">
		                <template v-for="(header, i) in headers">
		                    <HeaderColumn :column="header" :active-sort-field="activeSortBy" :active-sort-direction="activeSortOrder" @sort="sort(header)">
		                        <slot :name="'head-' + `${header.field}`" :header="header">{{ header.title }}</slot>
		                    </HeaderColumn>
		                </template>
		            </tr>
		        </thead>

		        <tbody>
		            <tr class="t-row" v-if="rows.length == 0">
		                <td :colspan="headers.length" class="!text-center">No data available.</td>
		            </tr>

		            <tr class="t-row" v-else v-for="(item, i) in rows" :class="'row-' + i">
		                <template v-for="(header, i) in headers">
		                    <RowColumn :column="header" :item="item">
		                        <slot :name="'row-' + `${header.field}`" :item="item"></slot>
		                    </RowColumn>
		                </template>
		            </tr>
		        </tbody>
		    </table>
		</div>

		<ul class="base-list" v-if="tmpl == 'list'">
			<li class="border rounded-[5px] p-4 mb-4" v-for="(item, i) in  rows">
				<slot name="li-item" :item="item"></slot>
			</li>
		</ul>

		<slot name="body" :rows="rows"></slot>

		<Pagination v-if="lazyLoad == false && pagination.total > 0" :options="pageOptions" :config="pagination"
			:title="title" @go-to="goTo" @go-first="goFirst" @go-last="goLast" @go-prev="goPrev" @go-next="goNext"
			@set-page-limit="setPageLimit">
		</Pagination>

		<slot name="footer"></slot>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HeaderColumn from './HeaderColumn.vue';
import RowColumn from "./RowColumn.vue";
import Pagination from "./Pagination.vue";
import useApiRequest from '@/composables/request';
import Signal from '@/composables/signal';
import loader from '@/components/elements/Loader.vue';
import SkeletonLoader from '../common/SkeletonLoader.vue';

const count = ref(0)

let open_search = ref(false);

const props = defineProps({
    title: {
        type: String
    },
	tmpl: {
		type: String,
		default() { return 'table' }
    },
    headers: {
      type: Array,
      default() { return [] }
    },
    items: {
      type: Array,
      default() { return [] }
    },
    dataUrl: {
        type: String,
        default() { return '' }
    },
    sortBy: {
        type: String,
        required: true
    },
    sortOrder: {
        type: String,
        default() { return 'desc' }
    },
    lazyLoad: {
        type: Boolean,
        default() { return false }
    },
    pageLimit: {
        type: Number,
        default() { return 20 }
    },
    pageOptions: {
		type: Array,
		default() { return [10, 20, 30, 50, 100] }
    },
    search: {
        type: Boolean,
        default() { return true }
    },
    searchLabel: {
    	type: String,
    },
    searchPlaceHolder: {
    	type: String,
    	default() { return 'Search..' }
    },
    filterToggle: {
        type: Boolean,
        default() { return true }
    },
})

let _loaderGif = ref(false);
let filter = ref({});
let rows = ref([]);
let activeSortBy = ref(props.sortBy);
let activeSortOrder= ref(props.sortOrder);

let pagination = ref({
    page: 1,
    total: 0,
    totalPages: 0,
    itemStart: 0,
    itemCount: 0,
    buttons: [],
    limit: props.pageLimit
})

onMounted(() => {
    loadItems();
});

filter.value.submit = function()
{
    goFirst();
}

function removeEmpty(obj) {
    let newObj = {};
    for (let i in obj) {
        const type = typeof obj[i];
        if (type == 'object' || type == 'array') {
            let tmp = removeEmpty(obj[i]);
            if (Object.keys(tmp).length > 0)
                newObj[i] = tmp;
            //console.log(newObj, newObj[i]);
        } else if (type == 'function' || obj[i] == null || obj[i] == '' || (type == 'string' && obj[i].trim() == ''))
            continue;
        else {
            //console.log(i, obj[i]);
            newObj[i] = obj[i];
        }
    }

    return newObj;
}

const request = useApiRequest();
async function loadItems() {
    if (props.dataUrl == null || props.dataUrl.trim() == '' || props.dataUrl.trim() == '/') {
        rows.value = props.items;
        return;
    }

    let params = {page:  pagination.value.page, limit: pagination.value.limit, sort_by: activeSortBy.value, sort_order: activeSortOrder.value };

    //console.log('filter', filter.value)
    let filters = removeEmpty(filter.value);
    if (Object.keys(filters).length > 0)
        params['filter'] = filters;

    //console.log('filter', params)
    // const response = await request.fetch(props.dataUrl, {params:pagination.value});
    _loaderGif.value = true;
    const response = await request.post(props.dataUrl, params);
    _loaderGif.value = false;
    if (response.error) {
        Signal.error(response.message);
        return;
    }

    rows.value  = response.data.items;
    setupPagination(response.data.items.length, response.data.total);

    //emit( 'parseItems', rows );
};

function sort(column) {
    if (column.sortField == null || column.sortField.trim() == '')
        return;

    if (activeSortBy.value == column.sortField && activeSortOrder.value == 'asc')
        activeSortOrder.value = 'desc'
    else
        activeSortOrder.value = 'asc'

    activeSortBy.value = column.sortField;

    goFirst();
}

function setupPagination(itemCount, itemTotal)
{
    pagination.value.total = itemTotal;
    pagination.value.totalPages = Math.ceil(pagination.value.total / pagination.value.limit);
    pagination.value.itemStart = (pagination.value.page - 1) * pagination.value.limit + 1;
    pagination.value.itemCount = (pagination.value.page - 1) * pagination.value.limit + itemCount;

    let displayedPages = 10;
    let buttonStart = 0;
    let buttonEnd = 0;

    buttonStart = pagination.value.page - (displayedPages / 2);
    if (buttonStart  < 1) {
        buttonStart = 1;
    }

    if ((buttonStart + displayedPages) > pagination.value.totalPages) {
        buttonEnd = pagination.value.totalPages;
        if (pagination.value.totalPages < displayedPages)
            buttonStart = 1;
        else
            buttonStart = pagination.value.totalPages - displayedPages + 1;
    } else {
        buttonEnd = buttonStart + displayedPages - 1;
    }

    pagination.value.buttons  = [];
    for (let i = buttonStart; i <= buttonEnd; i++)
        pagination.value.buttons.push(i);
}

function setPageLimit(n)
{
    pagination.value.limit = n;
    loadItems();
}

function setPage(n)
{
    pagination.value.page = n;
    loadItems();
    //Signal.success('Loaded page - ' + n);
}

function goTo(n) {
    setPage(n);
}

function goFirst() {
    setPage(1);
}

function goLast() {
    setPage(pagination.value.totalPages)
}

function goPrev() {
    if (pagination.value.page > 1)
        setPage(pagination.value.page - 1);
}

function goNext() {
    if (pagination.value.page < pagination.value.totalPages)
        setPage(pagination.value.page + 1);
}

defineExpose({
  goFirst
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
.icon_size{
    width: 20px;
}
</style>
