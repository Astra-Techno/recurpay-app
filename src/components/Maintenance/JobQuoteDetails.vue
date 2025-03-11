<template>
	<div class="section-wrapper">
		<div class="m-section">
			<div class="m-section-header">
				Quote
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">
					Quote if above
				</div>
				<div v-if="job.limit != '' && job.limit != null">
					{{ job.limit }}</div>
				<div v-else>No Quote if amount specified</div>
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">
					Offer or Quote
				</div>
				<div v-if="job.job_request_type != '' && job.job_request_type != null && job.job_request_type == 'offer'"
					class="text-[#3f4e6a] jobdetails-value">Offer</div>
				<div v-if="job.job_request_type != '' && job.job_request_type != null && job.job_request_type == 'quote'"
					class="text-[#3f4e6a] jobdetails-value">Quote</div>
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">
					Quote offer expiry
				</div>
				<div v-if="job.job_request_type == 'offer'">
					{{ job.offer_expiry_date }}</div>
				<div v-if="job.job_request_type == 'quote'">
					{{ job.quote_deadline }}</div>
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
