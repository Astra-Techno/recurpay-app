<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
//import { getProperty, updateProperty } from "@/api/properties"; // API calls
import { FormKit } from "@formkit/vue";

const route = useRoute();
const router = useRouter();
const property = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    //const { data } = await getProperty(route.params.id); // Fetch property data
    //property.value = data;
  } catch (error) {
    console.error("Error loading property:", error);
  } finally {
    loading.value = false;
  }
});

const submitForm = async () => {
  try {
    //await updateProperty(property.value.id, property.value);
    alert("Property updated successfully!");
    router.push("/properties");
  } catch (error) {
    console.error("Update failed:", error);
    alert("Failed to update property.");
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-semibold mb-4">Edit Property</h1>

    <FormKit
      v-if="!loading"
      type="form"
      @submit="submitForm"
      v-model="property"
    >
      <FormKit type="text" name="name" label="Property Name" validation="required" />
      <FormKit type="text" name="address1" label="Address Line 1" validation="required" />
      <FormKit type="text" name="address2" label="Address Line 2" />
      <FormKit type="text" name="city" label="City" validation="required" />
      <FormKit type="text" name="state" label="State" validation="required" />
      <FormKit type="text" name="postal_code" label="Postal Code" validation="required" />
      
      <FormKit
        type="select"
        name="country"
        label="Country"
        :options="[{ value: 1, label: 'India' }, { value: 2, label: 'USA' }]"
        validation="required"
      />

      <FormKit
        type="select"
        name="property_type"
        label="Property Type"
        :options="['apartment', 'house', 'condo', 'townhouse', 'commercial']"
        validation="required"
      />

      <FormKit type="number" name="bedrooms" label="Bedrooms" />
      <FormKit type="number" name="bathrooms" label="Bathrooms" />
      <FormKit type="number" name="square_footage" label="Square Footage" />

      <FormKit type="textarea" name="description" label="Description" />

      <FormKit type="number" name="latitude" label="Latitude" step="0.00000001" />
      <FormKit type="number" name="longitude" label="Longitude" step="0.00000001" />

      <FormKit type="submit" label="Update Property" />
    </FormKit>
  </div>
</template>

<style scoped>
/* Tailwind styles are applied */
</style>
