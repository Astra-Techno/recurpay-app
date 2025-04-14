<template>
  <div class="space-y-6">
    <!-- Header with Welcome and Action Button -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-black italic">Welcome back, {{ extendedStore.user.full_name? extendedStore.user.full_name :'User' }}!</h1>
        <p class="text-gray-600">Here's a quick overview of your properties and activities.</p>
      </div>
      <RouterLink
        to="/property/basic"
        class="mt-4 md:mt-0 inline-flex items-center px-4 py-2 rounded-xl bg-[var(--button-primary-background)] text-white hover:bg-[var(--button-primary-focus-background)]"
      >
        <Plus class="w-5 h-5 mr-2" /> Add Property
      </RouterLink>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label" class="p-4 bg-white rounded-xl shadow flex items-center">
        <div :class="['p-2 rounded-full', stat.bg]">
          <component :is="stat.icon" class="w-5 h-5" />
        </div>
        <div class="ml-3">
          <p class="text-lg font-semibold">{{ stat.value }}</p>
          <p class="text-sm text-gray-500">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-4 rounded-xl shadow">
        <h2 class="text-lg font-semibold mb-2">Monthly Rent Collection</h2>
        <apexchart type="bar" height="250" :options="rentChart.options" :series="rentChart.series" />
      </div>
      <div class="bg-white p-4 rounded-xl shadow">
        <h2 class="text-lg font-semibold mb-2">Occupancy Rate</h2>
        <apexchart type="donut" height="250" :options="occupancyChart.options" :series="occupancyChart.series" />
      </div>
    </div>

    <!-- Revenue Breakdown & Lease Expiry -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-4 rounded-xl shadow">
        <h2 class="text-lg font-semibold mb-2">Revenue Breakdown</h2>
        <apexchart type="pie" height="250" :options="revenueChart.options" :series="revenueChart.series" />
      </div>
      <div class="bg-white p-4 rounded-xl shadow">
        <h2 class="text-lg font-semibold mb-2">Lease Expiry Timeline</h2>
        <apexchart type="bar" height="250" :options="leaseChart.options" :series="leaseChart.series" />
      </div>
    </div>

    <!-- Activity Log -->
    <div class="bg-white p-4 rounded-xl shadow">
      <h2 class="text-lg font-semibold mb-3">Recent Activity</h2>
      <ul>
        <li v-for="activity in activities" :key="activity.message" class="border-b last:border-b-0 py-2">
          <p class="text-sm">{{ activity.message }}</p>
          <p class="text-xs text-gray-400">{{ activity.time }}</p>
        </li>
      </ul>
    </div>

    <!-- Upcoming Renewals -->
    <!--<div class="bg-white p-4 rounded-xl shadow">
      <h2 class="text-lg font-semibold mb-3">Upcoming Lease Renewals</h2>
      <ul>
        <li v-for="lease in leaseRenewals" :key="lease.unit" class="border-b last:border-b-0 py-2">
          <div class="flex justify-between">
            <span class="font-medium">{{ lease.tenant }}</span>
            <span class="text-sm text-gray-500">{{ lease.endDate }}</span>
          </div>
          <p class="text-sm text-gray-500">{{ lease.unit }}</p>
        </li>
      </ul>
    </div>-->

    <!-- Notifications Button 
    <div>
      <button class="flex items-center px-4 py-2 rounded-xl shadow">
        <Bell class="w-5 h-5 mr-2" /> Notifications
      </button>
    </div>
    -->
  </div>
</template>

<script setup>
import { ref , onMounted} from 'vue';
import { Home, Users, DollarSign, Bell, FileText, Plus } from 'lucide-vue-next';
import ApexCharts from 'vue3-apexcharts';
import { useMeta } from '@/composables/use-meta';
import { useExtendedStore } from '../stores/extendedStore'
import useApiRequest from '@/composables/request'
import Signal from '@/composables/signal'
const request = useApiRequest();
useMeta({ title: 'Dashboard' })

const userName = 'John';

const extendedStore = useExtendedStore()

const loadStats = async () => {
  // Handle form submission logic here
  const response = await request.post('task/Dashboard/statsList')
  if (response.error) {
    Signal.error(response.message);
    return;
  }

  if (response.data && response.data.stats) {
    const responseStats = response.data.stats;

    stats.value = defaultStats.map(stat => {
      let rawValue = responseStats[stat.label] ?? stat.value;

      // Format "Revenue" if needed
      if (stat.label === 'Revenue') {
        rawValue = `$${Number(rawValue).toLocaleString()}`;
      }

      return {
        ...stat,
        value: rawValue
      };
    });
  }
};


// Load property data if editing
onMounted(async () => {
	loadStats()
  });
  const defaultStats = [
  { label: 'Total Properties', value: 0, icon: Home, bg: 'bg-blue-100 text-blue-600' },
  { label: 'Occupied Units', value: 0, icon: Users, bg: 'bg-green-100 text-green-600' },
  { label: 'Pending Payments', value: 0, icon: DollarSign, bg: 'bg-yellow-100 text-yellow-600' },
  { label: 'Revenue', value: '$0', icon: DollarSign, bg: 'bg-purple-100 text-purple-600' },
];
  const stats = ref(defaultStats); 
  

const activities = ref([
  { message: 'John Doe paid rent for Apt 204', time: '2 hrs ago' },
  { message: 'New tenant signed lease - Apt 305', time: '5 hrs ago' },
  { message: 'Maintenance request for Apt 102', time: '1 day ago' }
]);

const leaseRenewals = ref([
  { tenant: 'Alice Smith', unit: 'Apt 301', endDate: 'Apr 20, 2025' },
  { tenant: 'Bob Lee', unit: 'Apt 105', endDate: 'May 10, 2025' }
]);

const rentChart = {
  series: [{ name: 'Collected', data: [6800, 7200, 7500, 7000, 7300, 7600] }],
  options: {
    chart: { type: 'bar', toolbar: { show: false } },
    xaxis: { categories: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'] },
    colors: ['#3b82f6']
  }
};

const occupancyChart = {
  series: [10, 2],
  options: {
    labels: ['Occupied', 'Vacant'],
    colors: ['#22c55e', '#ef4444'],
    legend: { position: 'bottom' }
  }
};

const revenueChart = {
  series: [6000, 1000, 500],
  options: {
    labels: ['Rent', 'Maintenance', 'Late Fees'],
    colors: ['#6366f1', '#f59e0b', '#ef4444'],
    legend: { position: 'bottom' }
  }
};

const leaseChart = {
  series: [{ name: 'Expiring', data: [1, 2, 3, 0, 1, 2] }],
  options: {
    chart: { type: 'bar', toolbar: { show: false } },
    xaxis: { categories: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'] },
    colors: ['#10b981']
  }
};
</script>

<script>
export default {
  components: {
    apexchart: ApexCharts
  }
}
</script>

<style scoped>
/* Optional extra styling */
</style>
