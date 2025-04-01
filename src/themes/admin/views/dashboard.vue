<template>
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    <!-- Tile 1 -->
    <router-link to="/page1" class="flex items-center bg-gray-100 p-6 rounded-lg shadow-lg hover:bg-gray-200">
      <i class="fas fa-home text-xl text-blue-500 mr-4"></i>
      <span class="text-lg font-semibold">Page 1</span>
    </router-link>

    <!-- Tile 2 -->
    <router-link to="/page2" class="flex items-center bg-gray-100 p-6 rounded-lg shadow-lg hover:bg-gray-200">
      <i class="fas fa-cogs text-xl text-blue-500 mr-4"></i>
      <span class="text-lg font-semibold">Page 2</span>
    </router-link>

    <!-- Tile 3 -->
    <router-link to="/page3" class="flex items-center bg-gray-100 p-6 rounded-lg shadow-lg hover:bg-gray-200">
      <i class="fas fa-chart-line text-xl text-blue-500 mr-4"></i>
      <span class="text-lg font-semibold">Page 3</span>
    </router-link>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/stores/index'
import { useMeta } from '@/composables/use-meta'

useMeta({ title: 'Dashboard' })
const store = useAppStore()
</script>
