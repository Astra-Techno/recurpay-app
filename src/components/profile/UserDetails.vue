<template>
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
          👤 User Details
        </h2>
        <button @click="editMode = true" class="text-sm text-blue-500 font-semibold">
          Edit All
        </button>
      </div>
  
      <!-- Display View -->
      <div v-if="!editMode" class="space-y-3">
        <div v-for="item in fields" :key="item.name" class="bg-white shadow rounded-lg p-4 flex items-center gap-4">
          <div class="text-xl">{{ item.icon }}</div>
          <div class="flex-1">
            <p class="text-sm text-gray-500 font-medium">{{ item.label }}</p>
            <p class="text-base text-gray-800 font-semibold">{{ user[item.name] }}</p>
          </div>
        </div>
      </div>
  
      <!-- Edit View -->
      <FormKit v-else type="form" :value="user" :actions="false" @submit="submitForm" class="space-y-4">
        <FormKit type="text" name="name" label="Name" validation="required" />
        <FormKit type="email" name="email" label="Email" validation="required|email" />
        <FormKit type="tel" name="phone" label="Phone Number" validation="required" />
  
        <div class="flex justify-end gap-2 mt-2">
          <button type="button" @click="editMode = false" class="text-sm text-gray-500">Cancel</button>
          <FormKit type="submit" label="Save" />
        </div>
      </FormKit>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { FormKit } from '@formkit/vue'
  
  const user = ref({
    name: 'Shanmugakani Vignesh',
    email: 'vignesh@example.com',
    phone: '+91 9876543210'
  })
  
  const editMode = ref(false)
  
  const fields = [
    { name: 'name', label: 'Name', icon: '🧑' },
    { name: 'email', label: 'Email', icon: '📧' },
    { name: 'phone', label: 'Phone', icon: '📞' }
  ]
  
  function submitForm(updated) {
    user.value = { ...updated }
    editMode.value = false
  }
  </script>
  