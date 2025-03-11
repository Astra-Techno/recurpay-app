<template>
  <transition name="modal">   
    <!-- Main modal -->
	<div v-if="isOpen" id="default-modal" tabindex="-1" @click.self="event.stopPropagation()"
		class="overflow-y-auto overflow-x-hidden 
		fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 w-full md:inset-0 h-[calc(100%-1rem)] h-full pointer-events-auto">
		<div class="relative p-4 w-full max-w-2xl max-h-full">
		    <!-- Modal content -->
		    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
		        <!-- Modal header -->
		        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
		        	<slot name="head">
		            	<h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
		            </slot>
		            <button @click="$emit('close')" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
		                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
		                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
		                </svg>
		                <span class="sr-only">Close modal</span>
		            </button>
		        </div>
		        <!-- Modal body -->
		        <div class="p-4 md:p-5 space-y-4">
		            <slot></slot>
					<slot name="body" :data="popup"></slot>
		        </div>
		        <!-- Modal footer -->
		        <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
		        	<slot name="footer" :data="popup">
		        		<FormKit @click="$emit('close')" data-modal-hide="default-modal" type="button" label="Close"></FormKit>
				    </slot>
		        </div>
		    </div>
		</div>
	</div>
  </transition>
</template>

<script setup>
import { ref, watch} from 'vue'
import useApiRequest from '@/composables/request';
import Signal from '@/composables/signal';
import loader from '@/components/elements/Loader.vue';

const props = defineProps({
   isOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Modal Title'
    },
    dataUrl: {
        type: String,
        default() { return '' }
    },
});

defineEmits(['close']);
function isValidUrl()
{
	if (props.dataUrl == null || props.dataUrl.trim() == '' || props.dataUrl.trim() == '/')
        return false;
    return true;
}

let popup = ref([]);
let loading = ref(false);

const request = useApiRequest();
async function loadItems() {
    if (!isValidUrl())
        return;

	loading.value = true;
    const response = await request.post(props.dataUrl);
    if (response.error) {
        Signal.error(response.message);
        return;
    }

	loading.value = false;
	popup.value = response.data;
};

if (isValidUrl()) {
	watch(() => props.isOpen, (newVal) => {
		if (newVal)
			loadItems();
	});
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
