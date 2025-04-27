<template>
	<div class="space-y-4 animate-fade-in">

        <!-- Title -->
        <h2 v-if="title !== ''" class="text-lg font-semibold text-gray-800">{{ title }}</h2>        
		<list ref="rowContents" class="w-full" tmpl="custom" :data-url="dataUrl" :sortBy="'p.id'" :sortOrder="'desc'"
			:filter-toggle="false" :messages="{ empty: 'There are no properties added!' }" :page-limit="pageLimit"
			:show-pagination="pagination" :search="false">
			<template #body="{ rows, isLoading }">
				
				<template v-if="isLoading">
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
					<!-- Flat List -->
					<div class="space-y-4 animate-fade-in">
						<TransactionCard :display-type="display"  v-for="payment in rows" :key="payment.id" :transaction="payment"
							class="grid grid-cols-1 gap-1 shadow-md transition-transform transform hover:scale-[1.01]" />
					</div>
					<template v-if="rowContents.total === 0" class="text-center text-gray-400 text-sm py-10">
						No Recent Payments Found
					</template>
				
				</template>

			</template>
		</list>		
	</div>
</template>

<script setup>
import { computed, defineProps, ref,onMounted } from 'vue'
import List from '@/components/List/List.vue'
import { useAppStore } from '@/stores/index'
import TransactionCard from '@/components/common/TransactionCard.vue'

const user = useAppStore().getUser()

const props = defineProps({
    title: { type: String, required: true, default: '' },
    display: { type: String, default: 'list', required: false },
    pagination: { type: Boolean, default: false, required: false },
    pageLimit: { type: Number, default: 2, required: false },
    propertyId: { type: Number, default: null, required: false },
    status: { type: String, default: 'all', required: false },
})

const dataUrl = computed(() => {
    let pay_status = ''
    if (props.status === 'pending') pay_status = 'Pending=1'
    else if (props.status === 'due') pay_status = 'Due=1'

    const query = pay_status ? `&${pay_status}` : ''

    if (props.propertyId > 0) {
        return `list/PaymentTransactions?property_id=${props.propertyId}${query}`
    } else {
		return `list/PaymentTransactions`
	}
})
const rowContents = ref([])
</script>
