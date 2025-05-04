<template>
  <div class="py-4">
    <!-- Main Page Heading -->

    <!-- Form Card -->
    <div class="bg-white px-4 rounded-2xl space-y-6">
      <div class="sticky top-0 bg-white z-10 pt-4 pb-2 shadow-sm border-b">
        <p class="text-base font-black">
          Property : {{ property.address1 || 'Property' }}
        </p>
      </div>
      <!-- Form -->
      <FormKit
        type="form"
        @submit="submitForm"
        v-model="payment"
        submit-label="Save"
        submit-class="btn-primary"
        :actions="true"
        :config="{
          classes: { form: 'space-y-4', submit: { input: 'btn btn-primary' } },
        }"
      >
        <SelectBox
          label="Select Tenant(s)"
          placeholder="Select Tenant(s)"
          name="users"
          multiple
          popover
          :data-url="`all/Tenants?select=autocomplete&property_id=${PropertyId}`"
        />

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
            min: 'Amount cannot be negative',
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
import { ref, onMounted, inject, computed, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { FormKit } from '@formkit/vue'
import useApiRequest from '@/composables/request'
import Signal from '@/composables/signal'
import SelectBox from '@/components/elements/SelectBox.vue'

const router = useRouter()
const property = ref({})
const payment = ref({})
const loading = ref(true)
const request = useApiRequest()

const QueryParams = inject('QueryParams') // Inject global params
const PropertyId = router.currentRoute.value.params.property_id || 0

onMounted(async () => {
  loading.value = false
  if (PropertyId == 0) return
  const proxy = getCurrentInstance().proxy
  const response = await request.post('entity/Property/' + PropertyId)
  if (response.error) {
    Signal.error(response.message)
    return
  }

  property.value = response.data
  payment.value.property_id = PropertyId

  proxy.$setHeader('Add Payment', 'to ' + property.value.name, true, 'IconHome')
})

const submitForm = async () => {
  const response = await request.post('task/Payment/save', payment.value)
  if (response.error) {
    Signal.error(response.message)
    return
  }

  Signal.success('Payment added successfully!')
  //router.push("/properties/"+PropertyId);

  router.go(-1) // Go back to the previous page
}

// Payment type options
const paymentTypes = [
  { label: 'Rent', value: 'rent' },
  { label: 'Electricity Bill', value: 'electricity' },
  { label: 'Water Bill', value: 'water' },
  { label: 'Maintenance Fee', value: 'maintenance' },
  { label: 'Security Deposit', value: 'deposit' },
  { label: 'Other', value: 'other' },
]

// Payment period options
const periodOptions = [
  { label: 'One-time', value: 'onetime' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Fortnightly', value: 'fortnightly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Every 6 Months', value: '6months' },
  { label: 'Yearly', value: 'yearly' },
]

// Date restrictions
const minStartDate = '2000-01-01'
const maxStartDate = new Date(
  new Date().setFullYear(new Date().getFullYear() + 5),
)
  .toISOString()
  .split('T')[0]

const handlePaymentTypeChange = value => {
  // Clear custom type when switching away from 'other'
  if (value !== 'other') {
    payment.value.other_type = ''
  }
}

const updateDueDateOptions = () => {}
</script>