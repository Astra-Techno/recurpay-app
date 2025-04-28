<template>
    <div class="min-h-screen bg-gray-50 p-4 text-gray-800">  
      <!-- Payment Info -->
      <div class="bg-white rounded-xl shadow p-4 mb-6 text-center">
        <div class="text-sm font-medium text-gray-800 mt-1"> {{ payment?.Property?.name }} </div>
        <div class="text-md font-medium text-gray-800 mt-1"> {{ payment?.Property?.address1 }} </div>
        <div class="text-2xl font-bold text-green-600">{{ currency(payment?.PaymentDue?.total_due, 'INR') }}</div>
        <div class="text-sm text-gray-600 font-bold">{{ ucfirst(payment?.type) }}<span class="font-normal"> due on </span> {{ formatDate(payment?.PaymentDue?.next_due_date, 'MMM DD') }}</div>
        
      </div>
  
      <!-- Payment Methods -->
      <div class="space-y-4">
        <div
          v-for="method in payment?.PaymentOptions"
          :key="method.id"
          class="flex items-center justify-between p-4 border rounded-xl bg-white shadow cursor-pointer hover:shadow-md"
          :class="{ 'ring-2 ring-blue-500': selectedId === method.id }"
          @click="selectedId = method.id"
        >
          <div class="flex items-center gap-3">
            <div class="text-2xl">
              <span v-if="method.type === 'bank'">🏦</span>
              <span v-else-if="method.type === 'upi'">🔗</span>
              <span v-else-if="method.type === 'cash'">💵</span>
            </div>
            <div class="text-sm">
              <div class="font-medium capitalize">{{ method.type }}</div>
              <div class="text-gray-500 text-xs">
                <span v-if="method.type === 'bank'">****{{ method.account_number.slice(-4) }}</span>
                <span v-else-if="method.type === 'upi'">{{ method.upi_id }}</span>
                <span v-else-if="method.type === 'cash'">Pay in Cash to Owner</span>
              </div>
            </div>
          </div>
          <input type="radio" :checked="selectedId === method.id" />
        </div>
      </div>
  
      <!-- Continue Button -->
      <div class="mt-8">
        <button
          class="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold disabled:opacity-50"
          :disabled="!selectedId"
          @click="confirmPaymentMethod"
        >
          Continue
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, inject, onMounted, getCurrentInstance } from 'vue';
  import { useRouter } from 'vue-router';
  import useApiRequest from '@/composables/request'
  import { currency, formatDate, ucfirst } from '@/composables/helper';

  const QueryParams = inject('QueryParams'); // Inject global params
  const PaymentId = QueryParams.value[0] ?? 0;
  const payment = ref({});
  
  getCurrentInstance().proxy.$setHeader('Pay Now', '', true, '')
  const router = useRouter();
  const request = useApiRequest()
  const selectedId = ref(null);

  function confirmPaymentMethod() {
    console.log('Selected payment method ID:', '/payment/confirm/'+PaymentId+'/'+selectedId.value);
    router.push('/pay-now/confirm/'+PaymentId+'/'+selectedId.value);
  }

  onMounted(async () => {
    if (PaymentId == 0)
        router.push('/dashboard');
  console.log('pay', PaymentId)
    const response = await request.post('entity/Payment/' + PaymentId + '?group=PayNow' )
    if (response.error) {
      Signal.error(response.message)
      return;
    }
  
    payment.value = response.data;
    payment.value.users = payment.value.UserIds;

    console.log('PaymentUserIds', payment.value)
  });
  </script>
  
  <style scoped></style>
  