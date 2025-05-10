<template>
  <div class="min-h-screen p-4 text-gray-900">
    <!-- Payment Card -->
    <div class="bg-white mx-auto max-w-2xl rounded-2xl shadow-lg p-6 space-y-6">

      <!-- Header: Amount and Status -->
      <div class="flex justify-between items-start">
        <div>
          <p class="text-4xl font-extrabold text-black">₹{{ formattedAmount }}</p>
          <p class="text-sm text-slate-600">Due on {{ formattedDate(payment.due_from, 'MMM D') }}</p>
        </div>
        <span
          :class="[statusColors[payment.pay_status]?.bg || 'bg-gray-200', statusColors[payment.pay_status]?.text || '', 'text-xs font-semibold px-3 py-1 rounded-full']">
          {{ ucfirst(payment.pay_status) }}
        </span>
      </div>

      <!-- Property Info -->
      <div>
        <p class="text-xs text-slate-600">Property</p>
        <p class="text-base font-semibold text-gray-900">{{ payment.property || 'NA' }}</p>
      </div>

      <!-- Tenant Info -->
      <div class="flex items-start gap-4 border-t pt-2">
        <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-gray-900">
            <router-link :to="{ name: 'TenantDetail', params: { id: payment.user_id } }">{{ payment.user || 'Tenant'
            }}</router-link>
          </p>
          <p class="text-xs text-slate-600">Frequency: {{ ucfirst(payment.period) }}</p>
          <p class="text-xs text-slate-600">Next Due: {{ payment.next_due_date ? formattedDate(payment.next_due_date) :
            'NA' }}</p>
        </div>
      </div>

      <!-- Notes -->
      <div>
        <p class="text-sm font-semibold text-blue-700 mb-1">Notes</p>
        <p class="text-sm text-gray-800">{{ payment.notes || 'No notes available for this payment.' }}</p>
      </div>

      <!-- Actions -->
      <div class="grid grid-cols-2 gap-3 pt-2">

        <!-- Paid → Show 'Mark as Paid' -->
        <router-link v-if="payment.pay_status === 'paid'" :to="`/mark-as-paid/index/${payment.transaction_id}`">
          <button
            class="w-full flex justify-center items-center gap-2 text-sm font-semibold bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition">
            ✔️ Mark as Paid
          </button>
        </router-link>

        <!-- Pending → Show 'Send Reminder' -->
        <router-link v-else-if="payment.pay_status === 'pending'"
          :to="{ name: 'SendReminder', params: { payment_id: payment.id } }">
          <button
            class="w-full flex justify-center items-center gap-2 text-sm font-semibold bg-yellow-500 text-white py-2 rounded-full hover:bg-yellow-600 transition">
            📩 Send Reminder
          </button>
        </router-link>

        <!-- Upcoming → Show Edit & Delete -->
        <template v-else-if="payment.pay_status === 'upcoming'">
          <router-link :to="{ name: 'EditPayment', params: { payment_id: payment.id } }">
            <button
              class="w-full flex justify-center items-center gap-2 text-sm font-semibold bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition">
              ✏️ Edit
            </button>
          </router-link>

          <router-link :to="{ name: 'DeletePayment', params: { payment_id: payment.id } }">
            <button
              class="w-full flex justify-center items-center gap-2 text-sm font-semibold bg-red-500 text-white py-2 rounded-full hover:bg-red-600 transition">
              🗑️ Delete
            </button>
          </router-link>
        </template>

      </div>
    </div>

    <!-- Payment History -->
    <div class="mt-8 max-w-2xl mx-auto">
      <Transactions title="Payment History" page-limit="2" display="detail-list" :property-id="payment.property_id" />
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref, onMounted, computed, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/index'
import useApiRequest from '@/composables/request'
import { formatDate, ucfirst, currency } from '@/composables/helper'
import dayjs from 'dayjs'

const user = useAppStore().getUser()
const payment = ref({})
const tab = ref<'notes' | 'tenants' | 'transactions'>('notes')
const route = useRoute()
const request = useApiRequest()

const amount = ref(0)
const targetAmount = ref(0)

const formattedAmount = computed(() => amount.value.toLocaleString('en-IN'))

const statusColors = {
  due: { bg: 'bg-red-100', text: 'text-red-600' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  upcoming: { bg: 'bg-blue-100', text: 'text-blue-700' },
  paid: { bg: 'bg-green-100', text: 'text-green-700' },
}

function animateAmount() {
  const start = amount.value
  const end = targetAmount.value
  const duration = 1000
  const startTime = performance.now()

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3)
  }

  function update(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    amount.value = Math.floor(start + (end - start) * easeOutCubic(progress))
    if (progress < 1) requestAnimationFrame(update)
    else amount.value = end
  }

  requestAnimationFrame(update)
}

const loadData = async (proxy) => {
  const id = route.params.id
  if (!id) return
  const res = await request.fetch(`/entity/Payment/${id}?group=Detail`)
  if (res.error) return
  payment.value = res.data
  if (payment.value.amount) {
    targetAmount.value = payment.value.amount
    animateAmount()
  }
  proxy.$setHeader(`${ucfirst(payment.value.type)} Payment`, '', true, 'IconHome')
}

onMounted(() => {
  loadData(getCurrentInstance().proxy)
})

const formattedDate = (date) => dayjs(date).format('MMM DD, YYYY')
</script>