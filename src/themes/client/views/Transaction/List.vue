<template>
  <div class=" min-h-screen ">
    <!-- Header -->
    <div class="flex space-x-2 mb-4">
		<Icon name="IconTransaction"></Icon><h1 class="text-2xl font-bold">Transactions</h1>
	</div>


    <!-- Transaction Detail View -->
    <div v-if="selectedTransaction" class="space-y-5">
      <!-- Profile Header Style Card -->
      <div class="mb-3">
        <Icon name="IconBack" @click="selectedTransaction = null" class="font-black cursor-pointer text-2xl text-[var(--ui-background)]" />
       
      </div>

      <!-- Info Items -->
      <div class="space-y-3">
        <InfoItem icon="material-symbols:calendar-month" title="Payment Date" :subtitle="selectedTransaction.date" />

        <InfoItem icon="material-symbols:payments" title="Amount Paid" :subtitle="`₹${selectedTransaction.amount}`" />

        <InfoItem icon="material-symbols:info-outline" title="Payment Status" :subtitle="selectedTransaction.status"
          :badge="selectedTransaction.status" />

        <InfoItem icon="material-symbols:receipt" title="Download Receipt" subtitle="Get a PDF copy of the transaction"
          buttonText="Download" buttonColor="text-blue-600 bg-blue-100" />
      </div>
    </div>

    <!-- Transactions List View -->
    <div v-else class="space-y-4">
      <div v-for="tx in transactions" :key="tx.id + tx.date" @click="selectedTransaction = tx"
        class="bg-white rounded-xl shadow p-4 cursor-pointer hover:bg-gray-50 transition flex items-center justify-between">
        <!-- Left: Tenant & Property -->
        <div class="flex-1 min-w-0">
          <h3 class="text-gray-800 font-medium truncate">{{ tx.tenant }}</h3>
          <p class="text-sm text-gray-500 truncate">{{ tx.property }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ tx.date }}</p>
        </div>

        <!-- Middle: Amount -->
        <div class="text-right sm:text-center sm:w-32">
          <p class="text-green-600 font-semibold whitespace-nowrap">₹{{ tx.amount }}</p>
        </div>

        <!-- Right: Status -->
        <div class="sm:w-24 text-right">
          <span :class="[
            'text-xs px-2 py-1 rounded-full whitespace-nowrap inline-flex items-center gap-1',
            tx.status === 'Paid'
              ? 'bg-green-100 text-green-700'
              : tx.status === 'Pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
          ]">
            <Icon
              :name="tx.status === 'Paid' ? 'material-symbols:check-circle' : tx.status === 'Pending' ? 'material-symbols:schedule' : 'material-symbols:error-outline'"
              class="w-4 h-4" />
            {{ tx.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref } from 'vue'
import InfoItem from '@/components/elements/InfoItem.vue'

const selectedTransaction = ref(null)

const transactions = [
  {
    id: 1,
    tenant: 'John Doe',
    property: '2BHK - Green Valley Apt',
    amount: 18000,
    date: '2025-04-01',
    status: 'Paid'
  },
  {
    id: 2,
    tenant: 'Jane Smith',
    property: '1RK - Sunrise Plaza',
    amount: 9500,
    date: '2025-04-03',
    status: 'Pending'
  },
  {
    id: 3,
    tenant: 'Mike Johnson',
    property: '3BHK - Palm Residency',
    amount: 25000,
    date: '2025-03-28',
    status: 'Failed'
  },
  {
    id: 4,
    tenant: 'Rachel Green',
    property: '1BHK - Orchid Enclave',
    amount: 12000,
    date: '2025-04-05',
    status: 'Paid'
  },
  {
    id: 5,
    tenant: 'Joey Tribbiani',
    property: 'Studio - Maple Residency',
    amount: 8500,
    date: '2025-04-02',
    status: 'Pending'
  }
]
</script>

<style scoped></style>