<template>
	<div class="main-section antialiased relative text-base font-normal admin" :class="routeClass">
		<component :is="layoutComponent">
			<router-view></router-view>
		</component>
	</div>
</template>

<script setup>
import { computed,defineAsyncComponent  } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/index';
import FullLayout from './layouts/FullViewLayout.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'

const VerticalFullLayout = defineAsyncComponent(() => import('./layouts/vertical/FullViewLayout.vue'))
const VerticalDefaultLayout = defineAsyncComponent(() => import('./layouts/vertical/DefaultLayout.vue'))


const { VITE_PROJECT_BASE } = import.meta.env;

document.documentElement.setAttribute('data-theme', 'client')

const store = useAppStore();
/*const layoutComponent = computed(() => {
	alert(store.verticalLayout)
	var layout = (store.user.token == null || store.user.guest == '1' ? FullLayout : ((store.fullview == 1) ? FullLayout : DefaultLayout));
	return layout;
});*/
const layoutComponent = computed(() => {
  const isGuest = store.user.token == null || store.user.guest == '1'
  const useFull = store.fullview == 1

  if (store.verticalLayout) {
    return isGuest || useFull ? VerticalFullLayout : VerticalDefaultLayout
  } else {
    return isGuest || useFull ? FullLayout : DefaultLayout
  }
})

const route = useRoute()

const routeClass = computed(() => {
	return route.name
		? route.name.toLowerCase().replace(/\s+/g, "-")
		: "default-page";
})
</script>
