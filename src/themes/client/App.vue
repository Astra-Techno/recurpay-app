<template>
	<div class="main-section antialiased relative text-base font-normal admin" :class="routeClass">
		<component :is="layoutComponent">
			<router-view></router-view>
		</component>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/index';
import FullLayout from './layouts/FullViewLayout.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'

const { VITE_PROJECT_BASE } = import.meta.env;

document.documentElement.setAttribute('data-theme', 'client')

const store = useAppStore();
const layoutComponent = computed(() => {
	var layout = (store.user.token == null || store.user.guest == '1' ? FullLayout : ((store.fullview == 1) ? FullLayout : DefaultLayout));
	return layout;
});

const route = useRoute()

const routeClass = computed(() => {
	return route.name
		? route.name.toLowerCase().replace(/\s+/g, "-")
		: "default-page";
})
</script>
