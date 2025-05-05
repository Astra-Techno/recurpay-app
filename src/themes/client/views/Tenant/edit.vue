<template>
    <div class="py-4">
      <!-- Main Page Heading -->
      <div class="mb-6 ">
        <div class="flex items-center  gap-2">
  
          <span class="inline-block bg-blue-100 text-blue-600 p-2 rounded-full">
            🏠
          </span>
          <h2 class="text-3xl font-black italic">edit Tenat</h2>
        </div>
        <p class="text-gray-500 text-sm mt-1">to {{ tenant.property || 'Property' }}</p>
      </div>
  
      <!-- Form Card -->
      <div class="bg-white p-6 rounded-2xl shadow-md space-y-6">
        <!-- Section Title -->
        <div class="space-y-1 ">
          <h1 class="text-2xl font-black italic ">Let’s Add a New Tenant </h1>
          <p class="text-gray-500 text-sm">Provide the basic details to list this property under your landlord profile.
          </p>
        </div>
  
        <!-- Form -->
        <FormKit v-if="!loading" type="form" @submit="submitForm" v-model="tenant" submit-label="Save and Continue" submit-class="btn-primary"
          :actions="true" :config="{ classes: { form: 'space-y-4',submit:{input:'btn btn-primary'} } }">
  
          <FormKit
            type="text"
            name="name"
            label="Name"
            help="Please enter full name"
            validation="required"
            />
  
          <FormKit
            type="mask"
            name="phone"
            mask="🇮🇳 +91 ##### #####"
            label="Phone"
            help="Please enter a phone number"
            validation="required"
            />
  
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
  
  import { useMeta } from '@/composables/use-meta';
  useMeta({ title: 'Add Tenant' })
  
  const router = useRouter();
  const property = ref({});
  const tenant = ref({});
  const loading = ref(true);
  
  const request = useApiRequest();
  
  const QueryParams = inject('QueryParams'); // Inject global params
  const TenantId = QueryParams.value[0] ?? 0;
  
  onMounted(async () => {
    loading.value = false;
    if (TenantId == 0)
      return;
  
    const response = await request.post('entity/Tenant/' + TenantId)
    if (response.error) {
      Signal.error(response.message)
      return;
    }
  
    tenant.value = response.data;
  });
  
  const submitForm = async () => {
    const response = await request.post('task/Tenant/save', tenant.value)
    if (response.error) {
      Signal.error(response.message);
      return;
    }
  
    Signal.success('Property basic details saved!');
    router.push("/property/additional/" + response.data.id);
  };
  </script>