<template>
    <div>
      <h2 class="text-lg font-semibold mb-4">Bank Details</h2>
      <div class="bg-white p-4 rounded-xl shadow space-y-2">
        <p><strong>Bank:</strong> {{ tenant.bankName }}</p>
        <p><strong>Account Number:</strong> {{ tenant.accountNumber }}</p>
        <p><strong>Auto Debit:</strong> <span class="text-green-600">Enabled</span></p>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({ tenant: Object })
  </script>
  