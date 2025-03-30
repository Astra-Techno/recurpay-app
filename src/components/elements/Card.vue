<template>
<div class="rounded border md:shadow w-full min-w-32 overflow-hidden">
  <div>
    <a href="#">
      <img class="object-cover" src="https://raw.githubusercontent.com/vuetailwind/storage/master/cards/card-1.jpg" alt="card 1" />
    </a>
  </div>

  <div class="px-4 py-4">
    <h3 class="font-semibold text-gray-900 mb-2 truncate">
      Neque porro quisquam est qui dolorem
    </h3>

    <div class="text-sm text-gray-800">
      Lorem ipsum dolor sit amet, conse ctetur adipiscing elit. In dignissim mi vehicula magna vulputate, sed placerat ex. Sit amet mattis odio.
    </div>

    <div class="text-right mt-2">
      <a href="#" class="py-2 text-indigo-600 text-xs uppercase hover:underline">Read More <span>&rarr;</span></a>
    </div>
  </div>
</div>
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
