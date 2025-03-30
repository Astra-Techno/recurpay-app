<template>
	<div class="tag-box" v-if="display == 'box'">
		<Icon :name="icon" :width="width" :height="height" />
		{{ title }}
	</div>
	<div :class="['tag-badge', className]" v-if="display == 'badge'">
		{{ title }}
	</div>
</template>

<script setup>
const props = defineProps({
	title: {
		type: String,
		required: true
	},
	className: {
		type: String,
		default: ''
	},
	icon: {
		type: String,
		default: ''
	},
	display: {
		type: String,
		default: 'box' // 'box', 'inline', 'inline-block'
	},
	width: {
		type: String,
		default: '18'
	},
	height: {
		type: String,
		default: '18'
	}
});
</script>
