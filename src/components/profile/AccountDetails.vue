<template>
    <div class="bg-white p-4 rounded shadow space-y-4">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-800">Saved Payment Methods</h2>
        <button @click="addNew" class="text-sm text-blue-500 font-semibold">+ Add</button>
      </div>
  
      <!-- Payment Methods List -->
      <div v-if="methods.length" class="space-y-4">
        <div
          v-for="(method, index) in methods"
          :key="method.id || index"
          class="p-4 border rounded-md flex justify-between items-center bg-gray-50"
        >
          <div>
            <p class="text-sm font-semibold">{{ method.type }}</p>
            <p class="text-xs text-gray-500">**** **** **** {{ method.last4 }}</p>
          </div>
          <div class="flex gap-2">
            <button @click="editMethod(index)" class="text-xs text-blue-500">Edit</button>
            <button @click="removeMethod(index)" class="text-xs text-red-500">Delete</button>
          </div>
        </div>
      </div>
      <p v-else class="text-sm text-gray-400">No payment methods added yet.</p>
  
      <!-- Edit/Add Form -->
      <FormKit
        v-if="editingIndex !== null"
        type="form"
        :actions="false"
        @submit="submitMethod"
        :value="editingData"
      >
        <FormKit type="select" name="type" label="Payment Type" :options="typeOptions" />
        <FormKit type="text" name="last4" label="Last 4 Digits" validation="required|length:4" />
  
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" @click="cancelEdit" class="text-xs px-3 py-1 rounded bg-gray-200">Cancel</button>
          <FormKit type="submit" label="Save" />
        </div>
      </FormKit>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const methods = ref([
    { type: 'Credit Card', last4: '4242' },
    { type: 'UPI', last4: '9911' },
  ])
  
  const editingIndex = ref(null)
  const editingData = ref({})
  
  const typeOptions = [
    { label: 'Credit Card', value: 'Credit Card' },
    { label: 'Debit Card', value: 'Debit Card' },
    { label: 'UPI', value: 'UPI' },
    { label: 'Bank Transfer', value: 'Bank Transfer' },
  ]
  
  function addNew() {
    editingIndex.value = methods.value.length
    editingData.value = { type: '', last4: '' }
  }
  
  function editMethod(index) {
    editingIndex.value = index
    editingData.value = { ...methods.value[index] }
  }
  
  function removeMethod(index) {
    methods.value.splice(index, 1)
    if (editingIndex.value === index) editingIndex.value = null
  }
  
  function submitMethod(data) {
    if (editingIndex.value !== null) {
      methods.value[editingIndex.value] = data
      editingIndex.value = null
    }
  }
  
  function cancelEdit() {
    editingIndex.value = null
  }
  </script>
  