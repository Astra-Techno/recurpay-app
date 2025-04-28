<template>
    <div class="flex flex-col bg-gray-50">
      <!-- Main Content -->
      <div class="flex-1 p-4">
  
        <!-- Bank Details Card -->
        <div class="bg-white rounded-lg shadow p-6 mb-6 space-y-4" v-if="paymentMethod?.type == 'bank'">
          <div class="flex justify-between items-center border-b pb-3">
            <span class="text-gray-600">Account Holder</span>
            <span class="font-medium">{{ paymentMethod?.account_holder_name || '' }}</span>
          </div>
          <div class="flex justify-between items-center border-b pb-3">
            <span class="text-gray-600">Account Number</span>
            <span class="font-mono font-medium">{{ paymentMethod?.account_number || '' }}</span>
          </div>
          <div class="flex justify-between items-center border-b pb-3">
            <span class="text-gray-600">IFSC Code</span>
            <span class="font-mono font-medium">{{ paymentMethod?.ifsc_code || '' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Amount</span>
            <span class="text-lg font-bold text-green-600">{{ currency(payment?.PaymentDue?.total_due || 0, 'INR') }}</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 mb-6 space-y-4" v-if="paymentMethod?.type == 'upi'">
          <div class="flex justify-between items-center border-b pb-3">
            <span class="text-gray-600">Name</span>
            <span class="font-medium">{{ paymentMethod?.account_holder_name || '' }}</span>
          </div>
          <div class="flex justify-between items-center border-b pb-3">
            <span class="text-gray-600">UPI ID</span>
            <span class="font-mono font-medium">{{ paymentMethod?.upi_id || '' }}</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 mb-6 space-y-4" v-if="paymentMethod?.type == 'cash'">
          <div class="text-center">
            <p class="text-gray-600">Give cash <span class="font-bold text-green-600">{{ currency(payment?.PaymentDue?.total_due || 0, 'INR') }}</span> to landlord</p>
            <p> and Tap <span class="font-bold">'Mark as Paid'</span></p>
          </div>
        </div>
  
        <!-- Reference ID Input -->
        <div class="mb-6" v-if="paymentMethod?.type != 'cash'">
          <label class="block text-gray-700 text-sm font-medium mb-2">Reference ID (optional)</label>
          <input 
            type="text" 
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter transaction reference"
            v-model="paidInfo.referenceId"
          >
        </div>

        <div class="mb-6" v-if="paymentMethod?.type == 'cash'">
          <label class="block text-gray-700 text-sm font-medium mb-2">Paid Amount {{currency('', 'INR')}}</label>
          <input 
            type="text" 
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter paid amount"
            v-model="paidInfo.paidAmount"
          >
        </div>
  
        <!-- Upload Section -->
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-medium mb-2">Upload Payment Proof (optional)</label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <div class="flex flex-col items-center justify-center py-4">
              <svg class="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p class="text-sm text-gray-500">Click to upload or drag and drop</p>
              <p class="text-xs text-gray-400">PNG, JPG, PDF (max. 5MB)</p>
            </div>
            <input 
              type="file" 
              class="hidden" 
              @change="handleFileUpload" 
              accept="image/*,.pdf"
            >
          </div>
          <!--<div v-if="previewUrl" class="mt-2">
            <img :src="previewUrl" alt="Payment proof" class="h-20 object-contain rounded">
          </div>-->
        </div>
      </div>
  
      <!-- Fixed Bottom Button -->
      <div class="p-4 bg-white border-t shadow-lg">
        <button
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-lg"
          @click="markAsPaid"
        >
          Mark as Paid
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, inject, onMounted, getCurrentInstance } from 'vue';
  import { useRouter } from 'vue-router';
  import useApiRequest from '@/composables/request'
  import { currency } from '@/composables/helper';
  import Signal from '@/composables/signal'

  const QueryParams = inject('QueryParams'); // Inject global params
  const PaymentId = QueryParams.value[0] ?? 0;
  const PaymentMethodId = QueryParams.value[1] ?? 0;
  const payment = ref({});

  const router = useRouter();
  const request = useApiRequest()
  const selectedId = ref(null);

  async function markAsPaid() {
    const response = await request.post('task/Payment/paid', paidInfo.value);
    if (response.error) {
      Signal.error(response.message);
      return;
    }

    Signal.success('Payment completed! The owner has been notified.');
    
    console.log('PaidInfo:', paidInfo)
    router.push("/dashboard");
  }

  const title = ref('💵 Cash Payment');

  const paidInfo = ref({});

  const instance = getCurrentInstance();
  //getCurrentInstance().proxy.$setHeader(title.value, '', true, '')

  const paymentMethod = ref({});
  onMounted(async () => {
    if (PaymentId == 0 || PaymentMethodId == 0)
        router.push('/dashboard');

    const response = await request.post('entity/Payment/' + PaymentId + '?group=PayNow&payment_method_id='+ PaymentMethodId)
    if (response.error) {
      Signal.error(response.message)
      return;
    }
  
    payment.value = response.data;
    paymentMethod.value = response.data.PaymentOptions?.[0];

    paidInfo.value.paymentId = payment.value.id;
    paidInfo.value.paymentMethodId = paymentMethod.value.id;
    paidInfo.value.paidAmount = payment.value.PaymentDue?.total_due;

    if (paymentMethod.value.type == 'bank')
        title.value = '🏦 Bank Transfer';
    else if (paymentMethod.value.type == 'upi')
        title.value = '🔗 UPI Payment';

    instance.proxy.$setHeader(title.value, '', true, '');
  });
  </script>