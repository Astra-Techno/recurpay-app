<template>
	<div class="pagination flex space-x-4 justify-end text-primary my-8">
		<!-- Previous Page -->
		<button
			class="border border-primary rounded p-1 disabled:opacity-50"
			@click="$emit('prev-page')"
			:disabled="currentPage === 1"
		>
			<slot name="prev-icon">
				<IconLeftArrow />
			</slot>
		</button>

		<!-- Page Numbers -->
		<button
			class="disabled:text-black"
			v-for="(page, index) in pageNumbers"
			:key="index"
			:class="{ active: page === currentPage }"
			:disabled="page === currentPage"
			@click="$emit('go-to-page', page)"
		>
			{{ page }}
		</button>

		<!-- Next Page -->
		<button
			class="border border-primary rounded p-1 disabled:opacity-50"
			@click="$emit('next-page')"
			:disabled="currentPage === totalPages"
		>
			<slot name="next-icon">
				<IconRightArrow />
			</slot>
		</button>
	</div>
</template>

<script setup>
import IconLeftArrow from "../icon/icon-arrow-backward.vue";
import IconRightArrow from "../icon/icon-arrow-forward.vue";

// Props for the pagination component
defineProps({
	currentPage: {
		type: Number,
		required: true,
	},
	totalPages: {
		type: Number,
		required: true,
	},
	pageNumbers: {
		type: Array,
		required: true,
	},
})
</script>
