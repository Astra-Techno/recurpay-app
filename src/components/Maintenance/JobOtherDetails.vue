<template>
	<div v-if="job.Tradie !='comming soon' && job.Tradie != null" class="section-wrapper">
		<div class="m-section">
			<div class="m-section-header">
				Trade
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">
					Trade
				</div>
				<div>
					{{ job.Trade }}
				</div>
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">
					Tradie
				</div>
				<div>{{ job.Tradie.tradie_company_name }}</div>
			</div>
		</div>
	</div>
	<div class="section-wrapper">
		<div class="m-section">
			<div class="m-section-header">
				Urgency
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">
					Urgent
				</div>
				<div v-if="job.urgent_job == '15'" class="text-[#3f4e6a] jobdetails-value">Yes</div>
				<div v-else class="text-[#3f4e6a] jobdetails-value">No</div>
			</div>
		</div>
	</div>
	<div class="section-wrapper">
		<div class="m-section">
			<div class="m-section-header">
				Completion
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">
					Required on completion
				</div>
				<div v-if="job.required_media == 'photo'">Photo</div>
				<div v-else-if="job.required_media == 'video'">Video</div>
				<div v-else>No media required</div>
			</div>
		</div>
	</div>
	<div class="section-wrapper">
		<div class="m-section">
			<div class="m-section-header">
				Notification
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">
					Notify Landlord
				</div>
				<div>Yes</div>
			</div>
		</div>
	</div>
	<div class="section-wrapper">
		<div class="m-section">
			<div class="m-section-header">
				Details
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">
					Maintenance Type
				</div>
				<div v-if="job.maintenance_type == 'g'">
					General wear and Tear
				</div>
				<div v-if="job.maintenance_type == 't'">Tenant Damage</div>
				<div v-if="job.maintenance_type == 'b'">Bond</div>
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">
					Dogs
				</div>
				<div v-if="job.job_dogs == 'No dogs'">No dogs</div>
				<div v-else-if="job.job_dogs != 'No dogs' && job.job_dogs != null">{{
					job.job_dogs }}</div>
				<div v-else>No information provided</div>
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">
					Access
				</div>
				<div v-if="job.job_access == 'home'">Times I'll be home</div>
				<div v-else-if="job.job_access == 'access'">{{
					job.job_access_instructions }}</div>
				<div v-else-if="job.job_access == 'outside'">I don't need to be
					home, but the job is outside</div>
				<div v-else-if="job.job_access == 'arrive'">I can come home if
					you
					call me before arriving</div>
				<div v-else-if="job.job_access == 'pm'">I won't be home, please
					pick up the key from the Property Manager</div>
				<div v-else>No details provided</div>
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">Job Due Date</div>
				<div>{{ job.job_deadline }}</div>
			</div>
			<div class="m-section-detail">
				<div class="m-section-subheader">Earliest Start</div>
				<div>{{ job.job_start_date }}</div>
			</div>

			<div class="m-section-detail">
				<div class="m-section-subheader">
					Frequency
				</div>
				<div v-if="job.job_frequency != '0'">{{ job.job_frequency
					}}
				</div>
				<div v-else>One off</div>
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
