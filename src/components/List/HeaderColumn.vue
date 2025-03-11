<template>

  <th v-bind:width="column.width" @click="[column.sortField != null && column.sortField.trim() != '' ? $emit('sort') : true]" class="t-col text-left cursor-pointer align-middle"
  :class="column.sortField == activeSortField ? 'bg-blue-50' : ''">
    <span class="justify-between hidden md:inline">
      <slot></slot>
    </span>
	<!-- Sort Asc-->
	<span class="bh-ml-3 bh-sort bh-items-center float-right" v-if="column.sortField == activeSortField">
		<svg width="16" height="16" viewBox="0 0 14 14" fill="none">
			<polygon points="3.11,6.25 10.89,6.25 7,1.75 " fill="currentColor" class="bh-text-black/20"
			:class="[activeSortDirection == 'asc' ? '!bh-text-primary' : '']"></polygon>
			<polygon points="7,12.25 10.89,7.75 3.11,7.75 " fill="currentColor" class="bh-text-black/20"
			:class="[activeSortDirection == 'desc' ? '!bh-text-primary' : '']"></polygon>
		</svg>
	</span>
  </th>
</template>

<script setup>

const {column, activeSortField, activeSortDirection} = defineProps({
    column: Object,
    activeSortField: {
        type:String,
        default(rawProps) {
        return ''
        }
    },
    activeSortDirection: {
        type:String,
        default(rawProps) {
        return ''
        }
    },
})

defineEmits(['sort'])

</script>

<style scoped>

</style>
