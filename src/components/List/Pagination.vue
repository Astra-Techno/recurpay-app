<template>
	<div class="bh-pagination bh-py-5">
		<div class="bh-flex bh-items-center bh-flex-wrap bh-flex-col sm:bh-flex-row  bh-gap-4">
			<!--<div class="bh-pagination-info bh-flex bh-items-center">
				<span class="bh-mr-2">Showing {{ config.itemStart }} to {{ config.itemCount }} of {{ config.total }}
					{{ title.toLowerCase() }}</span>
				<select class="bh-pagesize" v-model="config.limit" @change="$emit('set-page-limit', config.limit)">
					<option v-for="option in options" :value="option">{{ option }}</option>
				</select>
			</div>-->
			<div class="bh-pagination-number sm:bh-ml-auto bh-inline-flex flex-wrap bh-items-center bh-space-x-1">
				<button title="Go to First page" type="button" class="bh-page-item first-page "
					:class="{ disabled: config.page == 1 }" :disabled="config.page == 1" @click="$emit('go-first')">
					<span>
						<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true" data-pc-section="firsticon">
							<path fill-rule="evenodd" clip-rule="evenodd"
								d="M5.71602 11.164C5.80782 11.2021 5.9063 11.2215 6.00569 11.221C6.20216 11.2301 6.39427 11.1612 6.54025 11.0294C6.68191 10.8875 6.76148 10.6953 6.76148 10.4948C6.76148 10.2943 6.68191 10.1021 6.54025 9.96024L3.51441 6.9344L6.54025 3.90855C6.624 3.76126 6.65587 3.59011 6.63076 3.42254C6.60564 3.25498 6.525 3.10069 6.40175 2.98442C6.2785 2.86815 6.11978 2.79662 5.95104 2.7813C5.78229 2.76598 5.61329 2.80776 5.47112 2.89994L1.97123 6.39983C1.82957 6.54167 1.75 6.73393 1.75 6.9344C1.75 7.13486 1.82957 7.32712 1.97123 7.46896L5.47112 10.9991C5.54096 11.0698 5.62422 11.1259 5.71602 11.164ZM11.0488 10.9689C11.1775 11.1156 11.3585 11.2061 11.5531 11.221C11.7477 11.2061 11.9288 11.1156 12.0574 10.9689C12.1815 10.8302 12.25 10.6506 12.25 10.4645C12.25 10.2785 12.1815 10.0989 12.0574 9.96024L9.03158 6.93439L12.0574 3.90855C12.1248 3.76739 12.1468 3.60881 12.1204 3.45463C12.0939 3.30045 12.0203 3.15826 11.9097 3.04765C11.7991 2.93703 11.6569 2.86343 11.5027 2.83698C11.3486 2.81053 11.19 2.83252 11.0488 2.89994L7.51865 6.36957C7.37699 6.51141 7.29742 6.70367 7.29742 6.90414C7.29742 7.1046 7.37699 7.29686 7.51865 7.4387L11.0488 10.9689Z"
								fill="currentColor"></path>
						</svg>
					</span>
				</button>
				<button title="Go to Previous page" type="button" class="bh-page-item previous-page "
					:class="{ disabled: config.page == 1 }" :disabled="config.page == 1" @click="$emit('go-prev')">

					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true" data-pc-section="previcon">
						<path
							d="M8.75 11.185C8.65146 11.1854 8.55381 11.1662 8.4628 11.1284C8.37179 11.0906 8.28924 11.0351 8.22 10.965L4.72 7.46496C4.57955 7.32433 4.50066 7.13371 4.50066 6.93496C4.50066 6.73621 4.57955 6.54558 4.72 6.40496L8.22 2.93496C8.36095 2.84357 8.52851 2.80215 8.69582 2.81733C8.86312 2.83252 9.02048 2.90344 9.14268 3.01872C9.26487 3.134 9.34483 3.28696 9.36973 3.4531C9.39463 3.61924 9.36303 3.78892 9.28 3.93496L6.28 6.93496L9.28 9.93496C9.42045 10.0756 9.49934 10.2662 9.49934 10.465C9.49934 10.6637 9.42045 10.8543 9.28 10.995C9.13526 11.1257 8.9448 11.1939 8.75 11.185Z"
							fill="currentColor"></path>
					</svg>

				</button>


				<!-- Page Numbers -->
				<button type="button" class="bh-page-item p-2 border rounded-md" v-for="button in config.buttons"
					:key="button" :disabled="config.page == button" :class="{
						'bh-active font-bold bg-blue-500 text-white': config.page == button,
						'hidden sm:block': !(button === config.page || button === config.page - 1 || button === config.page + 1 || button === config.page + 1)
					}" @click="$emit('go-to', button)">
					{{ button }}
				</button>

				<!--
				<div class="sm:hidden w-20">
					<FormKit type="select" v-model="config.page" :options="config.buttons"
						@input="$emit('go-to', config.page)">
					</FormKit>
				</div>-->

				<button title="Go to Next page" type="button" class="bh-page-item next-page "
					:class="{ disabled: config.page == config.totalPages }" :disabled="config.page == config.totalPages"
					@click="$emit('go-next')">

					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true" data-pc-section="nexticon">
						<path
							d="M5.25 11.1728C5.14929 11.1694 5.05033 11.1455 4.9592 11.1025C4.86806 11.0595 4.78666 10.9984 4.72 10.9228C4.57955 10.7822 4.50066 10.5916 4.50066 10.3928C4.50066 10.1941 4.57955 10.0035 4.72 9.86283L7.72 6.86283L4.72 3.86283C4.66067 3.71882 4.64765 3.55991 4.68275 3.40816C4.71785 3.25642 4.79932 3.11936 4.91585 3.01602C5.03238 2.91268 5.17819 2.84819 5.33305 2.83149C5.4879 2.81479 5.64411 2.84671 5.78 2.92283L9.28 6.42283C9.42045 6.56346 9.49934 6.75408 9.49934 6.95283C9.49934 7.15158 9.42045 7.34221 9.28 7.48283L5.78 10.9228C5.71333 10.9984 5.63193 11.0595 5.5408 11.1025C5.44966 11.1455 5.35071 11.1694 5.25 11.1728Z"
							fill="currentColor"></path>
					</svg>
				</button>
				<button title="Go to Last page" type="button" class="bh-page-item last-page "
					:class="{ disabled: config.page == config.totalPages }" :disabled="config.page == config.totalPages"
					@click="$emit('go-last')">
					<span>
						<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"
							class="p-icon p-paginator-last-icon" aria-hidden="true" data-pc-section="lasticon">
							<path fill-rule="evenodd" clip-rule="evenodd"
								d="M7.68757 11.1451C7.7791 11.1831 7.8773 11.2024 7.9764 11.2019C8.07769 11.1985 8.17721 11.1745 8.26886 11.1312C8.36052 11.088 8.44238 11.0265 8.50943 10.9505L12.0294 7.49085C12.1707 7.34942 12.25 7.15771 12.25 6.95782C12.25 6.75794 12.1707 6.56622 12.0294 6.42479L8.50943 2.90479C8.37014 2.82159 8.20774 2.78551 8.04633 2.80192C7.88491 2.81833 7.73309 2.88635 7.6134 2.99588C7.4937 3.10541 7.41252 3.25061 7.38189 3.40994C7.35126 3.56927 7.37282 3.73423 7.44337 3.88033L10.4605 6.89748L7.44337 9.91463C7.30212 10.0561 7.22278 10.2478 7.22278 10.4477C7.22278 10.6475 7.30212 10.8393 7.44337 10.9807C7.51301 11.0512 7.59603 11.1071 7.68757 11.1451ZM1.94207 10.9505C2.07037 11.0968 2.25089 11.1871 2.44493 11.2019C2.63898 11.1871 2.81949 11.0968 2.94779 10.9505L6.46779 7.49085C6.60905 7.34942 6.68839 7.15771 6.68839 6.95782C6.68839 6.75793 6.60905 6.56622 6.46779 6.42479L2.94779 2.90479C2.80704 2.83757 2.6489 2.81563 2.49517 2.84201C2.34143 2.86839 2.19965 2.94178 2.08936 3.05207C1.97906 3.16237 1.90567 3.30415 1.8793 3.45788C1.85292 3.61162 1.87485 3.76975 1.94207 3.9105L4.95922 6.92765L1.94207 9.9448C1.81838 10.0831 1.75 10.2621 1.75 10.4477C1.75 10.6332 1.81838 10.8122 1.94207 10.9505Z"
								fill="currentColor"></path>
						</svg>
					</span>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
const { options, config } = defineProps({
	options: Object,
	config: Object,
	title: {
		type: String,
		required: false,
		default() {
			return 'entries'
		}
	}
})

defineEmits(['go-to', 'go-prev', 'go-next', 'go-first', 'go-last', 'set-page-limit'])
</script>
