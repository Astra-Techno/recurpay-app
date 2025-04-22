<template>
	<div class="flex items-center mb-6">
		<slot name="header">
			<h1 class="flex-1">{{ routeName }}</h1>
		</slot>
	</div>
	<div class="flex flex-col mb-10 rounded-t-2xl">
		<slot name="body">
			<!-- <div class="flex items-center">
				<h1 class="text-4xl font-bold mb-4">Coming Soon!</h1>
				<p class="text-xl text-gray-700 text-center">
					The {{ routeName }} page is under construction.
				</p>
			</div> -->
		</slot>
	</div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const routeName = computed(() => route.name || 'This')

onMounted(() => {
	const segments = route.path.split("/").filter(Boolean);
});

</script>
