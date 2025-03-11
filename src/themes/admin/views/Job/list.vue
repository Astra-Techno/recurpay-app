<template>
    <div class="flex gap-5">
    	<!-- <pre>{{propertyList.selected_ids}}</pre> -->
        <list-table class="w-full" ref="jobsList" checkbox="id" :title="'All Jobs'" :headers="jobFields" 
        	:data-url="'list/Maintenance/Jobs:all'" :sortBy="'c.modified'" :sortOrder="'desc'" :page-limit="10" :search="false">

			<template #filter="{filter}">
				<FormKit type="text" label="Job#" v-model="filter.jobid"  @keyup.enter="jobsList.goFirst()"/>
				<FormKit type="text" label="Property Id#" v-model="filter.propertyid"  @keyup.enter="jobsList.goFirst()"/>
				<FormKit type="text" label="Contractor" v-model="filter.contactor"  @keyup.enter="jobsList.goFirst()" outer-class="hidden md:inline" />
				<FormKit type="text" label="Keyword" v-model="filter.keyword"  @keyup.enter="jobsList.goFirst()"/>
				<FormKit type="text" label="Exclude Keyword" v-model="filter.search_exclude"  @keyup.enter="jobsList.goFirst()" outer-class="hidden md:inline" />

		        <DatePicker label="Start Date" placeholder="from" v-model="filter.start_from" @keyup.enter="jobsList.goFirst()" outer-class="hidden md:inline" />
		        <DatePicker placeholder="to" v-model="filter.start_to" @keyup.enter="jobsList.goFirst()"  outer-class="my-[25px] hidden md:inline" />

		        <DatePicker label="Created Date" placeholder="from" v-model="filter.created_from" @keyup.enter="jobsList.goFirst()" outer-class="hidden md:inline" />
		        <DatePicker placeholder="to" v-model="filter.created_to" @keyup.enter="jobsList.goFirst()"  outer-class="my-[25px] hidden md:inline" />

		        <DatePicker label="Completion Date" placeholder="from" v-model="filter.completed_from" @keyup.enter="jobsList.goFirst()" outer-class="hidden md:inline" />
		        <DatePicker placeholder="to" v-model="filter.completed_to" @keyup.enter="jobsList.goFirst()"  outer-class="my-[25px] hidden md:inline" />

		        <DatePicker label="Paid Date" placeholder="from" v-model="filter.paid_from" @keyup.enter="jobsList.goFirst()" outer-class="hidden md:inline" />
		        <DatePicker placeholder="to" v-model="filter.paid_to" @keyup.enter="jobsList.goFirst()"  outer-class="my-[25px] hidden md:inline" />

  				<SelectBox label="Property Status" v-model="filter.property_status" @change="jobsList.goFirst()"
  					:options="{' ': 'All', 'prop_active': 'Active', 'prop_inactive': 'Inactive'}"  :value="' '" />

				<SelectBox label="Status" v-model="filter.job_status" @change="jobsList.goFirst()"  
					 placeholder="Select Status" :data-url="'options/System/SelectOptions:JobStatus'" />
			</template>

            <template #row-job="{item}">
            	<span :title="item.job">{{item.job.length > 100 ? item.job.substring(0, 100) + '...' : item.job}}</span>
            </template>

        </list-table>

    </div>
</template>



<!-- script -->
<script lang="ts" setup>
    import { ref } from 'vue';
    import { useMeta } from '@/composables/use-meta';
    import ListTable from '@/components/List/Table.vue';
    import DatePicker from '@/components/elements/DatePicker.vue';
    import SelectBox from '@/components/elements/SelectBox.vue';
    import useApiRequest from '@/composables/request';

    useMeta({ title: 'All Jobs' });

    const jobsList = ref(null);
    
    const date_format = 'DD MMM YYYY';
    const value_format = 'YYYY-MM-DD';

    const jobFields = ref([
        { field: 'pref', title: 'PRef', sortField: 'pref', sortDirection: 'asc' },
        { field: 'job', title: 'Job', sortField: 'job', sticky: true, width: '15%' },
        { field: 'address', title: 'Address', sortField: 'address', width: '20%' },
        { field: 'contractor', title: 'Contractor', sortField: 'contractor', width: '13%' },        
        { field: 'created_date', title: 'Created Date', sortField: 'c.created', width: '9%' },
        { field: 'days', title: 'Days Since', sortField: 'days' },
        { field: 'start_date', title: 'Start date', sortField: 'job_start_date', width: '9%' },        
        { field: 'deadline', title: 'Completion date', sortField: 'job_deadline', width: '9%' },
        { field: 'status', title: 'Status', sortField: 'job_status', width: '5%' },        
        { field: 'job_final_amount', title: '$ Inv', sortField: 'job_final_amount', width: '5%' },
        { field: 'manager', title: 'Property Manager', sortField: 'manager', width: '9%' },
        { field: 'job_id', title: 'Job ID', sortField: 'job_id', width: '5%' },
    ]);
    
    function getStatus(item)
    {
    	let status = item.status;
    	let sub_status = '';

		if (item.status != 'finalised') {
			if (item.status == 'offer-refer') {
				if (item.sub_status == 'll_request_to_quote' || item.sub_status == 'll_request_offer_to_quote')
					tmp_status = "LL requests quotes";
				else if (item.sub_status != '')
					sub_status = item.sub_status;
			} else if (item.status == 'offer-draft') {
				tmp_status = "Saved offer";
				if (item.sub_status == 'Waiting on PM')
					tmp_status = "Offer Waiting on LL PM";
				else if (item.sub_status == 'landlord return offer')
					tmp_status = "Returned by the landlord";
			} else if (item.sub_status == 'Third party to pay')
				tmp_status = "Third party to pay";
			else if (item.status =='quote' && item.send_to_ll == 1)
				tmp_status = "Quotes sent to Landlord";
			else if (item.sub_status == 'll_request_to_quote' || item.sub_status == 'll_request_offer_to_quote')
				tmp_status = "LL requests quotes";
			else if (item.sub_status != '')
				sub_status = item.sub_status;
		}

		status = tmp_status;
		if (typeof statusList[tmp_status] != "undefined") 
			status = statusList[tmp_status];

		 if (item.job_status == 'deferred')
			status += ' (Until '+ item.defer +')';

		if (sub_status != '' && sub_status != null && sub_status != 'NULL' && sub_status !='no sub status')
			status += ' - ' + sub_status;

		return status;
    }

	const request = useApiRequest();
    async function loadHorrorMovies() {
	  const res = await request.fetch('all/System/SelectOptions:JobStatus')

	  return res.data;
	}
</script>

