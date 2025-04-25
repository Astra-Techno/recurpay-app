<template>
    <section class="p-4">
      <h2 class=" font-black italic mb-2">👋 Welcome, {{ user.name ? user.name : 'User' }}!</h2>
      <p class="indent-2">You are managing {{ statsCount.totalProperties }} properties.</p>
    </section>
    <section class="px-4 pb-4">
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-white p-4 rounded shadow text-center">
          <div class="text-blue-500 text-2xl mb-2">🏠</div>
          <p>My Properties</p>
          <p class="text-xl font-bold">{{ statsCount.totalProperties }}</p>
        </div>
        <div class="bg-white p-4 rounded shadow text-center">
          <div class="text-blue-500 text-2xl mb-2">👥</div>
          <p>My Tenants</p>
          <p class="text-xl font-bold">{{ statsCount.tenants }}</p>
        </div>
        <div class="bg-white p-4 rounded shadow text-center">
          <div class="text-blue-500 text-2xl mb-2">💸</div>
          <p>Due Payments</p>
          <p class="text-xl font-bold">{{ statsCount.pendingPayments }}</p>
        </div>
      </div>
    </section>

    <section class="px-4 pb-4" v-show="dues?.total > 0">
      <h3 class="text-md font-semibold mb-2">⏰ Dues</h3>
      <list ref="dues" class="w-full" tmpl="custom" :data-url="'list/Payments?Due=1'" :filter-toggle="false"
        :messages="{ empty: 'No more dues to pay!' }" :page-limit="2" :show-pagination="false" :search="false">
        <template #body="{ rows }">
          <div class="space-y-2">
            <div v-for="payment in rows" :key="payment.id" class="bg-white p-4 rounded shadow">
              <div class="flex justify-between items-center mb-2">
                <p class="font-semibold">{{ payment.property }}</p>
                <p>{{ payment.address1 }}</p>
                <p>{{ ucfirst(payment.type) }} – ₹{{ payment.total_due }} </p>
                <span class="text-orange-600 font-medium">Due in {{ payment.due_in_days }} days</span>
                <router-link :to="{ name: 'PropertyView', params: { id: payment.id } }">
                  <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">View</button>
                </router-link>
              </div>
              <div class="flex gap-2">
                <router-link :to="{ name: 'PayNow', params: { payment_id: payment.id } }">
                  <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">Pay Now</button>
                </router-link>
              </div>
            </div>
          </div>
        </template>
      </list>
    </section>

    <section class="px-4 pb-4" v-show="pendings?.total > 0">
      <h3 class="text-md font-semibold mb-2">💰 Pendings</h3>
      <list ref="pendings" class="w-full" tmpl="custom" :data-url="'list/Payments?Pending=1'" :filter-toggle="false"
        :messages="{ empty: 'No more pendings to pay!' }" :page-limit="2" :show-pagination="false" :search="false">
        <template #body="{ rows }">
          <div class="space-y-2">
            <div v-for="payment in rows" :key="payment.id" class="bg-white p-4 rounded shadow">
              <div class="flex justify-between items-center mb-2">
                <p class="font-semibold">{{ payment.property }}</p>
                <p>{{ payment.address1 }}</p>
                <p>{{ ucfirst(payment.type) }} – ₹{{ payment.total_due }} </p>
                <span class="text-orange-600 font-medium">Due in {{ payment.due_in_days }} days</span>
                <router-link :to="{ name: 'PropertyView', params: { id: payment.id } }">
                  <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">View</button>
                </router-link>
              </div>
              <div class="flex gap-2">
                <router-link :to="{ name: 'MarkAsPaid', params: { payment_id: payment.id } }">
                  <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">Mark As Paid</button>
                </router-link>
                <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">Send Reminder</button>
              </div>
            </div>
          </div>
        </template>
      </list>
    </section>

       

    <section class="px-4 pb-6">
      <h3 class="text-md font-semibold mb-2">💳 Recent Payments</h3>
      <div class="bg-white p-4 rounded shadow space-y-2">
        <div class="flex justify-between text-sm">
          <p>Priya R – Sunrise Villa</p>
          <span class="text-red-500 font-medium">₹12,000 Due</span>
        </div>
        <div class="flex justify-between text-sm">
          <p>Ram Kumar – Green Apartments</p>
          <span class="text-green-600 font-medium">₹15,000 Paid</span>
        </div>
      </div>
    </section>
  
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMeta } from '@/composables/use-meta';
import { useAppStore } from '@/stores/index'
import useApiRequest from '@/composables/request'
import { ucfirst } from '@/composables/helper';
import Signal from '@/composables/signal'
import List from '@/components/List/List.vue'
import PropertiesList from '@/components/common/Properties.vue'

const request = useApiRequest();
useMeta({ title: 'Dashboard' })
const user = useAppStore().getUser();
const statsCount = ref({});

const owned = ref(null);
const rented = ref(null);
const dues = ref(null);
const pendings = ref(null);

const loadStats = async () => {
  // Handle form submission logic here
  const response = await request.post('task/Dashboard/statsList')
  if (response.error) {
    Signal.error(response.message);
    return;
  }

  if (response.data && response.data.stats) {
    const responseStats = response.data.stats;
    statsCount.value = response.data.statsCount;
  }
};
// Load property data if editing
onMounted(async () => {
  loadStats()
});
</script>
