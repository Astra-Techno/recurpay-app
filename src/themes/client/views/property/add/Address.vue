<!-- StepAddress.vue -->
<template>
    <div class=" gap-2 ">
      <FormKit type="text" name="address1" label="Address 1" validation="required" />
      <FormKit type="text" name="address2" label="Address 2" />
      <FormKit type="text" name="city" label="City" validation="required" />
      <FormKit type="text" name="state" label="State" validation="required" />
      <FormKit type="text" name="postal_code" label="Postal Code" validation="required" />
      <FormKit
        type="select"
        name="country"
        label="Country"
        :options="[
            { label: 'India', value: 3 },
          { label: 'Australia', value: 1 },
          { label: 'USA', value: 2 },
          
        ]"
        validation="required"
      />
    </div>
  </template>
  