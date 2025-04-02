<template>
	<div class="pt-5">
		<DailyMessage class="mb-4" />
		<Tabs :tabs="tabs" />
	</div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/stores/index'
import { useMeta } from '@/composables/use-meta'
import Tabs from '@/components/elements/Tab.vue';
import Properties from '@/components/common/Properties.vue'
import Transactions from '@/components/common/Transactions.vue'
import DailyMessage from '@/components/elements/DailyNotification.vue';

const tabs = [
  { label: 'Properties', component: Properties },
  { label: 'Transactions', component: Transactions }
  
];

useMeta({ title: 'Dashboard' })
const store = useAppStore()

</script>
