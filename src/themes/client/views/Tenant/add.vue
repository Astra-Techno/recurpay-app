<template>
  <div class="py-4">
    <!-- Desktop View -->
    <div v-if="!deviceStore.isMobile">
      <!-- Main Page Heading -->
      <div class="mb-6">
        <div class="flex items-center gap-2">
          <span class="inline-block bg-blue-100 text-blue-600 p-2 rounded-full">🏠</span>
          <h2 class="text-3xl font-black italic">Add Tenant</h2>
        </div>
        <p class="text-gray-500 text-sm mt-1">to {{ property.name || 'Property' }}</p>
      </div>

      <!-- Form Card -->
      <div class="bg-white p-6 rounded-2xl shadow-md space-y-6">
        <Stepper :steps="['Basic Details', 'Bank Details']" :currentStep="currentStep" />

        <div class="space-y-1">
          <h1 class="text-2xl font-black italic">Let’s Add a New Tenant</h1>
          <p class="text-gray-500 text-sm">Provide the basic details of the tenant to add.</p>
        </div>

        <FormKit v-if="!loading" type="form" @submit="submitForm" v-model="tenant" submit-label="Save and Continue"
          :actions="true" :config="{ classes: { form: 'space-y-4', submit: { input: 'btn btn-primary' } } }">
          <template v-if="currentStep === 0">
            <FormKit type="text" name="name" label="Name" help="Please enter full name" validation="required" />
            <FormKit type="mask" name="phone" mask="🇮🇳 +91 ##### #####" label="Phone"
              help="Please enter a phone number" validation="required" />
          </template>

          <template v-else-if="currentStep === 1">
            <FormKit type="text" name="bank_name" label="Bank Name" validation="required" />
            <FormKit type="text" name="account_number" label="Account Number" validation="required" />
          </template>
        </FormKit>
      </div>
    </div>

    <!-- Mobile View -->
    <div v-else class="px-4">


      <!-- Mobile Form -->
      <div class="bg-white p-4  space-y-2">
        <div class="sticky top-0 bg-white z-10  pb-2 shadow-sm border-b">
          <p class=" text-base font-black">Property : {{ property.name || 'Property' }}</p>
        </div>
        <FormKit v-if="!loading" type="form" @submit="submitForm" v-model="tenant" submit-label="Save" :actions="true"
          :config="{ classes: { form: 'space-y-4', submit: { input: 'w-full bg-blue-600 text-white font-semibold py-2 rounded-md' } } }">
          <!-- Step 1 only, or conditionally show more if needed -->
          <FormKit type="text" name="name" label="Tenant Name" validation="required" />
          <FormKit type="mask" name="phone" label="Mobile Number" mask="🇮🇳 +91 ##### #####" validation="required" />
        </FormKit>
      </div>
    </div>
  </div>
</template>




<script setup>
import { ref, onMounted, inject } from "vue";
import { useRouter } from "vue-router";
import { FormKit } from "@formkit/vue";
import useApiRequest from '@/composables/request'
import Stepper from '@/components/elements/Stepper.vue'
import Signal from '@/composables/signal'
import { useDeviceStore } from '../../stores/useDeviceStore'

const deviceStore = useDeviceStore()

import { useMeta } from '@/composables/use-meta';
import { getCurrentInstance } from 'vue'

const router = useRouter();
const property = ref({});
const tenant = ref({});
const loading = ref(true);
// Country codes for phone input
const countryCodes = ref([
  { label: '🇮🇳 +91', value: '+91' },
  { label: '🇺🇸 +1', value: '+1' },
  { label: '🇬🇧 +44', value: '+44' },
  // Add more country codes as needed
]);

const currentStep = ref(0);


const request = useApiRequest();

//const QueryParams = inject('QueryParams'); // Inject global params
const PropertyId = router.currentRoute.value.params.property_id || 0; // Get property ID from route params or global params

onMounted(async () => {
  const proxy = getCurrentInstance().proxy;
  loading.value = false;
  if (PropertyId == 0)
    return;

  const response = await request.post('entity/Property/' + PropertyId)
  if (response.error) {
    Signal.error(response.message)
    return;
  }

  property.value = response.data;
  tenant.value.property_id = PropertyId;

  proxy.$setHeader('Add Tenant', 'to ' + property.value.name, true, 'IconHome')
});


const submitForm = async () => {
  const response = await request.post('task/Tenant/save', tenant.value);
  if (response.error) {
    Signal.error(response.message);
    return;
  }

  // Save returned ID once on first save
  if (!tenant.value.id) tenant.value.id = response.data.id;

  Signal.success("Tenant added successfully!");
  router.go(-1); // Go back to the previous page
};
</script>