<template>
  <div class="space-y-6 bg-white min-h-screen">
   
    

    <!-- Search -->
    <div class="relative">
      <input type="text" placeholder="Search services" class="w-full rounded-xl bg-gray-100 py-2 px-4" />
    </div>

    <!-- Balance Overview -->
    <div class="bg-gray-50 p-4 rounded-xl">
      <h2 class="font-semibold mb-2">Balance Overview</h2>
      <div class="flex justify-between items-center">
        <div>
          <p class="text-sm text-gray-500">Current Balance</p>
          <p class="text-xl font-bold">₹2,400</p>
          <p class="text-xs text-gray-400">Spent ₹5,800 | Received ₹7,200</p>
        </div>
        <div class="w-20 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-teal-400"></div>
      </div>
    </div>

    <!-- Active Subscriptions -->
    <div>
      <h2 class="font-semibold mb-2">Active Subscriptions</h2>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <img src="@/assets/images/rosewood.png" alt="Rosewood" class="h-24 w-full object-cover" />
          <div class="p-3">
            <h3 class="text-sm font-semibold">Rosewood Residences</h3>
            <p class="text-xs text-gray-500">₹12,000 | Due Jun 1</p>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <img src="@/assets/images/fitness.png" alt="Fitness" class="h-24 w-full object-cover" />
          <div class="p-3">
            <h3 class="text-sm font-semibold">Fitness First</h3>
            <p class="text-xs text-gray-500">₹800 | Due May 28</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Due Payments -->
    <div>
      <h2 class="font-semibold mb-2">Due Payments</h2>
      <div v-for="item in duePayments" :key="item.name" class="flex items-center justify-between py-2">
        <div class="flex items-center space-x-3">
          <component :is="item.icon" class="w-5 h-5 text-indigo-500" />
          <div>
            <p class="text-sm font-medium">{{ item.name }}</p>
            <p class="text-xs text-gray-500">{{ item.amount }} Due {{ item.due }}</p>
          </div>
        </div>
        <button class="text-sm px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full">Pay Now</button>
      </div>
    </div>

    <!-- Pending Payments -->
    <div>
      <h2 class="font-semibold mb-2">Pending Payments</h2>
      <div v-for="item in pendingPayments" :key="item.name + item.service" class="flex items-center justify-between py-2">
        <div class="flex items-center space-x-3">
          <img src="@/assets/images/avatar.png" class="w-8 h-8 rounded-full" />
          <div>
            <p class="text-sm font-medium">{{ item.name }}</p>
            <p class="text-xs text-gray-500">{{ item.amount }} Due {{ item.date }}<br />{{ item.service }}</p>
          </div>
        </div>
        <button :class="item.reminder ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'" class="text-sm px-3 py-1 rounded-full">
          {{ item.reminder ? 'Send Reminder' : 'Mark as Paid' }}
        </button>
      </div>
    </div>

    <!-- Quick Pay -->
    <div>
      <h2 class="font-semibold mb-2">Quick Pay</h2>
      <div class="flex space-x-4">
        <img src="@/assets/images/avatar.png" class="w-10 h-10 rounded-full" />
        <div class="w-10 h-10 rounded-full bg-gray-300" />
      </div>
    </div>

    <!-- Quick Actions -->
    <div>
      <h2 class="font-semibold mb-2">Quick Actions</h2>
      <div class="grid grid-cols-3 gap-2">
        <button class="flex flex-col items-center justify-center p-3 bg-gray-100 rounded-xl">
          <PlusIcon class="w-5 h-5 mb-1" />
          <span class="text-xs">Add</span>
        </button>
        <button class="flex flex-col items-center justify-center p-3 bg-gray-100 rounded-xl">
          <SearchIcon class="w-5 h-5 mb-1" />
          <span class="text-xs">Explore</span>
        </button>
        <button class="flex flex-col items-center justify-center p-3 bg-gray-100 rounded-xl">
          <ClockIcon class="w-5 h-5 mb-1" />
          <span class="text-xs">History</span>
        </button>
      </div>
    </div>

    <!-- Transaction History -->
    <div>
      <h2 class="font-semibold mb-2">Transaction History</h2>
      <div v-for="item in transactionHistory" :key="item.name" class="flex items-center justify-between py-2">
        <div class="flex items-center space-x-3">
          <component :is="item.icon" class="w-5 h-5 text-indigo-500" />
          <div>
            <p class="text-sm font-medium">{{ item.name }}</p>
            <p class="text-xs text-gray-500">Paid {{ item.date }}<br />{{ item.subtitle }}</p>
          </div>
        </div>
        <span class="text-sm font-semibold text-red-500">{{ item.amount }}</span>
      </div>
    </div>

    <!-- Floating Button -->
    <button class="fixed bottom-4 right-4 bg-violet-100 rounded-full p-4">
      <PlusIcon class="w-6 h-6 text-violet-500" />
    </button>
  </div>
</template>

<script setup>
import { BellIcon, PlusIcon, SearchIcon, ClockIcon, HomeIcon, DumbbellIcon, BookOpenIcon } from 'lucide-vue-next'

const duePayments = [
  { icon: HomeIcon, name: 'Rosewood', amount: '₹12,000', due: 'Today' },
  { icon: DumbbellIcon, name: 'Fitness First', amount: '₹800', due: 'Today' },
  { icon: BookOpenIcon, name: 'Learning Hub', amount: '₹500', due: 'Today' },
]

const pendingPayments = [
  { name: 'Liam', amount: '₹500', date: '05/20/2024', service: 'Fitness First', reminder: true },
  { name: 'Liam', amount: '₹300', date: '05/20/2024', service: 'Learning Hub', reminder: false },
]

const transactionHistory = [
  { icon: HomeIcon, name: 'Rent Payment', amount: '-₹12,000', date: '05/15/2024', subtitle: 'Rosewood Residences' },
  { icon: DumbbellIcon, name: 'Gym Membership', amount: '-₹800', date: '05/15/2024', subtitle: 'Fitness First' },
]
</script>

<style scoped>
</style>