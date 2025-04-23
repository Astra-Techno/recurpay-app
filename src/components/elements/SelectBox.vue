<template>
	<FormKit v-model="selectedOption" type="dropdown" v-bind="attrs.all" popover>
		<template #option="{ option }">
			<div class="ml-[1.5em] formkit-option">
				<span :class="`indent-${option.level}`">
					{{ option.label }}
				</span>
			</div>
		</template>
	</FormKit>
</template>

<script setup>
import { useAttrs, computed, watch, ref } from 'vue';
import useApiRequest from '@/composables/request';
const request = useApiRequest();

const props = defineProps({
	dataUrl: { type: String, default: '' },
	modelValue: { type: [Object, String, Number], default: null },
	returnObject: { type: Boolean, default: false },
	defaultOption: { type: Object, default: () => ({ label: '', value: '' }) }
});

const emit = defineEmits(['update:modelValue', 'change', 'update:optionsLoaded']);

const selectedOption = ref(props.modelValue);
const options = ref([]);
const initialLoad = ref(true);

// Process options from API or strings
let currentUrl = '';
async function loadOptions() {
	// console.log('opp', rawAttrs.label, props.dataUrl);
	if (!props.dataUrl || props.dataUrl.includes('undefined'))
		return [];

	if (currentUrl != '' && props.dataUrl == currentUrl)
		return options.value;

	currentUrl = props.dataUrl;

	const res = await request.fetch(props.dataUrl);
	options.value = res.data.map(item => {
		if (typeof item === 'string' || typeof item === 'number') {
			return { label: String(item), value: item, __original: item };
		} else {
			return { label: item.label, value: item.value, __original: item.value };
		}
	});

	if (res.data.length > 0) {
		emit('update:optionsLoaded', res.data)
	}

	if (props.defaultOption.label) {
		options.value.unshift({ ...props.defaultOption, __original: props.defaultOption });
	}

	// Sync initial modelValue after options load
	if (initialLoad.value) {
		updateSelectedFromModelValue();
		initialLoad.value = false;
	}

	return options.value;
}

function findOption(val) {
	const isArray = Array.isArray(val);
	let values = [];

	if (typeof val == 'object' && val.__original != null)
		values.push(val.__original);
	else if (isArray)
		values = val;
	else if (val != null)
		values.push(val);

	if (values.length == 0)
		return false;

	let tmp = [];
	values.forEach(val => {
		const option = options.value.find(opt => {
			if (typeof opt != 'object')
				return String(opt) === String(val);
			return opt.__original ? String(opt.__original) === String(val) : String(opt.value) === String(val);
		});

		if (option != null)
			tmp.push(props.returnObject ? option : option.__original);
	});

	if (tmp.length == 0)
		return false;

	return isArray ? tmp : tmp[0];
}

// Update selectedOption when modelValue changes (external)
function updateSelectedFromModelValue() {
	//console.log('option', rawAttrs.label, props.modelValue, options.value);
	if (props.modelValue == undefined || props.modelValue == null || options.value.length == 0)
		return;

	const option = findOption(props.modelValue);
	// console.log('option', rawAttrs.label, props.modelValue, options.value, option);

	selectedOption.value = null;
	if (option) {
		if (!isEqual(option, props.modelValue)) {
			emit('update:modelValue', option);
			emit('change', option);
		}

		selectedOption.value = option;
	}
}

// Watchers
watch(() => props.modelValue, (newVal) => {
	if (!compareData(newVal, selectedOption)) {
		if (options.value.length == 0)
			attrs.value['all']['options'] = loadOptions();
		updateSelectedFromModelValue();
	}
}, { deep: true });

function compareData(data1, data2) {
	// Normalize first data
	const normalize = (item) =>
		item?.__original !== undefined ? item.__original : item;

	const tmp1 = Array.isArray(data1)
		? data1.map(normalize)
		: data1 !== null && data1 !== undefined
			? [normalize(data1)]
			: [];

	// Normalize second data (handle Vue refs)
	const rawValue = data2?._rawValue ?? data2?.value;
	const tmp2 = Array.isArray(rawValue)
		? rawValue
		: rawValue !== undefined
			? [rawValue]
			: [];

	//console.log('compare', tmp1, tmp2)
	// Deep comparison (assuming isEqual is from lodash or similar)
	return isEqual(tmp1, tmp2);
}

watch(selectedOption, (newVal) => {
	if (newVal == null)
		return;

	if (props.returnObject) {
		const option = findOption(newVal);
		if (option && !isEqual(option.__original, props.modelValue)) {
			emit('update:modelValue', option);
			emit('change', option);
		}
	} else if (newVal !== props.modelValue) {
		emit('update:modelValue', newVal);
		emit('change', newVal);
	}
});

// Deep comparison utility
function isEqual(a, b) {
	return JSON.stringify(a) === JSON.stringify(b);
}

// Handle dynamic dataUrl changes
watch(() => props.dataUrl, () => {
	initialLoad.value = true;
	//selectedOption.value = '';
	attrs.value['all']['options'] = loadOptions();
});

// Expose dropdown options to FormKit
const rawAttrs = useAttrs();
const attrs = computed(() => {
	let { ...all } = rawAttrs;
	//if (!all.options && props.dataUrl)
	all.options = loadOptions
	return { all };
});

// Initial load
if (rawAttrs.options && typeof rawAttrs.options === 'object' && !Array.isArray(rawAttrs.options))
	options.value = Object.entries(rawAttrs.options).map(([value, label]) => ({ label, value, __original: value }));

</script>

<style>
/* Existing styles */
.formkit-listitemGroup {
	white-space: preserve;
}

.indent-1 {
	@apply indent-[2rem];
}

.indent-2 {
	@apply indent-[4rem];
}

.indent-3 {
	@apply indent-[6rem];
}
</style>
