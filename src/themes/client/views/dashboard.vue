<template>
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white shadow-md">
        <div class="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 class="text-xl font-bold">Dashboard</h1>
          <button
            @click="logout"
            class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </nav>
      <div class="container mx-auto px-6 py-8">
        <h2 class="text-2xl font-bold mb-6">Your Subscriptions</h2>
        <div v-if="subscriptions.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="subscription in subscriptions"
            :key="subscription.id"
            class="bg-white p-6 rounded-lg shadow-md"
          >
            <h3 class="text-xl font-bold">{{ subscription.service_name }}</h3>
            <p class="text-gray-600">Next Payment: {{ subscription.next_payment_date }}</p>
            <p class="text-gray-600">Status: {{ subscription.status }}</p>
          </div>
        </div>
        <p v-else class="text-gray-600">No subscriptions found.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import useApiRequest from '@/composables/request';
  import Signal from "@/composables/signal";

  onMounted(() => {
	fetchSubscriptions();
  });

  const subscriptions = []
  const request = useApiRequest();

  async function fetchSubscriptions() {
      //loading.value = true;
      let response = await request.fetch('list/Subscription:byUser');
      if (response.error) {
          Signal.error(response.message);
          return;
      }

    console.log('res', response)
  }
  
  </script>