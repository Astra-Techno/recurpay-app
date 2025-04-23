<template>
    <div class="py-4">
      <!-- Main Page Heading -->
      <div class="mb-6 ">
        <div class="flex items-center  gap-2">
          <span class="inline-block bg-blue-100 text-blue-600 p-2 rounded-full">
            🏠
          </span>
          <h2 class="text-3xl font-black italic">Edit Payment</h2>
        </div>
        <p class="text-gray-500 text-sm mt-1">to {{ payment.property || 'Property' }}</p>
      </div>
  
      <!-- Form Card -->
      <div class="bg-white p-6 rounded-2xl shadow-md space-y-6">
        <!-- Section Title -->
        <div class="space-y-1 ">
          <h1 class="text-2xl font-black italic ">Let’s Edit Payment </h1>
          <p class="text-gray-500 text-sm">Provide the basic details to list this property under your landlord profile.
          </p>
        </div>
  
        <!-- Form -->
        <FormKit 
            type="form" 
            @submit="submitForm" 
            v-model="payment" 
            submit-label="Save and Continue" 
            submit-class="btn-primary"
            :actions="true" 
            :config="{ classes: { form: 'space-y-4', submit: { input: 'btn btn-primary' } }}"
        >

            <SelectBox label="Select Tenant(s)"  placeholder="Select Tenant(s)" v-model="payment.users" multiple popover
            :data-url="`all/Tenants?select=autocomplete&property_id=${payment.property_id}`"  />

            <!-- Payment Type Dropdown -->
            <FormKit
            type="select"
            name="type"
            label="Payment For"
            :options="paymentTypes"
            validation="required"
            @change="handlePaymentTypeChange"
            />

            <!-- Custom Payment Name (shown only when 'other' is selected) -->
            <FormKit
            v-if="payment.type === 'other'"
            type="text"
            name="other_type"
            label="Please specify payment type"
            validation="required"
            placeholder="e.g. Internet Bill, Parking Fee, etc."
            />

            <!-- Amount Field -->
            <FormKit
            type="currency"
            name="amount"
            label="Amount"
            currency="INR"
            display-locale="en-IN"
            help="Please enter valid amount"
            validation="required|min:0"
            :validation-messages="{
                min: 'Amount cannot be negative'
            }"
            />

            <!-- Payment Period Dropdown -->
            <FormKit
            type="select"
            name="period"
            label="Payment Period"
            :options="periodOptions"
            validation="required"
            @change="updateDueDateOptions"
            />

            <!-- Start Date Field -->
            <FormKit
            type="date"
            name="due_from"
            label="Due Collect From / On"
            validation="required"
            :min="minStartDate"
            :max="maxStartDate"
            @change="updateDueDateOptions"
            />

            <!-- Refundable Checkbox (shown only for deposits) -->
            <FormKit
            v-if="payment.type === 'deposit'"
            type="checkbox"
            name="is_refundable"
            label="This payment is refundable"
            :value="true"
            />

            <!-- Additional Notes -->
            <FormKit
            type="textarea"
            name="notes"
            label="Additional Notes"
            placeholder="Any special instructions about this payment..."
            rows="3"
            />
        </FormKit>
    </div>
  </div>
  </template>
  
  
  
  <script setup>
  import { ref, onMounted, inject } from "vue";
  import { useRouter } from "vue-router";
  import { FormKit } from "@formkit/vue";
  import useApiRequest from '@/composables/request'
  import Signal from '@/composables/signal'
  import SelectBox from '@/components/elements/SelectBox.vue'
  
  import { useMeta } from '@/composables/use-meta';
  useMeta({ title: 'Add Payment' })
  
  const router = useRouter();
  const loading = ref(true);
  // Country codes for phone input
  const countryCodes = ref([
    { label: '🇮🇳 +91', value: '+91' },
    { label: '🇺🇸 +1', value: '+1' },
    { label: '🇬🇧 +44', value: '+44' },
    // Add more country codes as needed
  ]);
  
  const request = useApiRequest();
  
  const QueryParams = inject('QueryParams'); // Inject global params
  const PaymentId = QueryParams.value[0] ?? 0;
  const payment = ref({});
  
  onMounted(async () => {
    loading.value = false;
    if (PaymentId == 0)
      return;
  
    const response = await request.post('entity/Payment/' + PaymentId + '?attrib=UserIds' )
    if (response.error) {
      Signal.error(response.message)
      return;
    }
  
    payment.value = response.data;
    payment.value.users = payment.value.UserIds;

    console.log('PaymentUserIds', payment.value)
  });
  
  const submitForm = async () => {
    const response = await request.post('task/Payment/save', payment.value)
    if (response.error) {
      Signal.error(response.message);
      return;
    }
  
    Signal.success('Payment details saved successfully!');
    router.push("/payment/view/" + response.data.id);
  };

  // Payment type options
const paymentTypes = [
  { label: 'Rent', value: 'rent' },
  { label: 'Electricity Bill', value: 'electricity' },
  { label: 'Water Bill', value: 'water' },
  { label: 'Maintenance Fee', value: 'maintenance' },
  { label: 'Security Deposit', value: 'deposit' },
  { label: 'Other', value: 'other' }
];

// Payment period options
const periodOptions = [
  { label: 'One-time', value: 'onetime' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Fortnightly', value: 'fortnightly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Every 6 Months', value: '6months' },
  { label: 'Yearly', value: 'yearly' }
];

// Date restrictions
const minStartDate = '2000-01-01';
const maxStartDate = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().split('T')[0];

const handlePaymentTypeChange = (value) => {
  
  // Clear custom type when switching away from 'other'
  if (value !== 'other') {
    payment.value.other_type = '';
  }
};

const updateDueDateOptions = () => {
  
};
  </script>