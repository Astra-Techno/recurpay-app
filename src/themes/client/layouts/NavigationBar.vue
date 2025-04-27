<template>
	<nav class="bg-gradient-to-r from-blue-600 to-blue-500 text-white pt-2 top-0 z-10 w-full" :class="isDashboard ? 'pb-5' : 'pb-[60px]'">
		<div class="flex items-center px-2">
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
