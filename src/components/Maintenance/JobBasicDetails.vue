<template>
	<div class="section-wrapper">
		<div class="m-section">
			<div class="m-section-header">
				Basic Details
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">
					Property
				</div>
				<div>
					{{ job.Property.address }}
				</div>
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">
					Personal Message
				</div>
				<div>
					<div v-if="job.Message != null && job.Message.description != '' && job.Message.description != null"
						class="jobdetails-value">{{ job.Message.description }}</div>
					<div v-else class="jobdetails-value">No personal message</div>
				</div>
			</div>
		</div>
	</div>
	<div class="section-wrapper">
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
