<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50">
      <!-- Modal Container (for Mobile and Desktop) -->
      <div class="fixed inset-0 flex items-center justify-center sm:bg-black/50 sm:backdrop-blur-sm">
        <div class="w-full h-full sm:w-[80%] sm:max-w-lg bg-white rounded-lg sm:rounded-xl overflow-y-auto sm:h-auto">
          <!-- Modal Content -->
          <TransitionChild enter="transform transition ease-in-out duration-300" enter-from="translate-y-full"
            enter-to="translate-y-0" leave="transform transition ease-in-out duration-200" leave-from="translate-y-0"
            leave-to="translate-y-full">
            <DialogPanel class="w-full h-full p-4 sm:p-6 overflow-y-auto">
              <!-- Header -->
              <div class="flex justify-between items-center border-b pb-4">
                <DialogTitle class="text-xl font-bold text-gray-900">Edit Property</DialogTitle>
                <button @click="close" class="bg-transparent border-none text-gray-600 hover:text-black transition-all">
                  <X class="w-6 h-6" />
                </button>
              </div>

              <!-- Content (Form Fields) -->
              <div class="space-y-4 py-4 overflow-y-auto">
                <FormKit type="text" name="address1" v-model="property.address1" label="Address Line 1"
                  placeholder="Enter street address" validation="required" />
                <FormKit type="text" name="address2" v-model="property.address2" label="Address Line 2"
                  placeholder="Apartment, suite, etc. (optional)" />
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit type="text" name="city" v-model="property.city" label="City" validation="required" />
                  <FormKit type="text" name="state" v-model="property.state" label="State" validation="required" />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit type="text" name="postal_code" v-model="property.postal_code" label="Postal Code"
                    validation="required" />
                  <FormKit type="select" name="country" label="Country" v-model="property.country"
                    :options="[{ value: 1, label: 'India' }, { value: 2, label: 'USA' }]" validation="required" />
                </div>
                <!-- Add more fields as needed -->
              </div>

              <!-- Footer -->
              <div class="py-4 border-t flex gap-4 justify-between ">
                <button @click="close" class="sm:w-auto secondary p-2 min-w-[100px]">
                  Cancel
                </button>
                <button @click="submit" class="sm:w-auto primary p-2 min-w-[100px] ">
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
