<template>
    <FormKit
      type="form"
      :value="modelValue"
      @input="emit('update:modelValue', $event)"
      :actions="false"
    >
      <div class="space-y-6">
        <!-- Basic Info -->
        <section>
          <h2 class="text-lg font-semibold mb-2">Basic Info</h2>
          <FormKit type="text" name="name" label="Name" validation="required" />
          <FormKit
            type="select"
            name="property_type"
            label="Property Type"
            :options="['apartment', 'house', 'condo', 'townhouse', 'commercial']"
            validation="required"
          />
          <FormKit type="textarea" name="description" label="Description" />
        </section>
  
        <!-- Address Info -->
        <section>
          <h2 class="text-lg font-semibold mb-2">Address Details</h2>
          <FormKit type="text" name="address1" label="Address Line 1" validation="required" />
          <FormKit type="text" name="address2" label="Address Line 2" />
          <FormKit type="text" name="city" label="City" validation="required" />
          <FormKit type="text" name="state" label="State" validation="required" />
          <FormKit type="text" name="postal_code" label="Postal Code" validation="required" />
          <FormKit
            type="select"
            name="country"
            label="Country"
            :options="[{ label: 'Australia', value: 1 }, { label: 'India', value: 3 }]"
            validation="required"
          />
        </section>
  
        <!-- Property Features -->
        <section>
          <h2 class="text-lg font-semibold mb-2">Property Features</h2>
          <FormKit type="number" name="bedrooms" label="Bedrooms" min="0" />
          <FormKit type="number" name="bathrooms" label="Bathrooms" min="0" />
          <FormKit type="number" name="square_footage" label="Square Footage" min="0" />
        </section>
  
        <!-- Location -->
        <section>
          <h2 class="text-lg font-semibold mb-2">Location</h2>
          <FormKit type="number" name="latitude" label="Latitude" step="0.000001" />
          <FormKit type="number" name="longitude" label="Longitude" step="0.000001" />
        </section>
      </div>
    </FormKit>
  </template>
  
  <script setup>
  const props = defineProps({
    modelValue: { type: Object, required: true }
  })
  
  const emit = defineEmits(['update:modelValue'])
  </script>
  