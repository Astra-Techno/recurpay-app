<template>
  <div class="min-h-screen bg-gradient-to-b from-indigo-100 via-white to-white text-gray-800">
    <!-- Header -->
    <div class="px-4 py-5">
      <h1 class="text-center text-lg font-semibold text-indigo-700">Payment Detail</h1>
    </div>

    <!-- Card -->
    <div class="bg-white mx-4 rounded-2xl shadow-xl p-6 space-y-4">
      <!-- Amount & Status -->
      <div class="flex justify-between items-start">
        <div>
          <p class="text-4xl font-extrabold text-gray-900">₹{{ formattedAmount }}</p>
          <p class="text-sm text-gray-500">Due on {{ formattedDate(payment.due_from, 'MMM D') }}</p>
        </div>
        <span
          :class="[statusColors[payment.pay_status]?.bg || 'bg-gray-200', statusColors[payment.pay_status]?.text || 'text-gray-600', 'text-xs font-semibold px-3 py-1 rounded-full']">
          {{ ucfirst(payment.pay_status) }}
        </span>
      </div>

      <!-- Tenant Info -->
      <div class="flex gap-3 items-center border-t pt-4">
        <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
          </svg>
        </div>
        <div>
          <p class="font-semibold">{{ payment.PaymentUsers?.[0]?.name || 'User' }}</p>
          <p class="text-xs text-gray-500">Frequency: {{ ucfirst(payment.period) }}</p>
          <p class="text-xs text-gray-500">Next Due Date: {{ payment.next_due_date ? formatDate(payment.next_due_date, 'MMM D') : 'NA' }}</p>
        </div>
      </div>

      <!-- Notes -->
      <div>
        <p class="text-sm font-semibold text-gray-600 mb-1">Notes</p>
        <p class="text-sm text-gray-800">{{ payment.notes || 'No notes provided.' }}</p>
      </div>

      <!-- Actions -->
      <div class="grid grid-cols-2 gap-3">
        <button
          v-if="payment.pay_status === 'pending'"
          class="flex items-center justify-center gap-2 py-2 rounded-xl border border-blue-500 text-blue-600 font-semibold hover:bg-blue-50">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Mark as Paid
        </button>

        <button
          class="flex items-center justify-center gap-2 py-2 rounded-xl border border-blue-500 text-blue-600 font-semibold hover:bg-blue-50">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M22 2L11 13" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M2 22l11-11" />
          </svg>
          Send Reminder
        </button>

        <button
          class="flex items-center justify-center gap-2 py-2 rounded-xl border border-gray-400 text-gray-600 font-semibold hover:bg-gray-100">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6-6m2 2l2 2L11 21H5v-6L17 7z" />
          </svg>
          Edit
        </button>

        <button
          class="flex items-center justify-center gap-2 py-2 rounded-xl border border-gray-400 text-gray-600 font-semibold hover:bg-gray-100">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6" />
          </svg>
          Delete
        </button>
      </div>
    </div>

    <!-- Payment History -->
    <div class="px-4 mt-6">
      <h2 class="text-sm font-bold text-gray-700 mb-2">Payment History</h2>
      <div class="bg-white rounded-2xl shadow p-4">
        <div class="flex justify-between items-center text-sm text-gray-800">
          <div>
            <p>April Rent</p>
            <p class="text-green-600 text-xs">Paid</p>
          </div>
          <p class="font-bold">₹15,000</p>
        </div>
      </div>
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