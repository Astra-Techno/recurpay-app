<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">

        👤 User Details
      </h2>
      <span v-if="!editMode" @click="editMode = true"
        class=" text-blue-500 cursor-pointer font-semibold flex items-center gap-1">
        ✏️
      </span>
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
    <FormKit v-else type="form" v-model="editableUser" :actions="false" @submit="submitForm" class="space-y-4">
      <FormKit type="text" name="name" label="Name" validation="required" />
      <FormKit type="email" name="email" label="Email" validation="required|email" />
      <FormKit type="mask" name="phone" mask="🇮🇳 +91 ##### #####" label="Phone" help="Please enter a phone number"
        validation="required" />

      <div class="flex flex-col sm:flex-row gap-2 mt-2">
        <FormKit type="submit" label="Save" outer-class="w-full" />
      </div>

    </FormKit>
  </div>
</template>


<script setup>
import { ref, watch, reactive } from 'vue'
import { FormKit } from '@formkit/vue'
import useApiRequest from '@/composables/request';
import Signal from '@/composables/signal';
import { useRouter } from "vue-router";

const props = defineProps({
  user: { type: Object, required: true }
})

const editMode = ref(false)
const request = useApiRequest();
const router = useRouter();
// Create a reactive copy of user for editing
const editableUser = ref({ ...props.user })

// Watch for external changes to the user prop
watch(() => props.user, (newVal) => {
  editableUser.value = { ...newVal }
}, { deep: true })

const fields = [
  { name: 'name', label: 'Name', icon: '🧑' },
  { name: 'email', label: 'Email', icon: '📧' },
  { name: 'phone', label: 'Phone', icon: '📞' }
]

const submitForm = async (updated) => {
  // You would emit this data or call an API in real apps
  console.log('Updated user:', updated)
  // Call API to update user details
  const response = await request.post('task/User/save', updated);
  if (response.error) {
    Signal.error(response.message);
    return;
  }

  Signal.success('User details updated successfully!')


 window.location.href = '/settings'
}

function cancelEdit() {
  editableUser.value = { ...props.user }
  editMode.value = false
}
</script>
