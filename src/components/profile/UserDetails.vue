<template>
    <div>
      <!-- Display View -->
      <div v-if="!editMode" class="space-y-2">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-800">User Details</h2>
          <button @click="editMode = true" class="text-sm text-blue-500 font-semibold">Edit</button>
        </div>
        <p class="text-sm text-gray-700">Name: {{ user.name }}</p>
        <p class="text-sm text-gray-700">Email: {{ user.email }}</p>
        <p class="text-sm text-gray-700">Phone: {{ user.phone }}</p>
      </div>
  
      <!-- Edit View -->
      <FormKit
        v-else
        type="form"
        :actions="false"
        @submit="submitForm"
        :value="user"
      >
        <FormKit type="text" name="name" label="Name" validation="required" />
        <FormKit type="email" name="email" label="Email" validation="required|email" />
        <FormKit type="tel" name="phone" label="Phone Number" validation="required" />
  
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" @click="editMode = false" class="text-sm text-gray-500">Cancel</button>
          <FormKit type="submit" label="Save" />
        </div>
      </FormKit>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { FormKit } from '@formkit/vue'
  
  // Mock user data for now
  const user = ref({
    name: 'Shanmugakani Vignesh',
    email: 'vignesh@example.com',
    phone: '+91 9876543210'
  })
  
  const editMode = ref(false)
  
  function submitForm(updated) {
    user.value = { ...updated }
    editMode.value = false
  }
  </script>
  