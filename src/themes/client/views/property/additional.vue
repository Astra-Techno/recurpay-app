<template>
  <div class="py-4">
    <!-- Main Page Heading -->
    <div class="mb-6">
      <div class="flex items-center gap-2">
        <span class="inline-block bg-blue-100 text-blue-600 p-2 rounded-full">
          🏠
        </span>
        <h2 class="text-3xl font-black italic">Add Property</h2>
      </div>
      <p class="text-gray-500 text-sm mt-1">You're adding a new property to your portfolio.</p>
    </div>

    <!-- Step Indicator -->
    <StepProgress :currentStep="2" :steps="[
      { number: 1, label: 'Basic Info' },
      { number: 2, label: 'Additional  Details' },
      { number: 3, label: 'Location Details' }
    ]" />


    <!-- Form Card -->
    <div class="p-6 bg-white rounded-2xl shadow-md space-y-6">
      <!-- Section Title -->
      <div class="space-y-1 ">
        <h1 class="text-2xl font-black italic ">Provide Additional Details</h1>
        <p class="text-gray-500 text-sm">Help tenants get a better understanding of this property by filling out more
          details.</p>
      </div>

      <!-- Form -->
      <FormKit v-if="!loading" type="form" @submit="submitForm" v-model="property" submit-label="Save and Continue"
        submit-class="btn-primary" :actions="true"
        :config="{ classes: { form: 'space-y-4', submit: { input: 'btn btn-primary' } } }">
        <FormKit type="text" name="name" label="Property Name" validation="required" />

        <FormKit type="select" name="property_type" label="Property Type"
          :options="['apartment', 'house', 'condo', 'townhouse', 'commercial']" validation="required" />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormKit type="number" name="bedrooms" label="Bedrooms" />
          <FormKit type="number" name="bathrooms" label="Bathrooms" />
        </div>

        <FormKit type="number" name="square_footage" label="Square Footage" />

        <FormKit type="textarea" name="description" label="Description" />
      </FormKit>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { useRouter } from "vue-router";
import { FormKit } from "@formkit/vue";
import useApiRequest from '@/composables/request';
import Signal from '@/composables/signal';
import StepProgress from './StepProgress.vue'; // Import the StepProgress component

import { useMeta } from '@/composables/use-meta';
useMeta({ title: 'Additional Information' });

const router = useRouter();
const property = ref(null);
const loading = ref(true);

const request = useApiRequest();

const QueryParams = inject('QueryParams'); // Inject global params
const PropertyId = QueryParams.value[0] ?? 0;

onMounted(async () => {
  loading.value = false;
  if (PropertyId === 0) return;

  const response = await request.post('entity/Property/' + PropertyId);
  if (response.error) {
    Signal.error(response.message);
    return;
  }

  property.value = response.data;
});

const submitForm = async () => {
  const response = await request.post('task/Property/save', property.value);
  if (response.error) {
    Signal.error(response.message);
    return;
  }

  Signal.success('Property additional details saved!');
  router.push("/property/location/" + response.data.id);
};
</script>
