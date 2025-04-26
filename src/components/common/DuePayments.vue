<template>

    <div class="flex justify-between items-center py-4">
        <p class="text-sm font-semibold">Payments</p>
        <router-link :to="{ name: 'AddPayment', params: { property_id: propertyId } }">
            <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">Add Payment</button>
        </router-link>
    </div>

    <list ref="rowContents" class="w-full" tmpl="custom" :data-url="dataUrl" :sortBy="'p.id'" :sortOrder="'desc'"
        :filter-toggle="false" :messages="{ empty: 'There are no properties added!' }" :page-limit="pageLimit"
        :show-pagination="pagination" :search="false">
        <template #body="{ rows }">
            <div class="space-y-2">
                <div v-for="payment in rows" class="bg-gray-100 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <p class="text-sm font-semibold">{{ getPaymentTypeLabel(payment.type) }}</p>
                        <p class="text-xs font-semibold text-blue-600 mt-1">Due: {{ formattedDate(payment.next_due_date) }}</p>
                    </div>
                    <p class="text-sm font-semibold">{{ formatCurrency(payment.amount) }}</p>
                </div>
                <div v-if="rows.length === 0" class="text-center text-gray-500">No Payments to List.</div>
                <div v-if="rowContents?.total > 2 && pagination === false" class="text-center text-gray-500">
                    <router-link :to="{ name: 'PaymentsList', params: { property_id: propertyId } }">
                        <button class="text-xs w-full bg-blue-500 text-white px-3 py-1 rounded-full">View
                            All</button>
                    </router-link>
                </div>
            </div>
        </template>
    </list>

</template>
<script setup>
import { computed, defineProps, ref } from 'vue'
import List from '@/components/List/List.vue'
import { useAppStore } from '@/stores/index'
import dayjs from 'dayjs'


const formattedDate = (date) => {
    return dayjs(date).format('MMM DD, YYYY')
}

const user = useAppStore().getUser()
const props = defineProps({
    title: {
        type: String,
        required: true,
        default: 'Payments'

    },
    display: {
        type: String,
        default: 'dashboard',
        required: false
    },
    pagination: {
        type: Boolean,
        default: false,
        required: false
    },
    pageLimit: {
        type: Number,
        default: 2,
        required: false
    },
    propertyId: {
        type: Number,
        default: null,
        required: false
    }
})

const dataUrl = computed(() => {
    const base_url = 'list/Payments'

    if (props.propertyId) {
        return `${base_url}?property_id=${props.propertyId}`
    } else {
        return base_url+':allPayments'
    }
    
})
const paymentTypes = [
  { label: 'Rent', value: 'rent' },
  { label: 'Electricity Bill', value: 'electricity' },
  { label: 'Water Bill', value: 'water' },
  { label: 'Maintenance Fee', value: 'maintenance' },
  { label: 'Security Deposit', value: 'deposit' },
  { label: 'Other', value: 'other' }
];
function getPaymentTypeLabel(type) {
  const found = paymentTypes.find(item => item.value === type)
  return found ? found.label : type // fallback to raw type if not found
}
function formatCurrency(amount, currency = 'INR', locale = 'en-IN') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount)
}
const rowContents = ref(null)
</script>