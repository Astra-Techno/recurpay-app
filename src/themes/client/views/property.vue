<template>
	<FormKit
	  type="form"
	  v-model="formData"
	  @submit="handleSubmit"
	  :actions="false"
	  #default="{ value }"
	>
	  <h2 class="text-2xl font-bold mb-6">{{ propertyId ? 'Edit' : 'Add' }} Property</h2>
	  
	  <!-- Basic Information Section -->
	  <div class="mb-8 p-6 border rounded-lg">
		<h3 class="text-lg font-semibold mb-4">Basic Information</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		  <FormKit
			type="text"
			name="name"
			label="Property Name"
			validation="required"
			placeholder="e.g. Seaside Villa"
		  />
		  
		  <FormKit
			type="select"
			name="property_type"
			label="Property Type"
			validation="required"
			:options="propertyTypes"
		  />
		</div>
	  </div>
	  
	  <!-- Address Section -->
	  <div class="mb-8 p-6 border rounded-lg">
		<h3 class="text-lg font-semibold mb-4">Address</h3>
		<div class="grid grid-cols-1 gap-6">
		  <FormKit
			type="text"
			name="address1"
			label="Address Line 1"
			validation="required"
			placeholder="Street address"
		  />
		  
		  <FormKit
			type="text"
			name="address2"
			label="Address Line 2 (Optional)"
			placeholder="Apt, suite, unit, etc."
		  />
		  
		  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<FormKit
			  type="text"
			  name="city"
			  label="City"
			  validation="required"
			/>
			
			<FormKit
			  type="text"
			  name="state"
			  label="State/Province"
			  validation="required"
			/>
			
			<FormKit
			  type="text"
			  name="postal_code"
			  label="Postal Code"
			  validation="required"
			/>
		  </div>
		  
		  <FormKit
			type="select"
			name="country"
			label="Country"
			validation="required"
			:options="countries"
		  />
		</div>
	  </div>
	  
	  <!-- Location Section -->
	  <div class="mb-8 p-6 border rounded-lg">
		<h3 class="text-lg font-semibold mb-4">Location</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		  <FormKit
			type="text"
			name="latitude"
			label="Latitude"
			validation="required|number:-90,90"
			placeholder="e.g. 28.6139"
			help="Decimal coordinates between -90 and 90"
		  />
		  
		  <FormKit
			type="text"
			name="longitude"
			label="Longitude"
			validation="required|number:-180,180"
			placeholder="e.g. 77.2090"
			help="Decimal coordinates between -180 and 180"
		  />
		  
		  <div class="md:col-span-2">
			<div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
			  <p class="text-gray-500">Map Preview Would Appear Here</p>
			</div>
		  </div>
		</div>
	  </div>
	  
	  <!-- Property Details Section -->
	  <div class="mb-8 p-6 border rounded-lg">
		<h3 class="text-lg font-semibold mb-4">Property Details</h3>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		  <FormKit
			type="number"
			name="bedrooms"
			label="Bedrooms"
			min="0"
			step="1"
			validation="required|min:0"
		  />
		  
		  <FormKit
			type="number"
			name="bathrooms"
			label="Bathrooms"
			min="0"
			step="0.5"
			validation="required|min:0"
		  />
		  
		  <FormKit
			type="number"
			name="square_footage"
			label="Square Footage"
			min="0"
			validation="required|min:0"
			suffix="sq ft"
		  />
		</div>
	  </div>
	  
	  <!-- Description Section -->
	  <div class="mb-8 p-6 border rounded-lg">
		<h3 class="text-lg font-semibold mb-4">Description</h3>
		<FormKit
		  type="textarea"
		  name="description"
		  label="Property Description"
		  rows="5"
		  placeholder="Describe the property features, amenities, etc."
		/>
	  </div>
	  
	  <!-- Form Actions -->
	  <div class="flex justify-end gap-4 mt-6">
		<button
		  type="button"
		  @click="$emit('cancel')"
		  class="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
		>
		  Cancel
		</button>
		
		<FormKit
		  type="submit"
		  :label="propertyId ? 'Update Property' : 'Add Property'"
		  input-class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
		/>
	  </div>
	</FormKit>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  const props = defineProps({
	propertyId: {
	  type: [Number, String],
	  default: null
	}
  });
  
  const emit = defineEmits(['submit', 'cancel']);
  
  // Form data structure
  const formData = ref({
	name: '',
	property_type: 'apartment',
	address1: '',
	address2: '',
	city: '',
	state: '',
	postal_code: '',
	country: 1, // Default to India
	latitude: null,
	longitude: null,
	bedrooms: null,
	bathrooms: null,
	square_footage: null,
	description: ''
  });
  
  // Options for select inputs
  const propertyTypes = ref([
	{ label: 'Apartment', value: 'apartment' },
	{ label: 'House', value: 'house' },
	{ label: 'Condo', value: 'condo' },
	{ label: 'Townhouse', value: 'townhouse' },
	{ label: 'Commercial', value: 'commercial' }
  ]);
  
  const countries = ref([
	{ label: 'India', value: 1 },
	{ label: 'United States', value: 2 },
	{ label: 'United Kingdom', value: 3 },
	// Add more countries as needed
  ]);
  
  // Load property data if editing
  onMounted(async () => {
	if (props.propertyId) {
	  try {
		// Replace with your API call
		const response = await fetch(`/api/properties/${props.propertyId}`);
		const data = await response.json();
		formData.value = data;
	  } catch (error) {
		console.error('Error loading property:', error);
	  }
	}
  });
  
  // Handle form submission
  const handleSubmit = async (formData) => {
	try {
	  const url = props.propertyId 
		? `/api/properties/${props.propertyId}`
		: '/api/properties';
		
	  const method = props.propertyId ? 'PUT' : 'POST';
	  
	  const response = await fetch(url, {
		method,
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': `Bearer ${localStorage.getItem('token')}`
		},
		body: JSON.stringify(formData)
	  });
	  
	  if (response.ok) {
		emit('submit', await response.json());
	  } else {
		throw new Error('Failed to save property');
	  }
	} catch (error) {
	  console.error('Error saving property:', error);
	  // You might want to show an error message to the user
	}
  };
  </script>
  
  <style>
  /* Add any custom form styling here */
  .formkit-label {
	@apply block text-sm font-medium text-gray-700 mb-1;
  }
  .formkit-input {
	@apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500;
  }
  .formkit-message {
	@apply mt-1 text-sm text-red-600;
  }
  </style>