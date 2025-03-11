<template>
	<FormKit type="autocomplete" v-bind="attrs.all" popover @update:modelValue="$emit('change')"  >
		
	</FormKit>
</template>

<script setup>
import { useAttrs, computed, watch, ref} from 'vue';
import useApiRequest from '@/composables/request';

const props = defineProps({
    dataUrl: {
        type: String,
        default() { return '' }
    },
    limit: {
        type: String,
        default() { return '20' }
    },
    min: {
    	type: String,
        default() { return '0' }
    }
});

let isFirst = ref(true);
let options = ref([]);

const rawAttrs = useAttrs();
let attrs = computed(() => {
	let { ...all } = rawAttrs;

	if (all['options'] == null && all['dataUrl'] != '' ) {
		all['options'] = loadOptions;
				console.log('autocomplete', all);
	}

	return {  all };
})

watch(() => props.dataUrl, (newVal) => {
	console.log('newVal', newVal)
	if (!isFirst.value)
	  	attrs.value['all']['options'] = [];

	isFirst.value = false;
},{immediate:true})

const request = useApiRequest();
async function loadOptions({ search, page, hasNextPage }) {
	search = (search != null) ? search : '';

	if (search.trim().length >= props.min) {
		const params = '&page='+page+'&limit='+props.limit;
		const res = await request.post(props.dataUrl+search+params);
		
		if (res.data.total != null) {
			const total_pages = (parseInt(res.data.total) / props.limit);
			if (total_pages > page) hasNextPage()

			options.value = res.data.items;
		} else
			options.value = res.data;
	}

	return options.value;
}
</script>
<style>

</style>
