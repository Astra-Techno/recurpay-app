<template>

    <div class="flex justify-between items-center py-4">
        <p class="text-sm font-semibold" v-if="!grouped">Payments</p>
        <router-link v-if="!grouped" :to="{ name: 'AddPayment', params: { property_id: propertyId } }">
            <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">Add Payment</button>
        </router-link>
    </div>

    <list ref="rowContents" class="w-full" tmpl="custom" :data-url="dataUrl" :sortBy="'p.id'" :sortOrder="'desc'"
        :filter-toggle="false" :messages="{ empty: 'There are no properties added!' }" :page-limit="pageLimit"
        :show-pagination="pagination" :search="false">
        <template #body="{ rows }">


            <template v-if="grouped">
                <div class="space-y-6">
                    <div v-for="(payments, groupTitle) in rows" :key="groupTitle"
                        class="bg-white rounded-2xl shadow p-4 space-y-4">

                        <div class="flex justify-between items-center pb-2 border-b">
                            <h2 class="text-lg font-bold">{{ groupTitle }}<br /><span class="text-sm text-gray-500"> {{payments[0].address1 }}</span></h2>

                            <router-link v-if="payments.length > 0"
                                :to="{ name: 'AddPayment', params: { property_id: payments[0].property_id } }">
                                <button class="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">
                                    Add Payment
                                </button>
                            </router-link>
                        </div>

                        <!-- Payments under group -->
                        <div class="space-y-4 pt-2">
                            <PaymentCard v-for="payment in payments" :key="payment.id" :payment="payment" />
                        </div>

                    </div>
                </div>

            </template>

            <!-- If Flat List -->
            <template v-else>
                <div class="space-y-4">
                    <PaymentCard class="grid grid-cols-1 gap-1 shadow-md" v-for="payment in rows" :key="payment.id"
                        :payment="payment" />
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
            <template v-if="rowContents.total === 0">
                <div class="text-center text-gray-500">No Payments to List.</div>
            </template>
        </template>
    </list>

</template>
<script setup>
import { computed, defineProps, ref } from 'vue'
import List from '@/components/List/List.vue'
import { useAppStore } from '@/stores/index'

import PaymentCard from '@/components/common/PaymentCard.vue'


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
    },
    status: {
        type: String,
        default: 'all',
        required: false
    },
})

const grouped = ref(false)
const dataUrl = computed(() => {
    let pay_status = '';

    if (props.status === 'pending') {
        pay_status = 'Pending=1';
    } else if (props.status === 'due') {
        pay_status = 'Due=1';
    } else {
        pay_status = '';
    }

    // Build query string
    const query = pay_status ? `&${pay_status}` : '';

    if (props.propertyId > 0) {
        return `list/Payments?property_id=${props.propertyId}${query}`;
    } else {
        grouped.value = true;
        return `group-list/Payments:allPayments${pay_status ? `?${pay_status}` : ''}`;
    }
});

const rowContents = ref([])
</script>