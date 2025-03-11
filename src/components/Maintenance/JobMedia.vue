<template>
	<div class="section-wrapper">
		<div class="m-section">
			<div class="m-section-header">Images and Videos</div>
			<Media section="job" section-type="job_images" :record-id="job.id" v-model="job.job_images" :edit="false" />
		</div>
	</div>
	<div class="section-wrapper">
		<div class="m-section">
			<div class="m-section-header">Related Files</div>
			<Media section="job" section-type="related_files" :record-id="job.id" v-model="job.related_files" :edit="false" />
		</div>
	</div>
	<div class="section-wrapper">
		<div class="m-section">
			<div class="m-section-header">Contract Docs</div>
			<Media section="job" section-type="contract_doc" :record-id="job.id" v-model="job.contract_doc" :edit="false" />
		</div>
	</div>
	<div class="section-wrapper">
		<div class="m-section">
			<div class="m-section-header">Attachments</div>
			<Media section="job" section-type="attached_files" :record-id="job.id" v-model="job.attached_files" :edit="false" />
		</div>
	</div>

</template>
<script setup>
import Media from '@/components/elements/Media.vue';

const props = defineProps({
	job: {
		type: Object,
		required: true
	}
})
</script>
