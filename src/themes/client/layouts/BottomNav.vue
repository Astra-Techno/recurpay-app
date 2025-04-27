<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-200 font-bold text-base z-50">
    <div class="flex justify-around items-center h-14">
      <router-link to="/dashboard" class="flex flex-col items-center no-bg">
        <Icon name="IconDashboard" class="w-6 h-6 mb-1" />
        <span class="text-xs">Dashboard</span>
      </router-link>

      <router-link to="/properties" class="flex flex-col items-center no-bg">
        <Icon name="IconMinimal" class="w-6 h-6 mb-1" />
        <span class="text-xs">Properties</span>
      </router-link>

      <router-link to="/payments" class="flex flex-col items-center no-bg">
        <Icon name="IconPayment" class="w-6 h-6 mb-1" />
        <span class="text-xs">Transactions</span>
      </router-link>

      <router-link to="/settings" class="flex flex-col items-center no-bg">
        <Icon name="IconSettings" class="w-6 h-6 mb-1" />
        <span class="text-xs">Settings</span>
      </router-link>
    </div>
  </nav>
</template>