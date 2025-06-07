<template>
	<nav class="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90  py-2"
		:class="isDashboard ? 'pb-4' : 'pb-5'">
		<div class="flex items-center justify-between">
			<slot name="flex-items"></slot>
		</div>
	</nav>
</template>
	
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isDashboard = computed(() => route.path === '/dashboard')
</script>

<style scoped></style>
