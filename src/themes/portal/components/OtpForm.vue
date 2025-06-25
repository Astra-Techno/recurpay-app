<template>
  <div>
    <FormKit
      type="form"
      :actions="false"
      v-model="localCredentials"
      @submit="otpSent ? loginWithOTP() : sendOTP()"
    >
      <FormKit
        type="text"
        name="email"
        label="Email or Phone"
        placeholder="Enter your email or phone number"
        validation="required|email"
        :disabled="otpSent"
      />

      <div v-if="otpSent" class="space-y-4">
        <FormKit
          type="otp"
          name="otp"
          label="Enter OTP"
          validation="required|length:6"
          :validation-messages="{
            required: 'An OTP is required to continue.',
            length: 'Your OTP must be 6 digits long.'
          }"
        />
        <FormKit type="submit" :disabled="isLoading" :label="isLoading ? 'Verifying...' : 'Sign In'" />
      </div>

      <FormKit v-else type="submit" :disabled="isLoading" :label="isLoading ? 'Sending OTP...' : 'Send OTP'" />
    </FormKit>

    <div v-if="otpSent" class="resend-otp mt-4">
      <span v-if="resendTimer > 0">
        Resend OTP in {{ resendTimer }}s
      </span>
      <span v-else>
        Didn't receive OTP?
        <button
          type="button"
          @click="sendOTP"
          :disabled="isLoading"
          class="resend-link"
        >
          {{ isLoading ? 'Resending...' : 'Resend' }}
        </button>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  credentials: { type: Object, required: true }, // from v-model
  isLoading: { type: Boolean, required: true },
  otpSent: { type: Boolean, required: true },
  resendTimer: { type: Number, required: true },
  sendOTP: { type: Function, required: true },
  loginWithOTP: { type: Function, required: true },
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