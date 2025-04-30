<template>
    <div class="bg-white p-6 rounded-xl shadow space-y-6">
      <!-- Title -->
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-800">🔒 Update Password</h2>
        <button
          @click="editing = !editing"
          class="text-sm text-blue-500 font-semibold"
        >
          {{ editing ? 'Cancel' : 'Edit' }}
        </button>
      </div>
  
      <!-- Form -->
      <FormKit
        v-if="editing"
        type="form"
        @submit="handleSubmit"
        :actions="true"
        submit-label="Update Password"
      >
        <FormKit
          type="password"
          name="current_password"
          label="Current Password"
          validation="required"
        />
  
        <FormKit
          type="password"
          name="new_password"
          label="New Password"
          validation="required|length:6"
        />
  
        <FormKit
          type="password"
          name="confirm_password"
          label="Confirm Password"
          validation="required|confirm:new_password"
        />
      </FormKit>
  
      <!-- Readonly Mode -->
      <div v-else class="text-sm text-gray-600">
        For security, we do not display your password.
        <br />Click edit to change your password.
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { FormKit } from '@formkit/vue'
  import Signal from '@/composables/signal'
  
  const editing = ref(false)
  
  const handleSubmit = (formData) => {
    // Example logic for submission
    Signal.success('Password updated successfully!')
    editing.value = false
  }
  </script>
  
  <style scoped>
  </style>
  