<template>
  <!-- Header -->
  <section class="p-4">
    <h2 class="font-black italic mb-2">👋 Welcome, {{ user.name ? user.name : 'User' }}!</h2>
    <!--<p class="indent-2" v-if="animatedProperties > 0">You are managing {{ animatedProperties }} properties.</p> -->
  </section>

  <!-- Empty State -->
  <EmptyState
    v-if="animatedProperties === 0"
    icon="🏠"
    title="Let's Get Started!"
    description="You don’t have any properties yet."
    action-label="➕ Add Your First Property"
    :action-link="{ name: 'AddProperty', params: { mode: 'add' } }"
  />


  <!-- Stat Cards -->
  <section class="px-4 pb-4" v-else>
    <SkeletonLoader v-if="loading" />
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div class="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 ease-in-out text-center">
        <div class="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 text-white shadow-md mb-2">🏠</div>
        <p class="text-xs text-gray-400">My Properties</p>
        <p class="text-2xl font-bold text-gray-800">{{ animatedProperties }}</p>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 ease-in-out text-center">
        <div class="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-green-400 to-green-600 text-white shadow-md mb-2">👥</div>
        <p class="text-xs text-gray-400">My Tenants</p>
        <p class="text-2xl font-bold text-gray-800">{{ animatedTenants }}</p>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 ease-in-out text-center">
        <div class="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 text-white shadow-md mb-2">💸</div>
        <p class="text-xs text-gray-400">Due Payments</p>
        <p class="text-2xl font-bold text-gray-800">{{ animatedPendingPayments }}</p>
      </div>
    </div>
  </section>

  <!-- Dues Section -->
  <section class="px-4 pb-4" v-show="dues?.total > 0">
    <h3 class="text-md font-semibold mb-2">⏰ Dues</h3>
    <list ref="dues" class="w-full" tmpl="custom" :data-url="'list/Payments?Due=1'" :filter-toggle="false"
      :messages="{ empty: '' }" :page-limit="2" :show-pagination="false" :search="false">
      <template #body="{ rows }">
        <div class="space-y-2">
          <template v-for="payment in rows">
            <DuePaymentCard :payment="payment" displayType="dashboard" />
          </template>
        </div>
        <div v-if="rows.length > 0" class="text-center mt-4">
          <router-link :to="{ name: 'PaymentsList', params: { status: 'pending' } }">
            <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full animate-bounce-once">
              View All Due
            </button>
          </router-link>
        </div>
      </template>
    </list>
  </section>

  <!-- Pendings Section -->
  <section class="px-4 pb-4" v-show="pendings?.total > 0">
    <h3 class="text-md font-semibold mb-2">💰 Pendings</h3>
    <list ref="pendings" class="w-full" tmpl="custom" :data-url="'list/Payments?Pending=1'" :filter-toggle="false"
      :messages="{ empty: '' }" :page-limit="2" :show-pagination="false" :search="false">
      <template #body="{ rows }">
        <div class="space-y-2">
          <template v-for="payment in rows">
            <PaymentCard :payment="payment" displayType="dashboard" />
          </template>
        </div>
        <div v-if="rows.length > 0" class="text-center mt-4">
          <router-link :to="{ name: 'PaymentsList', params: { status: 'pending' } }">
            <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full animate-bounce-once">
              View All Pendings
            </button>
          </router-link>
        </div>
      </template>
    </list>
  </section>

  <!-- Recent Payments -->
  <section class="px-4 pb-6" v-show="payments?.total > 0">
    <h3 class="text-lg font-bold text-gray-800 mb-4">💳 Transactions</h3>
    <list ref="payments" class="w-full" tmpl="custom" :data-url="'list/PaymentTransactions'"
      :filter-toggle="false" :messages="{ empty: 'No recent transactions!' }"
      :page-limit="2" :show-pagination="false" :search="false"
      @loaded="checkPaymentsAvailable">
      <template #body="{ rows }">
        <div class="space-y-4">
          <template v-for="payment in rows" :key="payment.id">
            <TransactionCard :transaction="payment" displayType="dashboard" />
          </template>
        </div>
        <div v-if="rows.length > 0" class="text-center mt-4">
          <router-link :to="{ name: 'Transactions' }">
            <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">View All Transactions</button>
          </router-link>
        </div>
      </template>
    </list>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMeta } from '@/composables/use-meta'
import { useAppStore } from '@/stores/index'
import useApiRequest from '@/composables/request'
import Signal from '@/composables/signal'
import List from '@/components/List/List.vue'
import PaymentCard from '@/components/common/PendingPaymentCard.vue'
import DuePaymentCard from '@/components/common/DuePaymentCard.vue'
import TransactionCard from '@/components/common/TransactionCard.vue'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const request = useApiRequest()
useMeta({ title: 'Dashboard' })

const user = useAppStore().getUser()
const statsCount = ref({})
const dues = ref(null)
const pendings = ref(null)
const payments = ref(null)

const animatedProperties = ref(-1)
const animatedTenants = ref(0)
const animatedPendingPayments = ref(0)

const loading = ref(true)

const loadStats = async () => {
  const response = await request.post('task/Dashboard/statsList')
  if (response.error) {
    Signal.error(response.message)
    loading.value = false
    return
  }

  if (response.data?.statsCount) {
    statsCount.value = response.data.statsCount
    animatedProperties.value = statsCount.value.totalProperties;
    // animateValue(animatedProperties, statsCount.value.totalProperties)
    animateValue(animatedTenants, statsCount.value.tenants)
    animateValue(animatedPendingPayments, statsCount.value.pendingPayments)
  }

  loading.value = false
}

function animateValue(refVar, targetValue) {
  refVar.value = 0
  const duration = 1000
  const startTime = performance.now()

  function easeOutQuad(t) {
    return t * (2 - t)
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easeOutQuad(progress)
    refVar.value = Math.floor(easedProgress * targetValue)

    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      refVar.value = targetValue
    }
  }

  requestAnimationFrame(update)
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
@keyframes bounceOnce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-6px);
  }
  60% {
    transform: translateY(-4px);
  }
}

.animate-bounce-once {
  animation: bounceOnce 1s ease;
}
</style>