<template>
  <div 
    class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
    @click="$emit('click')"
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
          <HomeModernIcon class="h-4 w-4" />
          {{ property.beds }}bd
        </span>
        <span class="flex items-center gap-1">
          <BathIcon class="h-4 w-4" />
          {{ property.baths }}ba
        </span>
        <span class="flex items-center gap-1">
          <Square3Stack3DIcon class="h-4 w-4" />
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
</template>

<script setup>
import { 
  HomeModernIcon,
  BathIcon,
  Square3Stack3DIcon 
} from '@heroicons/vue/24/outline'

defineProps({
  property: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])
</script>