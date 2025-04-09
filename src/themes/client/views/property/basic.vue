<template>
  <div class="py-4">
    <!-- Main Page Heading -->
    <div class="mb-6 ">
      <div class="flex items-center  gap-2">

        <span class="inline-block bg-blue-100 text-blue-600 p-2 rounded-full">
          🏠
        </span>
        <h2 class="text-3xl font-black italic">Add Property</h2>
      </div>
      <p class="text-gray-500 text-sm mt-1">You're about to add a new property to your portfolio.</p>
    </div>


    <!-- Step Indicator -->
    <StepProgress :currentStep="1" :steps="[
      { number: 1, label: 'Basic Details' },
      { number: 2, label: 'Additional  Details' },
      { number: 3, label: 'Location Details' }
    ]" />


    <!-- Form Card -->
    <div class="bg-white p-6 rounded-2xl shadow-md space-y-6">
      <!-- Section Title -->
      <div class="space-y-1 ">
        <h1 class="text-2xl font-black italic ">Let’s Add a New Property </h1>
        <p class="text-gray-500 text-sm">Provide the basic details to list this property under your landlord profile.
        </p>
      </div>

      <!-- Form -->
      <FormKit v-if="!loading" type="form" @submit="submitForm" v-model="property" submit-label="Save and Continue" submit-class="btn-primary"
        :actions="true" :config="{ classes: { form: 'space-y-4',submit:{input:'btn btn-primary'} } }">
        <FormKit type="text" name="address1" label="Address Line 1" placeholder="Enter street address"
          validation="required" />
        <FormKit type="text" name="address2" label="Address Line 2" placeholder="Apartment, suite, etc. (optional)" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormKit type="text" name="city" label="City" validation="required" />
          <FormKit type="text" name="state" label="State" validation="required" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormKit type="text" name="postal_code" label="Postal Code" validation="required" />
          <FormKit type="select" name="country" label="Country"
            :options="[{ value: 1, label: 'India' }, { value: 2, label: 'USA' }]" validation="required" />
        </div>
      </FormKit>
    </div>
  </div>
</template>



<script setup>
import { ref, onMounted, inject } from "vue";
import { useRouter } from "vue-router";
import { FormKit } from "@formkit/vue";
import useApiRequest from '@/composables/request'
import Signal from '@/composables/signal'
import StepProgress from './StepProgress.vue';

import { useMeta } from '@/composables/use-meta';
useMeta({ title: 'Add Property' })

const router = useRouter();
const property = ref(null);
const loading = ref(true);

const request = useApiRequest();

const QueryParams = inject('QueryParams'); // Inject global params
const PropertyId = QueryParams.value[0] ?? 0;

onMounted(async () => {
  loading.value = false;
  if (PropertyId == 0)
    return;

  const response = await request.post('entity/Property/' + PropertyId)
  if (response.error) {
    Signal.error(response.message)
    return;
  }

  property.value = response.data;
});

const submitForm = async () => {
  const response = await request.post('task/Property/save', property.value)
  if (response.error) {
    Signal.error(response.message);
    return;
  }

  Signal.success('Property basic details saved!');
  router.push("/property/additional/" + response.data.id);
};
</script>