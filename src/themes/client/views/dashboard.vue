
<script setup>
import { ref } from 'vue';
import { Home, Users, DollarSign, Bell, Plus } from 'lucide-vue-next';
import { useMeta } from '@/composables/use-meta';
useMeta({ title: 'Dashboard' })

const stats = ref([
  { label: 'Total Properties', value: 12, icon: Home },
  { label: 'Occupied Units', value: 10, icon: Users },
  { label: 'Pending Payments', value: 3, icon: DollarSign },
  { label: 'Revenue', value: '$7,500', icon: DollarSign }
]);

const activities = ref([
  { message: 'John Doe paid rent for Apt 204', time: '2 hrs ago' },
  { message: 'New tenant signed lease - Apt 305', time: '5 hrs ago' },
  { message: 'Maintenance request for Apt 102', time: '1 day ago' }
]);
</script>

<template>
  <div class="p-4  min-h-screen">    
    <h1 class="text-2xl font-semibold mb-4">Welcome back, [User]!</h1>
    <p class=" mb-6">Here’s a quick overview of your properties and activities.</p>
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div v-for="stat in stats" :key="stat.label" class="p-4 bg-white rounded-xl shadow-md flex items-center">
        <component :is="stat.icon" class="w-6 h-6  mr-3" />
        <div>
          <p class="text-lg font-semibold">{{ stat.value }}</p>
          <p class="text-sm ">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-md mb-6">
      <h2 class="text-lg font-semibold mb-3">Recent Activity</h2>
      <ul>
        <li v-for="activity in activities" :key="activity.message" class="border-b last:border-b-0 py-2">
          <p class="text-sm">{{ activity.message }}</p>
          <p class="text-xs ">{{ activity.time }}</p>
        </li>
      </ul>
    </div>

    <div class="flex justify-between">
      <button class="flex items-center px-4 py-2 rounded-xl shadow-md">
        <Plus class="w-5 h-5 mr-2" /> Add Property
      </button>
      <button class="flex items-center px-4 py-2  rounded-xl shadow-md">
        <Bell class="w-5 h-5 mr-2" /> Notifications
      </button>
    </div>
  </div>
</template>
