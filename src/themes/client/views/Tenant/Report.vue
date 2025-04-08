<template>
    <div>
      <h2 class="text-lg font-semibold mb-4">Reports</h2>
      <ul class="space-y-3">
        <li class="bg-white p-4 rounded-xl shadow text-sm">
          Rent Receipt - Mar 2024
          <p class="text-xs text-gray-500">Downloaded 2 times</p>
        </li>
        <li class="bg-white p-4 rounded-xl shadow text-sm">
          Rent Receipt - Feb 2024
          <p class="text-xs text-gray-500">Downloaded 1 time</p>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({ tenant: Object })
  </script>