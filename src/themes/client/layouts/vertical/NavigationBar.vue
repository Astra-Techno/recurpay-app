<template>
    <header class="bg-white border-b shadow-sm w-full z-50">
      <div class="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo & Brand -->
          <div class="flex items-center space-x-2 px-2">
            <Icon name="IconMinimal" class="cursor-pointer w-[30px] h-[30px]" />
  
            <div>
              <h1 class="font-black italic cursor-pointer leading-none">MyProps</h1>
              <span class="text-[8px] font-bold text-right block leading-none tracking-widest">
                Rent.Pay.Go.
              </span>
            </div>
          </div>
  
          <!-- Nav (center) -->
          <nav class="hidden md:flex space-x-6 font-semibold text-base">
            <RouterLink
              to="/dashboard"
              :class="getLinkClass('/dashboard')"
            >Dashboard</RouterLink>
            <RouterLink
              to="/properties"
              :class="getLinkClass('/properties')"
            >Properties</RouterLink>
            <RouterLink
              to="/Tenant/List"
              :class="getLinkClass('/Tenant/List')"
            >Tenants</RouterLink>
            <RouterLink
              to="/Transaction/List"
              :class="getLinkClass('/Transaction/List')"
            >Transactions</RouterLink>
           
          </nav>
  
          <!-- Search + Icons -->
          <div class="flex items-center space-x-4">
            <!-- Search -->
            <div class="relative hidden lg:block">
              <input
                type="text"
                placeholder="Search MyProps..."
                class="pl-10 pr-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span class="absolute left-3 top-2.5 text-gray-400">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"
                  viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
            </div>  
            <!-- Icons -->
            <button class="hover:text-primary">
              <LucideBell class="w-5 h-5" />
            </button>
            <button class="hover:text-primary">
              <LucideWallet class="w-5 h-5" />
            </button>
           
  
            <!-- Profile Avatar -->
            <img
              src="https://i.pravatar.cc/32"
              alt="Profile"
              class="w-8 h-8 rounded-full object-cover border"
            />
          </div>
        </div>
      </div>
  
      <!-- Sub Nav (like Groww's Stocks / F&O / MF) -->
      <div class="border-t">
        <div class="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <nav class="flex space-x-6 text-sm font-semibold py-2">
            <RouterLink :class="getSubLinkClass('/stocks')" to="/stocks">Stocks</RouterLink>
            <RouterLink :class="getSubLinkClass('/fno')" to="/fno">F&O</RouterLink>
            <RouterLink :class="getSubLinkClass('/mutual-funds')" to="/mutual-funds">Mutual Funds</RouterLink>
          </nav>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router'
  import { LucideBell, LucideWallet } from 'lucide-vue-next'
  
  const route = useRoute()
  
  const getLinkClass = (path) => {
    return route.path.startsWith(path)
      ? 'text-primary border-b-2 border-primary pb-1'
      : 'text-gray-600 hover:text-primary'
  }
  
  const getSubLinkClass = (path) => {
    return route.path.startsWith(path)
      ? 'text-primary border-b-2 border-primary pb-1'
      : 'text-gray-600 hover:text-primary'
  }
  </script>
  