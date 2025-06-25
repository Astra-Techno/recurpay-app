<template>
  <div>
    <FormKit
      type="form"
      :actions="false" 
      v-model="localCredentials"
      @submit="handleSubmit"
      #default="{ node }" 
    >
      <FormKit
        type="text"
        name="email"
        label="Email or Phone"
        placeholder="Enter your email or phone number"
        :validation-rules="{ isEmailOrPhone }"
        validation="required|isEmailOrPhone"
        :validation-messages="{
          isEmailOrPhone: 'Please enter a valid email or phone number.'
        }"
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

      <FormKit
        v-else
        type="button" 
        :disabled="isLoading"
        :label="isLoading ? 'Sending OTP...' : 'Send OTP'"
        @click="handleSendOtpClick(node)" 
      />

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

const handleSubmit = () => {
  // This handler is triggered by the `type="submit"` button.
  // At this stage, `otpSent` is true, so we call the loginWithOTP function.
  props.loginWithOTP();
}

// Custom validation rule to accept either an email or a phone number.
const isEmailOrPhone = (node) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+]?[\d\s-]{10,}$/; // Simple regex for 10+ digits
  return emailRegex.test(node.value) || phoneRegex.test(node.value);
}

// New function to handle sending OTP
const handleSendOtpClick = async (node) => {
  // Log the root form node to inspect its structure
  console.log('FormKit root node (from slot):', node);

  const emailNode = node.at('email'); // Attempt to get the email input node

  // Log the obtained emailNode to see what it is
  console.log('Email node obtained via node.at("email"):', emailNode);

  if (!emailNode) {
    console.error("FormKit Error: emailNode is null or undefined. This means the 'email' input was not found by node.at().");
    return;
  }

  // Check if the 'validate' method exists on the emailNode
  if (typeof emailNode.validate !== 'function') {
    console.error("FormKit Error: emailNode.validate is not a function. This means the object returned by node.at('email') is not a proper FormKitNode. Full emailNode object:", emailNode);
    // Do not proceed if validate is not a function
    return;
  }

  // If we reach here, emailNode.validate is a function.
  // Force validation, ensuring it runs even if the input hasn't been touched.
  await emailNode.validate(true); 

  const isValid = emailNode.context.state.valid;
  if (isValid) {
    props.sendOTP();
  }
}
</script>