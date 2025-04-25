<template>
    <div class="bg-white py-4 text-gray-800">
      <!-- Header -->

      <div v-if="loading" class="p-6 space-y-4 animate-pulse">
        <div class="h-6 bg-gray-300 rounded w-2/3 mx-auto"></div>
        <div class="h-12 bg-gray-200 rounded"></div>
        <div class="h-12 bg-gray-200 rounded"></div>
      </div>
  
      <div v-else class="p-6 rounded-2xl shadow-md space-y-6">
        <FormKit
          type="form"
          @submit="submitForm"
          v-model="upiForm"
          :submit-label="PaymentMethodId > 0 ? 'Update' : 'Create'"
          :actions="true"
          :config="{
            classes: {
              form: 'space-y-4',
              submit: {
                input:
                  'w-full bg-blue-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-blue-700 transition duration-300 animate-pulse'
              }
            }
          }"
        >
          <FormKit
            type="text"
            name="upi_id"
            label="UPI ID"
            placeholder="example@upi"
            validation="required|matches:/^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+$/"
          />
          <FormKit type="hidden" name="type" value="upi" />
        </FormKit>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, inject, getCurrentInstance } from 'vue';
  import { useRouter } from 'vue-router';
  import useApiRequest from '@/composables/request';
  import Signal from '@/composables/signal';
  import { useMeta } from '@/composables/use-meta';
  
  useMeta({ title: 'Add UPI ID' });
  
  const router = useRouter();
  const upiForm = ref(null);
  const loading = ref(true);
  
  const request = useApiRequest();
  const QueryParams = inject('QueryParams');
  const PaymentMethodId = QueryParams.value[0] ?? 0;

  const title = PaymentMethodId == 0 ? '🏷️ Add UPI' : '🏷️ Edit UPI';
  getCurrentInstance().proxy.$setHeader(title, '', true, '')
  
  onMounted(async () => {
    loading.value = true;
    if (PaymentMethodId === 0) {
      loading.value = false;
      return;
    }
  
    const response = await request.post('entity/PaymentMethod/' + PaymentMethodId);
    if (response.error) {
      Signal.error(response.message);
      return;
    }
  
    upiForm.value = response.data;
    upiForm.value.type = 'upi';
    loading.value = false;
  });
  
  const submitForm = async () => {
    const response = await request.post('task/PaymentMethod/save', upiForm.value);
    if (response.error) {
      Signal.error(response.message);
      return;
    }
  
    if (PaymentMethodId == 0)
      Signal.success('UPI ID added!');
    else
      Signal.success('UPI ID updated!');
  
    router.push('/payment-methods/list');
  };
  </script>
  
  <style scoped>
  </style>
  