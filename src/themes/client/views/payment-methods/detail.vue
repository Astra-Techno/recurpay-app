<template>
    <div class="bg-white py-4 text-gray-800">
      <!-- Header -->
        <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
            <!-- Avatar + Name -->
            <div class="flex items-center gap-4 mb-6">
              <img
                  :src="`https://ui-avatars.com/api/?name=${account.type}`"
                  alt="Avatar"
                  class="w-12 h-12 rounded-full"
                />
                <div>
                  <div class="text-gray-500 text-xs">Account type</div>
                  <div class="text-lg font-semibold text-gray-800" v-if="account.type=='bank'">Bank</div>
                  <div class="text-lg font-semibold text-gray-800" v-if="account.type=='upi'">UPI</div>
                </div>
            </div>
    
            <!-- Detail Rows -->
            <div class="divide-y divide-gray-200 space-y-3 text-sm text-gray-700" v-if="account.type=='bank'">
                <div class="flex justify-between pt-3">
                  <span>Bank Name</span><span class="font-medium text-gray-900">{{ account.bank_name }}</span>
                </div>
                <div class="flex justify-between pt-3">
                  <span>Account Name</span><span class="font-medium text-gray-900">{{ account.account_holder_name }}</span>
                </div>
                <div class="flex justify-between pt-3">
                <span>Account Number</span><span class="font-medium text-gray-900">{{ account.account_number }}</span>
                </div>
                <div class="flex justify-between pt-3">
                <span>IFSC Code</span><span class="font-medium text-gray-900">{{ account.ifsc_code }}</span>
                </div>
            </div>

            <div class="divide-y divide-gray-200 space-y-3 text-sm text-gray-700" v-if="account.type=='upi'">
                <div class="flex justify-between pt-3">
                  <span>UPI id</span><span class="font-medium text-gray-900">{{ account.upi_id }}</span>
                </div>
            </div>
    
            <!-- Edit Button -->
            <div class="mt-6 text-center">
                <button
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
                @click="editAccount"
                >
                Edit Bank Details
                </button>
            </div>
        </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, inject, getCurrentInstance } from "vue";
  import { useRouter } from "vue-router";
  import useApiRequest from '@/composables/request';
  import Signal from '@/composables/signal';
  
  import { useMeta } from '@/composables/use-meta';
  useMeta({ title: 'Payment Method Details' });
  
  const router = useRouter();
  const account = ref({});
  const loading = ref(true);
  
  const request = useApiRequest();
  
  const QueryParams = inject('QueryParams'); // Inject global params
  const PaymentMethodId = QueryParams.value[0] ?? 0;

  getCurrentInstance().proxy.$setHeader('💳 Account Detail', '', true, '')
  
  onMounted(async () => {
    loading.value = false;
    if (PaymentMethodId === 0) return;
  
    const response = await request.post('entity/PaymentMethod/' + PaymentMethodId);
    if (response.error) {
      Signal.error(response.message);
      return;
    }
  
    account.value = response.data;
  });
  
  function editAccount() {
    if (account.value.type === 'bank') {
      router.push('/payment-methods/add-bank/'+account.value.id)
    } else if (account.value.type === 'upi') {
      router.push('/payment-methods/add-upi/'+account.value.id)
    }
  }
  </script>
  