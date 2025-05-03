<template>
  <div class="min-h-screen bg-gray-50 p-4 text-gray-800">

    <!-- Payment Methods List -->
    <list ref="rented" class="space-y-4 mb-6" tmpl="custom" :data-url="'list/PaymentMethods'"
      :filter-toggle="false" :messages="{ empty: 'No more payment methods!' }" :page-limit="5" 
      :show-pagination="false" :search="false">
      <template #body="{ rows }">
          <div v-for="method in rows" :key="method.id" class="bg-white p-4 rounded shadow flex justify-between items-center">
          <div>
            <router-link :to="`/payment-methods/detail/${method.id}`">
              <div class="font-semibold">
                <span v-if="method.type === 'bank'">Bank Account</span>
                <span v-else-if="method.type === 'upi'">UPI ID</span>
              </div>
              <div class="text-sm text-gray-600">
                <span v-if="method.type === 'bank'">****{{ method.account_number.slice(-4) }} - {{ method.bank_name }}</span>
                <span v-else-if="method.type === 'upi'">{{ method.upi_id }}</span>
              </div>
            </router-link>
          </div>
          <div>
              <button class="text-xs bg-red-500 text-white px-3 py-1 rounded">Delete</button>
          </div>
          </div>
      </template>
    </list>

    <!-- Add Payment Method Button -->
    <router-link to="/payment-methods/add">
      <button class="w-full bg-blue-600 text-white py-2 rounded text-center font-semibold">
        + Add Account
      </button>
    </router-link>
  </div>
</template>

<script setup>
import List from '@/components/List/List.vue'
import { getCurrentInstance } from 'vue'

getCurrentInstance().proxy.$setHeader('🏦 Accounts', '', true, '')
</script>

<style scoped>
</style>
