<template>
	<FormKit v-model="selectedOption" type="dropdown" v-bind="attrs.all" popover selection-appearance="tags">
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

const props = defineProps({
	dataUrl: {
		type: String,
		default: ''
	},
	modelValue: {
		type: [Object, String, Number],
		default: null
	},
	returnObject: {
		type: Boolean,
		default: false // Controls whether to return full object or just value
	},
	defaultOption: {
		type: Object,
		default: () => ({ label: '', value: '' })
	}
});

const emit = defineEmits(['update:modelValue', 'change'])

let isFirst = ref(true);
const selectedOption = ref(props.modelValue);


const options = ref([]);

const rawAttrs = useAttrs();
let attrs = computed(() => {

	let { ...all } = rawAttrs;

	if (all['options'] == null && all['dataUrl'] != '') {
		all['options'] = loadOptions;
	}

	return { all };
})

const findOption = (value) => {
	let obj = options.value.find(obj => obj.__original === value);
	if (obj == null)
		return {};

	obj.value = obj.__original;

	return obj;
};

watch(() => props.dataUrl, (newVal) => {
	if (!isFirst.value) {
		attrs.value['all']['options'] = [];
		selectedOption.value = '';
	}

	isFirst.value = false;
}, { immediate: true })

// Watch for changes in selectedOption to emit either full object or single value
watch(selectedOption, (newVal, oldVal) => {

	if (newVal == null) {
		selectedOption.value = oldVal
		return;
	}

	if (props.returnObject) {
		emit('update:modelValue', findOption(newVal)); // Emit full object
		emit('change', findOption(newVal));
	} else {
		emit('update:modelValue', newVal); // Emit only the value (id)
		emit('change', newVal);
	}
});

const request = useApiRequest();
async function loadOptions() {
	const res = await request.fetch(props.dataUrl);
	//if (res.data.length > 0)
	//	selectedValue = res.data[0].value;
	options.value = res.data;
	if (props.defaultOption.label != '') {
		options.value = [props.defaultOption, ...res.data]
	}

	return options.value;
}
</script>
<style>
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
