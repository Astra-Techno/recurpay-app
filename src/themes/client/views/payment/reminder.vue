<template>
    <div class="min-h-screen bg-gray-50 p-5">

        <div class="max-w-md mx-auto space-y-6">
            <!-- Skeleton Loader -->
            <div v-if="loading" class="space-y-6 animate-pulse">
                <div class="rounded-2xl bg-white border border-blue-100 p-5 space-y-4">
                    <div class="h-3 w-32 bg-gray-200 rounded"></div>
                    <div class="h-8 w-24 bg-gray-300 rounded mx-auto"></div>
                    <div class="h-4 w-20 bg-orange-200 rounded mx-auto mt-2"></div>
                    <div class="border-t border-dashed my-4"></div>
                    <div class="flex justify-between">
                        <div class="space-y-2">
                            <div class="h-3 w-20 bg-gray-200 rounded"></div>
                            <div class="h-3 w-16 bg-gray-100 rounded"></div>
                        </div>
                        <div class="h-3 w-28 bg-gray-200 rounded self-end"></div>
                    </div>
                </div>
                <div class="h-24 bg-white border border-gray-200 rounded-2xl"></div>
                <div class="h-12 bg-yellow-200 rounded-xl"></div>
            </div>

            <!-- Actual Content -->
            <template v-else>
                <!-- Summary Card -->
                <div
                    class="relative rounded-2xl p-5  shadow-inner border shadow-xl overflow-hidden animate-fadeIn space-y-4">
                    <!-- Amount -->
                    <div class="text-center space-y-1">
                        <p class="text-xs text-gray-500">Amount to be paid</p>
                        <p class="text-3xl font-extrabold text-gray-900">₹{{ animatedAmount.toLocaleString('en-IN') }}
                        </p>
                    </div>

                    <!-- Due Label Badge -->
                    <div class="flex justify-center">
                        <span
                            class="text-xs font-semibold bg-orange-100 text-orange-700 px-3 py-1 rounded-full shadow-sm">
                            {{ dueLabel }}
                        </span>
                    </div>

                    <!-- Type + Frequency -->
                    <div class="flex justify-center flex-wrap gap-2 mt-2">
                        <span
                            class="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-violet-800 bg-violet-100 rounded-full shadow-sm ring-1 ring-violet-200"
                            :title="typeTooltip">
                            📌 <span class="capitalize">{{ payment.type || 'Payment' }}</span>
                        </span>
                        <span
                            class="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-slate-800 bg-slate-100 rounded-full shadow-sm ring-1 ring-slate-200"
                            :title="periodTooltip">
                            🔁 <span class="capitalize">{{ payment.period || 'N/A' }}</span>
                        </span>
                    </div>

                    <div class="border-t border-dashed"></div>

                    <!-- Property -->
                    <div class="text-center">
                        <p class="text-xs text-gray-500">Property</p>
                        <p class="text-sm font-semibold text-gray-800 break-words">{{ payment.property || 'N/A' }}</p>
                    </div>
                </div>

                <!-- Reminder Form -->
                <FormKit type="form" :actions="false" @submit="sendReminder" :value="{ note }"
                    class="space-y-4 animate-fadeIn">
                    <FormKit type="textarea" name="note" label="Message"
                        placeholder="Optional message to include with this reminder" outer-class="space-y-2"
                        :disabled="submitting" />

                    <FormKit type="submit" :disabled="submitting"
                        input-class="w-full !border-none bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 active:scale-95 transition text-black text-sm font-semibold py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
                        label="Send Reminder">
                        <template #prefix v-if="submitting">
                            <svg class="animate-spin h-4 w-4 mr-1 text-black" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        </template>
                        <template #suffix>
                            📤
                        </template>
                    </FormKit>
                </FormKit>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useApiRequest from '@/composables/request'
import Signal from '@/composables/signal'

const route = useRoute()
const router = useRouter()
const request = useApiRequest()

const note = ref('')
const payment = ref({})
const loading = ref(true)
const submitting = ref(false)

const animatedAmount = ref(0)
const animatedDays = ref(0)

// Poetic Due Date
const dueLabel = computed(() => {
    const days = payment.value.due_in_days
    if (typeof days !== 'number') return 'Date unknown'
    if (days === 0) return 'Due Today'
    if (days < 0) return `${Math.abs(days)} day${Math.abs(days) > 1 ? 's' : ''} ago`
    return `in ${days} day${days > 1 ? 's' : ''}`
})

onMounted(() => {
    loadData(getCurrentInstance().proxy)
})

const loadData = async (proxy) => {
    const paymentId = route.params.payment_id
    const response = await request.post(`item/Payments?id=${paymentId}`)
    if (!response.error) {
        payment.value = { ...response.data }
    }
    loading.value = false
    proxy?.$setHeader?.('Send Reminder', 'to ' + payment.value.user, true, 'IconBell')
}

watch(() => payment.value.amount, (newVal) => {
    animateValue(animatedAmount, animatedAmount.value, newVal, 800)
})

watch(() => payment.value.due_in_days, (newVal) => {
    animateValue(animatedDays, animatedDays.value, newVal, 600)
})

const animateValue = (targetRef, from, to, duration) => {
    const start = performance.now()
    const range = to - from
    const step = (timestamp) => {
        const progress = Math.min((timestamp - start) / duration, 1)
        targetRef.value = Math.round(from + range * easeOutCubic(progress))
        if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
}

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

const sendReminder = async ({ note }) => {
    submitting.value = true
    const payload = {
        payment_id: route.params.payment_id,
        note: note || '',
    }

    const res = await request.post('task/Payment/send-reminder', payload)
    submitting.value = false

    if (res.error) {
        Signal.error(res.message || 'Failed to send reminder.')
    } else {
        Signal.success('Reminder sent successfully!')
        setTimeout(() => {
            router.go(-1)
        }, 1000)
    }
}
</script>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(6px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fadeIn {
    animation: fadeIn 0.4s ease-out both;
}
</style>
