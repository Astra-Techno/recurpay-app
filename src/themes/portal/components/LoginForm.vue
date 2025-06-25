<template>
  <FormKit
    type="form"
    :actions="false"
    v-model="localCredentials"
    @submit="loginWithPassword"
  >
    <FormKit
      type="text"
      name="email"
      label="Email or Phone"
      placeholder="Enter your email or phone number"
      validation="required|email"
      :validation-messages="{
        required: 'Email or phone number is required.',
        email: 'Please enter a valid email address.'
      }"
    />

    <FormKit
      type="password"
      name="password"
      label="Password"
      placeholder="Enter your password"
      validation="required"
    />

    <div class="text-right -mt-2 mb-4">
      <router-link to="/forgot-password" class="text-sm text-[var(--button-primary-background)] hover:underline">
        Forgot Password?
      </router-link>
    </div>

    <FormKit type="submit" :disabled="isLoading" :label="isLoading ? 'Signing In...' : 'Sign In'" />
  </FormKit>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  credentials: { type: Object, required: true }, // from v-model
  isLoading: { type: Boolean, required: true },
  loginWithPassword: { type: Function, required: true },
})

const emit = defineEmits(['update:credentials'])

const localCredentials = computed({
  get() {
    return props.credentials
  },
  set(newValue) {
    emit('update:credentials', newValue)
  },
})
</script>