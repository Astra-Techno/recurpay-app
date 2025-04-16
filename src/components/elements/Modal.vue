<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="noop" static>
      <div class="fixed inset-0 bg-black bg-opacity-25" />

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild enter="ease-out duration-300" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95" as="template">
            <DialogPanel
              class="w-full h-full md:h-auto md:max-w-md md:rounded-2xl md:p-6 p-4 rounded-none bg-white text-left align-middle shadow-xl transition-all overflow-y-auto">

              <div class="flex justify-between items-center mb-4">
                <DialogTitle class="text-lg font-medium text-gray-900">
                  {{ title }}
                </DialogTitle>
                <button @click="closeModal" class="text-gray-400 hover:text-gray-600 hidden md:block">
                  x
                </button>
              </div>

              <div class="mt-2">
                <slot />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'


const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: 'Modal Title',
  },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(props.modelValue)

watch(() => props.modelValue, val => {
  isOpen.value = val
})

function closeModal() {
  emit('update:modelValue', false)
}
function noop() {
  // Intentionally empty to block outside click from closing
}
</script>