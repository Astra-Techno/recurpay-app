<template>
  <div class="py-4">
    <!-- Main Page Heading -->
    <div class="mb-6">
      <div class="flex items-center gap-2">
        <h2 class="text-3xl font-black italic">Add Property</h2>
      </div>
      <p class="text-gray-500 text-sm mt-1">You're about to add a new property to your portfolio.</p>
    </div>

    <!-- Step Indicator -->
    <StepProgress :currentStep="2" :steps="[
      { number: 1, label: 'Basic Info' },
      { number: 2, label: 'Additional  Details' },
      { number: 3, label: 'Location Details' }
    ]" />

    <!-- Form Card -->
    <div class="bg-white p-6 rounded-2xl shadow-md space-y-6">
      <!-- Section Title -->
      <div class="space-y-1">
        <h1 class="text-2xl font-black italic">Select Property Location 📍</h1>
        <p class="text-gray-500 text-sm">Use the map below to pinpoint the exact location of this property.</p>
      </div>

      <!-- Form -->
      <FormKit
        v-if="!loading"
        type="form"
        @submit="submitForm"
        v-model="property"
        submit-label="Finish"
        submit-class="btn-primary"
        :actions="true"
        :config="{ classes: { form: 'space-y-4', submit: { input: 'btn btn-primary' } } }"
      >
        <MapLocationPicker name="location" />
      </FormKit>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { useRouter } from "vue-router";
import { FormKit } from "@formkit/vue";
import MapLocationPicker from '@/components/elements/MapLocationPicker.vue'
import useApiRequest from '@/composables/request'
import Signal from '@/composables/signal'
import StepProgress from './StepProgress.vue';

import { useMeta } from '@/composables/use-meta';
useMeta({ title: 'Property Location' })

const router = useRouter();
const property = ref(null);
const loading = ref(true);

const request = useApiRequest();

const QueryParams = inject('QueryParams');
const PropertyId = QueryParams.value[0] ?? 0;

onMounted(async () => {
  loading.value = false;
  if (PropertyId == 0) return;

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

  Signal.success('Property location updated!');
  router.push('/properties');
};
</script>