<template>
    <div class="flex gap-5">
        <list-table class="w-full" ref="inspectionList" checkbox="id" :search="false" :title="'Inspections: 360° Inspections'" :headers="headersFields" 
        	:data-url="'list/Inspection/Inspections:panolist'" :sortBy="'InspectionCompleted'" :sortOrder="'DESC'" :page-limit="10">
            <template #row-address="{item}">
            	<a :href="`/inspection/panoview?id=${item.id}&fullview=1`">
					<b>{{item.address}}</b>
				</a>
            </template>
			<template #row-inspector="{item}">
				{{ item.inspector_name }} ({{ item.inspector_email }})
			</template>
			<template #row-action="{item}">
				<a class="flex underline decoration-1" :href="`/inspection/panoview?id=${item.id}&fullview=1`">
					<icon-arrow-forward></icon-arrow-forward>
					<span>360° View</span>
				</a>
			</template>
        </list-table>
    </div>
</template>

<!-- script -->
<script lang="ts" setup>
    import { ref } from 'vue';
    import { useMeta } from '@/composables/use-meta';
    import ListTable from '@/components/List/Table.vue';
	import iconArrowForward from '@/components/icon/icon-arrow-forward.vue';

    useMeta({ title: 'Inspections: 360° Inspections' });

    const inspectionList = ref(null);

    const headersFields = ref([
        { field: 'id', title: '#', sortField: 'id', sortDirection: 'asc', width: 5 },
        { field: 'address', title: 'Property', sortField: 'address', sticky: true },
		{ field: 'inspector', title: 'Inspector', sticky: true, width: '20%' },
		{ field: 'scheduled', title: 'Scheduled', sortField: 'ins_date', sticky: true, width: '15%' },
		{ field: 'completed', title: 'Completed', sortField: 'InspectionCompleted', sticky: true, width: '15%' },
		{ field: 'action', title: '', width: '10%' }
    ])
</script>
