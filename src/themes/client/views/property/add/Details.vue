<!-- StepDetails.vue -->
<template>
    <div class="grid gap-4 md:grid-cols-2">
      <FormKit type="number" name="bedrooms" label="Bedrooms" min="0" />
      <FormKit type="number" name="bathrooms" label="Bathrooms" min="0" />
      <FormKit type="number" name="square_footage" label="Square Footage" min="0" />
      <FormKit type="number" name="latitude" label="Latitude" step="0.000001" />
      <FormKit type="number" name="longitude" label="Longitude" step="0.000001" />
    </div>
  </template>
  