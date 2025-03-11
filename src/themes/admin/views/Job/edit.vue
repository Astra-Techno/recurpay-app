<template>
    <div class="flex gap-5">
    
        <div class="px-0 pb-1.5 border-[#e0e6ed] dark:border-[#1b2e4b]">
            <div class="mb-4.5 flex flex-row">
                <h2 class="title-p">New Maintenance Request</h2>
            </div>

			<!-- {{ item }} -->

            <FormKit type="form" #default="{ value }" submit-label="Send Request">            
            	<SelectBox label="Location" v-model="item.location" :return-object="true" placeholder="Select Location" :data-url="'all/System/SelectOptions?filter_type=location'" />

            	<SelectBox label="Area" v-model="item.area" :return-object="true" placeholder="Select Area" :data-url="`all/System/SelectOptions?filter_type=area&parent_id=${item.location.__original}`" />
				<FormKit v-if="item.area.label=='Other'" type="text" v-model="item.area_other" />

				<SelectBox label="Problem" v-model="item.problem" :return-object="true" placeholder="Select Problem" :data-url="`all/System/SelectOptions?filter_type=problem&parent_id=${item.area.__original}`" />
				<FormKit v-if="item.problem.label=='Other'" type="text" v-model="item.problem_other" />

				<FormKit type="text" label="Request title" v-model="item.job.title" validation="required" :value="jobTitle" />

				<AutoComplete prefix-icon="search" select-icon="" label="Property address" debounce="500" min="3" placeholder="Search Property..." limit="10" validation="required"
					:data-url="`all/Properties:listing?select=autocomplete&keyword=`"
				  />

				<SelectBox label="Emergency" v-model="item.job.emergency" placeholder="Please Select" :data-url="`all/System/SelectOptions?filter_type=emergency`"
					help="Warning: If this request is found not to be an emergency, you, the tenant will be responsible for the emergency call out fees." />

				<FormKit type="textarea" v-model="item.job.description" label="Request description" 
					placeholder="Please write a short accurate description of the job. Notes to the tradies can be added as a Note. Tenants' complaints should be replaced with an objective description of the task or problem."
				/>

				<Media section="job" section-type="media" :record-id="item.job.id" label="Videos and/or images" />

				<Media section="job" section-type="attachments" :record-id="item.job.id" label="Attachments" />

				<SelectBox label="Dogs" v-model="item.job.dogs" placeholder="Select" :data-url="`all/System/SelectOptions?filter_type=dogs`" />

				<SelectBox label="Access" v-model="item.job.access" placeholder="Select" :data-url="`all/System/SelectOptions?filter_type=access`" />
            </FormKit>

		</div>
    </div>
</template>



<!-- script -->
<script lang="ts" setup>
    import { ref, computed } from 'vue';
    import { useMeta } from '@/composables/use-meta';
    import SelectBox from '@/components/elements/SelectBox.vue';
    import AutoComplete from '@/components/elements/AutoComplete.vue';

    useMeta({ title: 'New maintenance request' });
    
    let item = ref({
		location: '',
		area: '',
		area_other:'',
		problem: '',
		problem_other: '',
		job: {
			id:'',
			title:'',
			emergency: '',
			dogs:342,
			access:'',
			description:''
		},
	});

	const jobTitle = computed(() => {
		let title = '';

		title += (item.value.job.emergency == '') ? '' : 'Emergency - ';

		title += (item.value.location.label == null) ? '' : item.value.location.label;

		title += (item.value.area.label == null || item.value.area.label == 'Other') ? '' : ' ' + item.value.area.label;
		title += (item.value.area.label == 'Other' && item.value.area_other != '') ? ' ' + item.value.area_other : '';

		title += (item.value.problem.label == null || item.value.problem.label == 'Other') ? '' : ' ' + item.value.problem.label;
		title += (item.value.problem.label == 'Other' && item.value.problem_other != '') ? ' ' + item.value.problem_other : '';

		item.value.job.title = title;
    });

</script>
