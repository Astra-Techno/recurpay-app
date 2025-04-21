<template>
    <div class="bg-white text-gray-800     rounded-t-2xl flex flex-col h-screen">
      
	<div class="min-h-screen ">
	  <!-- Header -->
	  <div class="bg-blue-600  px-6 pt-6 pb-4 text-white">
		<button class="text-white mb-4">←</button>
		<h1 class="text-2xl font-bold">Green Apartments</h1>
		<p class="text-sm mt-1">128 Main St, Chennai</p>
	  </div>
  
	  <!-- Property Info Card -->
	  <div class="bg-white mx-4 -mt-10 shadow p-4">
		<div class="flex justify-between text-center">
		  <div class="flex-1">
			<p class="text-xl font-bold">3</p>
			<p class="text-xs text-gray-500">Bedrooms</p>
		  </div>
		  <div class="flex-1">
			<p class="text-xl font-bold">2</p>
			<p class="text-xs text-gray-500">Bathrooms</p>
		  </div>
		  <div class="flex-1">
			<p class="text-xl font-bold">1,500</p>
			<p class="text-xs text-gray-500">Sq. Ft.</p>
		  </div>
		</div>
		<div class="flex gap-3 mt-4">
		  <button class="flex-1 py-2 bg-gray-200 rounded-md text-sm font-semibold">Edit Property</button>
		  <button class="flex-1 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold">Add Tenant</button>
		</div>
	  </div>
  
	  <!-- Current Tenants -->
	  <div class="mt-6 px-4">
		<h2 class="text-sm font-semibold mb-2">Current Tenants</h2>
		<div class="bg-gray-100 rounded-xl p-4 flex items-center justify-between">
		  <div class="flex items-center gap-3">
			<div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
			  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
			  </svg>
			</div>
			<div>
			  <p class="text-sm font-medium">Ram Kumar</p>
			  <p class="text-xs text-blue-600">Active</p>
			</div>
		  </div>
		  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
		  </svg>
		</div>
	  </div>
  
	  <!-- Payments -->
	  <div class="mt-6 px-4">
		<h2 class="text-sm font-semibold mb-2">Payments</h2>
		<div class="bg-gray-100 rounded-xl p-4 flex items-center justify-between">
		  <div>
			<p class="text-sm font-medium">May Rent</p>
			<p class="text-xs text-blue-600 mt-1">Due: May 5</p>
		  </div>
		  <p class="text-sm font-semibold">₹15,000</p>
		</div>
	  </div>
	</div>
    </div>
  </template>
  
  <script setup lang="ts">
  // static demo
  </script>
  
  <style scoped>
  </style>