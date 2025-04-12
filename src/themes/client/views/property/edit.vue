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
              <div class="flex justify-between items-center border-b pb-4 hidden  md:block">
                <DialogTitle class="text-xl font-bold text-gray-900">Edit Property</DialogTitle>

              </div>

              <!-- Tab Navigation -->
              <div class="flex space-x-4 py-2 cursor-pointer font-black">
                <span
                  :class="{ 'text-blue-600 border-b-2 border-blue-600': activeTab === 1, 'text-gray-600': activeTab !== 1 }"
                  @click="activeTab = 1" class="py-2 px-4 focus:outline-none">
                  Basic
                </span>
                <span
                  :class="{ 'text-blue-600 border-b-2 border-blue-600': activeTab === 2, 'text-gray-600': activeTab !== 2 }"
                  @click="activeTab = 2" class="py-2 px-4 focus:outline-none">
                  Additional
                </span>
                <span
                  :class="{ 'text-blue-600 border-b-2 border-blue-600': activeTab === 3, 'text-gray-600': activeTab !== 3 }"
                  @click="activeTab = 3" class="py-2 px-4 focus:outline-none">
                  Location
                </span>
              </div>

              <!-- Content (Form Fields) based on Active Tab -->
              <div class="py-4">
                <!-- Basic Tab Content -->
                <div v-show="activeTab === 1">
                  <FormKit type="text" name="name" v-model="property.name" label="Property Name"
                    validation="required" />
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
                </div>

                <!-- Additional Tab Content -->
                <div v-show="activeTab === 2">


                  <FormKit type="select" name="property_type" v-model="property.property_type" label="Property Type"
                    :options="['apartment', 'house', 'condo', 'townhouse', 'commercial']" validation="required" />

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormKit type="number" name="bedrooms" v-model="property.bedrooms" label="Bedrooms" />
                    <FormKit type="number" name="bathrooms" v-model="property.bathrooms" label="Bathrooms" />
                  </div>

                  <FormKit type="number" name="square_footage" v-model="property.square_footage"
                    label="Square Footage" />

                  <FormKit type="textarea" name="description" v-model="property.description" label="Description" />
                </div>

                <!-- Location Tab Content -->
                <div v-show="activeTab === 3">
                  <MapLocationPicker name="location" />
                </div>
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
import MapLocationPicker from '@/components/elements/MapLocationPicker.vue'

import useApiRequest from '@/composables/request'
import Signal from '@/composables/signal'

const emit = defineEmits(['close', 'updated'])
const isOpen = ref(false)
const property = ref({})
const activeTab = ref(1) // The default active tab is 1 (Basic)
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
