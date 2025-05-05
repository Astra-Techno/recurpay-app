<template>
    <div class="text-center bg-white p-6">
      <!-- Icon -->
      <div class="text-5xl mb-4">{{ icon }}</div>
  
      <!-- Title -->
      <h2 class="text-xl font-bold text-gray-800 mb-2">{{ title }}</h2>
  
      <!-- Description -->
      <p class="text-sm text-gray-500 mb-4">{{ description }}</p>
  
      <!-- Action Button -->
      <router-link
        v-if="actionLink && actionLabel"
        :to="actionLink"
        class="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition"
      >
        {{ actionLabel }}
      </router-link>
    </div>
  </template>
  
  <script setup>
  defineProps({
    icon: String,
    title: String,
    description: String,
    actionLabel: String,
    actionLink: [String, Object],
  })
  </script>  