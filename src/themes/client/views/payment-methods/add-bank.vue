<template>
    <div class="bg-white py-4 text-gray-800">

        <div class="p-6 rounded-2xl shadow-md space-y-6">
            <FormKit v-if="!loading" type="form" @submit="submitForm" v-model="bankForm" :submit-label="PaymentMethodId > 0 ? 'Update' : 'Create'"
                submit-class="btn-primary" :actions="true"
                :config="{ classes: { form: 'space-y-4', submit: { input: 'btn btn-primary' } } }">

                <FormKit type="text" name="account_holder_name" label="Account Holder Name" placeholder="John Doe" validation="required" />
                <FormKit type="text" name="bank_name" label="Bank Name" placeholder="HDFC Bank" validation="required" />
                <FormKit type="text" name="account_number" label="Account Number" placeholder="1234567890" validation="required" />
                <FormKit type="hidden" name="type" value="bank" />
                <FormKit type="text" name="ifsc_code" label="IFSC Code" placeholder="HDFC0001234" validation="required" />

            </FormKit>
        </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, inject, getCurrentInstance } from "vue";
  import { useRouter } from "vue-router";
  import { FormKit } from "@formkit/vue";
  import useApiRequest from '@/composables/request';
  import Signal from '@/composables/signal';
  
  import { useMeta } from '@/composables/use-meta';
  useMeta({ title: 'Add Bank Account' });
  
  const router = useRouter();
  const bankForm = ref(null);
  const loading = ref(true);
  
  const request = useApiRequest();
  
  const QueryParams = inject('QueryParams'); // Inject global params
  const PaymentMethodId = QueryParams.value[0] ?? 0;

  const title = PaymentMethodId == 0 ? '🏦 Add Bank Account' : '🏦 Edit Bank Account';
  getCurrentInstance().proxy.$setHeader(title, '', true, '')
  
  onMounted(async () => {
    loading.value = false;
    if (PaymentMethodId === 0) return;
  
    const response = await request.post('entity/PaymentMethod/' + PaymentMethodId);
    if (response.error) {
      Signal.error(response.message);
      return;
    }
  
    bankForm.value = response.data;
    bankForm.value.type = 'bank';
  });
  
  const submitForm = async () => {
    const response = await request.post('task/PaymentMethod/save', bankForm.value);
    if (response.error) {
      Signal.error(response.message);
      return;
    }
  
    if (PaymentMethodId == 0)
        Signal.success('Bank account added!');
    else 
        Signal.success('Bank account updated!');
    router.push("/payment-methods/list");
  };
  </script>
  