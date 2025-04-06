<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h1>Porperty Location</h1>
    <FormKit
      v-if="!loading"
      type="form"
      @submit="submitForm"
      v-model="property"
    >
      <MapLocationPicker name="location" />
      
    </FormKit>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { useRouter } from "vue-router";
import { FormKit } from "@formkit/vue";
import MapLocationPicker from '@/components/elements/MapLocationPicker.vue'
import useApiRequest from '@/composables/request'
import Signal from '@/composables/signal'

import { useMeta } from '@/composables/use-meta';
useMeta({ title: 'Porperty Location' })

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

  const response = await request.post('entity/Property/'+PropertyId)
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
    
    Signal.success('Property location updated!');
    router.push('/properties');
};
</script>