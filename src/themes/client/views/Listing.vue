<template>
	<div class="min-h-screen bg-gray-50 p-4 sm:p-6">
	  
  
	  <!-- Property Grid -->
	  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
		<div 
		  v-for="property in properties"
		  :key="property.id"
		  class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
		  @click="viewProperty(property.id)"
		>
		  <div class="relative">
			<img 
			  :src="property.image" 
			  :alt="property.address" 
			  class="w-full h-48 sm:h-56 object-cover"
			>
			<div class="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-sm font-medium">
			  ${{ property.price }}/mo
			</div>
		  </div>
		  
		  <div class="p-4">
			<h3 class="font-semibold text-lg text-gray-900 mb-1 truncate">{{ property.address }}</h3>
			
			<div class="flex gap-4 text-sm text-gray-600 mb-3">
			  <span class="flex items-center gap-1">
				
				{{ property.beds }}bd
			  </span>
			  <span class="flex items-center gap-1">
				
				{{ property.baths }}ba
			  </span>
			  <span class="flex items-center gap-1">
				
				{{ property.sqft }} sqft
			  </span>
			</div>
			
			<div class="flex flex-wrap gap-2 mt-2">
			  <span 
				v-for="(tag, index) in property.tags" 
				:key="index"
				class="px-2 py-1 text-xs rounded-full"
				:class="{
				  'bg-blue-100 text-blue-800': index === 0,
				  'bg-gray-100 text-gray-800': index !== 0
				}"
			  >
				{{ tag }}
			  </span>
			</div>
		  </div>
		</div>
	  </div>
	</div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
 
  
  const properties = ref([
	{
	  id: 1,
	  image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
	  address: '123 Main St, Anytown',
	  price: 1200,
	  beds: 2,
	  baths: 1,
	  sqft: 950,
	  tags: ['Available Now', 'Pet Friendly']
	},
	{
	  id: 2,
	  image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
	  address: '456 Oak Avenue, Springfield',
	  price: 1850,
	  beds: 3,
	  baths: 2,
	  sqft: 1450,
	  tags: ['Leased', 'Furnished']
	}
  ])
  
  const viewProperty = (id) => {
	console.log('Viewing property', id)
	// Add your navigation logic here
  }
  </script>
  
  <style scoped>
  /* Add any custom styles here */
  </style>