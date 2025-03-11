<template>
	<div class="bh-pagination bh-py-5">
		<div class="bh-flex bh-items-center bh-flex-wrap bh-flex-col sm:bh-flex-row bh-gap-4">
			<!--<div class="bh-pagination-info bh-flex bh-items-center">
				<span class="bh-mr-2">Showing {{ config.itemStart }} to {{ config.itemCount }} of {{ config.total }}
					{{ title.toLowerCase() }}</span>
				<select class="bh-pagesize" v-model="config.limit" @change="$emit('set-page-limit', config.limit)">
					<option v-for="option in options" :value="option">{{ option }}</option>
				</select>
			</div>-->
			<div class="bh-pagination-number sm:bh-ml-auto bh-inline-flex bh-items-center bh-space-x-1">
				<!--<button title="Go to First page" type="button" class="bh-page-item first-page"
					:class="{ disabled: config.page == 1 }" :disabled="config.page == 1" @click="$emit('go-first')">
					<span>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
							class="w-4.5 h-4.5 rtl:rotate-180">
							<path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
								stroke-linejoin="round"></path>
							<path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor"
								stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
					</span>
				</button>-->
				<button title="Go to Previous page" type="button" class="bh-page-item previous-page"
					:class="{ disabled: config.page == 1 }" :disabled="config.page == 1" @click="$emit('go-prev')">

					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
						class="w-4.5 h-4.5 rtl:rotate-180 font-bold">
						<path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
							stroke-linejoin="round"></path>
					</svg>

				</button>

				<span class="flex gap-2">
					<button type="button" class="bh-page-item" v-for="button in config.buttons"
						:disabled="config.page == button" :class="{ 'disabled bh-active': config.page == button }"
						@click="$emit('go-to', button)">
						{{ button }}
					</button>
				</span>

				<button title="Go to Next page" type="button" class="bh-page-item next-page"
					:class="{ disabled: config.page == config.totalPages }" :disabled="config.page == config.totalPages"
					@click="$emit('go-next')">

					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
						class="w-4.5 h-4.5 rtl:rotate-180 font-bold">
						<path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
							stroke-linejoin="round"></path>
					</svg>
				</button>
				<!--<button title="Go to Last page" type="button" class="bh-page-item last-page"
					:class="{ disabled: config.page == config.totalPages }" :disabled="config.page == config.totalPages"
					@click="$emit('go-last')">
					<span>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
							class="w-4.5 h-4.5 rtl:rotate-180">
							<path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
								stroke-linejoin="round"></path>
							<path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor"
								stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
					</span>
				</button>-->
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
