<template>
	<div v-if="visible" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
		<div class="bg-white p-10 w-96">
			<div class="font-semibold text-center">{{ title }}</div>
			<div class="text-sm mt-4">
				{{ message }}
			</div>
			<div class="flex gap-2 items-center mt-8">
				<button @click="cancel" class="text-primary px-4 py-2 w-40">Cancel</button>
				<button @click="confirm" class="bg-primary font-bold text-white px-4 py-2 rounded w-40"
					:class="confirmButtonClass">{{ confirmButtonText }}</button>
			</div>
		</div>
	</div>
</template>
<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

// Define props
const props = defineProps({
	title: {
		type: String,
		default: 'Confirm',
	},
	message: {
		type: String,
		default: 'Are you sure you want to proceed?',
	},
	show: {
		type: Boolean,
		default: false,
	},
	confirmButtonClass: {
		type: String,
		default: 'bg-blue-500 text-white',
	},
	confirmButtonText: {
		type: String,
		default: 'Proceed',
	}
});

// Define emit events
const emit = defineEmits(['confirmed', 'cancelled']);

// Reactive state for visibility
const visible = ref(props.show);

// Watch for changes in the `show` prop to update `visible`
watch(() => props.show, (newValue) => {
	visible.value = newValue;
});

// Methods to handle confirmation and cancellation
const confirm = () => {
	emit('confirmed');
	visible.value = false;
};

const cancel = () => {
	emit('cancelled');
	visible.value = false;
};
</script>
