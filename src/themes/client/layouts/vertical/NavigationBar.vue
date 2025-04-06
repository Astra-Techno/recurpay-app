<template>
    <header class="bg-white border-b z-50">
      <div class="flex-1 container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-2" >
        <div class="flex justify-between items-center h-16">
          <!-- Left: Logo -->
          <div class="flex items-center space-x-2 px-2">
            <Icon name="IconMinimal" class="cursor-pointer w-[30px] h-[30px]" />
  
            <div>
              <h1 class="font-black italic cursor-pointer leading-none">MyProps</h1>
              <span class="text-[8px] font-bold text-right block leading-none tracking-widest">
                Rent.Pay.Go.
              </span>
            </div>
          </div>
  
          <!-- Nav Links -->
          <div class="hidden md:flex items-center space-x-4">
            <nav class="flex space-x-6 font-semibold text-base">
              <RouterLink to="/properties" class="hover:text-primary">Explore</RouterLink>
              <RouterLink to="/dashboard" class="hover:text-primary">Dashboard</RouterLink>
            </nav>
          </div>
  
          <!-- Center: Search -->
          <div class="flex-1 mx-8">
            <div class="relative">
              <input
                type="text"
                placeholder="Search MyProps..."
                class="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <span class="absolute left-3 top-2.5 text-gray-400">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                  stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
            </div>
          </div>
  
          <!-- Right: Icons -->
          <div class="flex items-center space-x-5">
            <button class="relative hover:text-primary">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M13 16h-1v-4h-1m1-4h.01M12 18h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
              </svg>
              <span
                class="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                1
              </span>
            </button>
  
            <button class="hover:text-primary">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 3h18v18H3z" />
              </svg>
            </button>
  
            <button class="hover:text-primary">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 6h15M6 12h9M6 18h6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
  // You can add props or user info here later
  </script>
  
  <style scoped>
  :root {
    --tw-ring-color: #00f3bb;
  }
  </style>
  