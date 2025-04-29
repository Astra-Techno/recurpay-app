<template>
  <div class="min-h-screen bg-white text-gray-800">

    <!-- Payment Info Card -->
    <div class="bg-white mx-4 rounded-2xl shadow p-5">
      <div class="flex justify-between items-start sticky top-0 bg-white z-10">
        <div>
          <p class="text-3xl font-bold">₹{{ formattedAmount }}</p>
          <p class="text-sm text-gray-500">{{ formattedDate(payment.due_from) }}</p>
        </div>

        <template v-if="payment.pay_status === 'due'">
          <span class="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
            Due
          </span>
        </template>

        <template v-else-if="payment.pay_status === 'pending'">
          <span class="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
            Pending
          </span>
        </template>

        <template v-else-if="payment.pay_status === 'upcoming'">
          <span class="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
            Upcoming
          </span>
        </template>

        <template v-else-if="payment.pay_status === 'paid'">
          <span class="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
            Paid
          </span>
        </template>

        <template v-else>
          <span class="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
            {{ payment.status }}
          </span>
        </template>
      </div>      
      <div class="mt-4 border-t pt-4">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            {{ payment }}
            <p class="text-sm font-black ">Ram Kumar</p>
            <p class="text-xs text-gray-500">Frequency: Monthly</p>
            <p class="text-xs text-gray-500">Next Due Date: NA</p>
          </div>
        </div>

        <div class="mt-4">
          <h3 class="text-sm font-semibold mb-1">Notes</h3>
          <p class="text-sm text-gray-700">{{payment.notes}}</p>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="grid grid-cols-2 gap-3 mt-6">
        <router-link :to="{ name: 'MarkAsPaid', params: { payment_id: 1 } }"
        v-if="payment.pay_status === 'pending'"
          >
          <button
            class="w-full py-2 bg-blue-600 text-white font-bold rounded-md font-medium  flex items-center justify-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Mark as Paid
          </button>
        </router-link>

        <button
          class="w-full py-2 bg-yellow-500 text-white font-bold rounded-md font-medium  flex items-center justify-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M22 2L11 13" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M2 22l11-11" />
          </svg>
          Send Reminder
        </button>

      </div>
    </div>
    <!-- Payment History -->
    <div class="mt-6 px-4">
      <h2 class="text-sm font-semibold mb-2">Payment History</h2>
      <div class="bg-gray-100 rounded-xl p-4 flex justify-between items-center">
        <div>
          <p class="text-sm font-medium">April Rent</p>
          <p class="text-xs text-green-600 mt-1">Paid</p>
        </div>
        <p class="text-sm font-semibold">₹15,000</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/index'
import { getCurrentInstance } from 'vue'
import useApiRequest from '@/composables/request'
import dayjs from 'dayjs'

const user = useAppStore().getUser()
const payment = ref({})
const route = useRoute()
const request = useApiRequest()

// amount animation setup
const amount = ref(0)
const targetAmount = ref(0)

const formattedAmount = computed(() => {
  return amount.value.toLocaleString('en-IN')
})

function animateAmount() {
  const startValue = amount.value
  const endValue = targetAmount.value
  const duration = 1000  // 1 second

  const startTime = performance.now()

  function update(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)

    amount.value = Math.floor(startValue + (endValue - startValue) * easeOutCubic(progress))

    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      amount.value = endValue // Ensure it finishes cleanly
    }
  }

  requestAnimationFrame(update)
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

const loadData = async (proxy) => {
  const id = route.params.id
  if (!id) return

  const res = await request.fetch(`/entity/Payment/${id}`)
  if (res.error) return

  payment.value = res.data

  if (payment.value.amount) {
    targetAmount.value = payment.value.amount
    animateAmount()  // 🎯 Only animate after fetching real amount
  }

  proxy.$setHeader(payment.value.property, 'Payment', true, 'IconHome')
}

onMounted(() => {
  loadData(getCurrentInstance().proxy)
})

const formattedDate = (date) => {
  return dayjs(date).format('MMM DD, YYYY')
}
</script>
