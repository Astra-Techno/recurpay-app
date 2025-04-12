<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50">
      <!-- Modal Container (for Mobile and Desktop) -->
      <div class="fixed inset-0 flex items-center justify-center sm:bg-black/50 sm:backdrop-blur-sm">
        <div class="w-full h-full sm:w-[80%] sm:max-w-lg bg-white rounded-lg sm:rounded-xl overflow-y-auto sm:h-auto">
          <!-- Modal Content -->
          <TransitionChild
            enter="transform transition ease-in-out duration-300"
            enter-from="translate-y-full"
            enter-to="translate-y-0"
            leave="transform transition ease-in-out duration-200"
            leave-from="translate-y-0"
            leave-to="translate-y-full"
          >
            <DialogPanel class="w-full h-full p-4 sm:p-6 overflow-y-auto">
              <!-- Header -->
              <div class="flex justify-between items-center border-b pb-4">
                <DialogTitle class="text-xl font-bold text-gray-900">Edit Property</DialogTitle>
                <button @click="close" class="text-gray-600 hover:text-black transition-all">
                  <X class="w-6 h-6" />
                </button>
              </div>

              <!-- Content (Form Fields) -->
              <div class="space-y-4 py-4 overflow-y-auto">
                <FormKit type="text" v-model="property.name" label="Property Name" />
                <FormKit type="text" v-model="property.address1" label="Address Line 1" />
                <FormKit type="text" v-model="property.address2" label="Address Line 2" />
                <FormKit type="number" v-model="property.price" label="Price" />
                <!-- Add more fields as needed -->
              </div>

              <!-- Footer -->
              <div class="py-4 border-t flex gap-4 justify-between">
                <button @click="close" class="w-full sm:w-auto bg-gray-300 text-gray-700 p-3 rounded-md text-center">
                  Cancel
                </button>
                <button @click="submit" class="w-full sm:w-auto bg-blue-600 text-white p-3 rounded-md text-center">
                  Save
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { X } from 'lucide-vue-next'
import { FormKit } from '@formkit/vue'
import useApiRequest from '@/composables/request'
import Signal from '@/composables/signal'

const emit = defineEmits(['close', 'updated'])
const isOpen = ref(false)
const property = ref({})
const request = useApiRequest()

const open = async (id) => {
  const res = await request.fetch(`/entity/Property/${id}`)
  if (res.error) return Signal.error(res.message)
  property.value = res.data
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
  emit('close')
}

const submit = async () => {
  const res = await request.post('/task/Property/save', property.value)
  if (res.error) return Signal.error(res.message)
  Signal.success('Property updated')
  emit('updated')
  close()
}

defineExpose({ open, close })
</script>
