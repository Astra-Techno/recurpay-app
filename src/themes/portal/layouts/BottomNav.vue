<template>
  <nav class="fixed bottom-0 left-0 right-0  text-white max-w-[390px] mx-auto z-50 border-t ">
    <div class="flex justify-around items-center h-16 text-sm">
      <router-link
        to="/dashboard"
        :class="[$route.path === '/dashboard' ? 'text-white font-semibold' : 'text-gray-400', 'flex flex-col items-center py-1 hover:text-white transition-colors']"
      >
        <Icon name="IconDashboard" class="w-6 h-6 mb-0.5" />
        <span class="text-[11px]">Home</span>
      </router-link>

      <router-link
        to="/properties"
        :class="[$route.path === '/properties' ? 'text-white font-semibold' : 'text-gray-400', 'flex flex-col items-center py-1 hover:text-white transition-colors']"
      >
        <Icon name="IconMinimal" class="w-6 h-6 mb-0.5" />
        <span class="text-[11px]">Services</span>
      </router-link>

      <router-link
        to="/transactions"
        :class="[$route.path === '/transactions' ? 'text-white font-semibold' : 'text-gray-400', 'flex flex-col items-center py-1 hover:text-white transition-colors']"
      >
        <Icon name="IconPayment" class="w-6 h-6 mb-0.5" />
        <span class="text-[11px]">Payments</span>
      </router-link>

      <router-link
        to="/settings"
        :class="[$route.path === '/settings' ? 'text-white font-semibold' : 'text-gray-400', 'flex flex-col items-center py-1 hover:text-white transition-colors']"
      >
        <Icon name="IconSettings" class="w-6 h-6 mb-0.5" />
        <span class="text-[11px]">Profile</span>
      </router-link>
    </div>
  </nav>
</template>
