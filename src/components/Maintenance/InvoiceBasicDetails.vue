<template>
	<div class="section-wrapper">
		<div class="m-section">
			<div class="m-section-header">
				Basic Details
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">
					Name
				</div>
				<div>
					OM
				</div>
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">
					Phone
				</div>
				<div>
					9821478932
				</div>
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">
					Property
				</div>
				<div>
					{{ job.address }}
				</div>
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">
					Origin
				</div>
				<div>
					{{ job.title}}
				</div>
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">
					Due Date
				</div>
				<div>
					{{ job.due_date }}
				</div>
			</div>
		</div>
	</div>
	<div class="section-wrapper hidden">
		<div class="m-section">
			<div class="m-section-header">
				Origin
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">
					Origin
				</div>
				<div>
					<div v-if="job.origin != '' && job.origin != null" class="grow shrink basis-0 jobdetails-value">
						{{ job.origin }}</div>
					<div v-else class="grow shrink basis-0 jobdetails-value">{{ job.creator_group }}</div>
				</div>
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">
					Tenant’s Description
				</div>
				<div v-if="job.tenant_job_description != '' && job.tenant_job_description != null">
					{{ job.tenant_job_description }}</div>
				<div v-else>No tenant description</div>
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">
					Description
				</div>
				<div v-if="job.job_description != '' && job.job_description != null">{{
					job.job_description }}</div>
				<div v-else>No Job description</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	job: {
		type: Object,
		required: true
	}
})
</script>
