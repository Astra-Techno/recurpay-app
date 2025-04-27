<template>
    <div>
        <!-- Top Section -->
        <div class="flex justify-between items-center py-4">
            <p class="text-sm font-semibold" v-if="!grouped">{{ title }}</p>
            <router-link v-if="!grouped" :to="{ name: 'AddPayment', params: { property_id: propertyId } }">
                <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">Add Payment</button>
            </router-link>
        </div>

        <!-- List Section -->
        <list ref="rowContents" class="w-full" tmpl="custom" :data-url="dataUrl" :sortBy="'p.id'" :sortOrder="'desc'"
            :filter-toggle="false" :messages="{ empty: 'There are no Payments to List!' }" :page-limit="pageLimit"
            :show-pagination="pagination" :search="false">
            <template #body="{ rows, loading }">
                <template v-if="loading">
                    <!-- Skeleton Loader -->
                    <div class="space-y-4">
                        <div v-for="n in pageLimit" :key="n"
                            class="bg-gray-100 rounded-2xl p-4 animate-pulse space-y-3">
                            <div class="h-4 bg-gray-300 rounded w-1/3"></div>
                            <div class="h-3 bg-gray-200 rounded w-2/3"></div>
                            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                </template>

                <template v-else>
                    <template v-if="grouped">
                        <!-- Grouped View -->
                        <div class="space-y-6 animate-fade-in">
                            <div v-for="(payments, groupTitle) in rows" :key="groupTitle"
                                class="bg-white rounded-2xl shadow p-4 space-y-4">
                                <div class="flex justify-between items-center pb-2 border-b">
                                    <h2 class="text-lg font-bold">
                                        {{ groupTitle }}
                                        <br />
                                        <span class="text-sm text-gray-500">{{ payments[0]?.address1 }}</span>
                                    </h2>
                                    <router-link v-if="payments.length > 0"
                                        :to="{ name: 'AddPayment', params: { property_id: payments[0].property_id } }">
                                        <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">Add
                                            Payment</button>
                                    </router-link>
                                </div>

                                <div class="space-y-4 pt-2">
                                    <PaymentCard v-for="payment in payments" :key="payment.id" :payment="payment"
                                        class="transition-transform transform hover:scale-[1.01]" />
                                </div>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <!-- Flat List -->
                        <div class="space-y-4 animate-fade-in">
                            <PaymentCard v-for="payment in rows" :key="payment.id" :payment="payment"
                                class="grid grid-cols-1 gap-1 shadow-md transition-transform transform hover:scale-[1.01]" />
                        </div>
                    </template>

                    <!-- View All Button -->
                    <div v-if="rowContents?.total > 2 && pagination === false" class="text-center mt-6">
                        <router-link :to="{ name: 'PaymentsList', params: { property_id: propertyId } }">
                            <button
                                class="text-xs w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-full font-semibold transition">
                                View All
                            </button>
                        </router-link>
                    </div>

                    <!-- No Payments Message -->
                    <template v-if="rowContents?.total === 0">
                        <div class="text-center text-gray-500 text-sm py-10">No Payments to List.</div>
                    </template>
                </template>
            </template>
        </list>
    </div>
</template>

<script setup>
import { computed, defineProps, ref } from 'vue'
import List from '@/components/List/List.vue'
import { useAppStore } from '@/stores/index'
import PaymentCard from '@/components/common/PaymentCard.vue'

const user = useAppStore().getUser()

const props = defineProps({
    title: { type: String, required: true, default: 'Payments' },
    display: { type: String, default: 'dashboard', required: false },
    pagination: { type: Boolean, default: false, required: false },
    pageLimit: { type: Number, default: 2, required: false },
    propertyId: { type: Number, default: null, required: false },
    status: { type: String, default: 'all', required: false },
})

const grouped = ref(false)

const dataUrl = computed(() => {
    let pay_status = ''
    if (props.status === 'pending') pay_status = 'Pending=1'
    else if (props.status === 'due') pay_status = 'Due=1'

    const query = pay_status ? `&${pay_status}` : ''

    if (props.propertyId > 0) {
        return `list/Payments?property_id=${props.propertyId}${query}`
    } else {
        grouped.value = true
        return `group-list/Payments:allPayments${pay_status ? `?${pay_status}` : ''}`
    }
})

const rowContents = ref([])
</script>

<style scoped>
/* Fade-in animation */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fadeIn 0.5s ease-out;
}
</style>