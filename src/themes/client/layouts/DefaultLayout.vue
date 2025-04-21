<template>
	<div class="flex h-screen w-3/12 mx-auto bg-white dark:bg-gray-900">
		<!-- Sidebar -->
		<div v-if="!deviceStore.isMobile" :class="[
			'side-bar',
			'duration-300',
			'ease-in-out',
			'border-r',
			'p-5',
			'flex-shrink-0 z-1 shadow-md',
			'overflow-x-hidden',
			'overflow-y-auto',
			isMiniSidebar ? 'w-20' : 'w-64',
		]" style="scrollbar-width: thin;">
			<DefaultSideBar :isMiniSidebar="isMiniSidebar" :toggleMiniSidebar="toggleMiniSidebar" />
		</div>

		<!-- Drawer for Mobile -->
		<transition name="slide" v-if="deviceStore.isMobile">
			<div v-if="drawerOpen" class="relative z-[1000]">
				<div :class="[
					'fixed',
					'top-0',
					'left-0',
					'h-full',
					'w-56',
					'bg-white',
					'shadow-lg',
					'z-50',
					'border-r-2',
					'p-5',
					'overflow-x-hidden',
					'overflow-y-auto',
					'transition-transform', // Ensure smooth transition for transform
					drawerOpen
						? 'translate-x-0 opacity-100'
						: '-translate-x-full opacity-0',
				]">
					<DefaultSideBar :isMiniSidebar="false" :toggleMiniSidebar="toggleDrawer"
						:toggleDrawer="toggleDrawer" />
				</div>
				<div class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
					:class="{
						'opacity-100': drawerOpen,
						'opacity-0': !drawerOpen,
					}" @click="toggleDrawer"></div>
			</div>
		</transition>

		<!-- Main Content -->
		<div class="flex-1 flex flex-col"  :class="[!deviceStore.isMobile ? 'overflow-y-auto' : '']">
			<!-- Navigation Bar -->
			<NavigationBar>
				<template #flex-items>
					<MobileHeader />
				</template>
			</NavigationBar>

			<!-- Main content -->
			<div class=" flex-1 main relative" :class="[!deviceStore.isMobile ? 'overflow-y-auto' : '']">
				<slot />
			</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch, computed } from 'vue'
import { useAppStore } from '@/stores/index'
import { useExtendedStore } from '../stores/extendedStore'
import { storeToRefs } from 'pinia'
import { useUIPreferencesStore } from '../stores/uiPreferences'
import { useDeviceStore } from '../stores/useDeviceStore'
import DefaultSideBar from './DefaultSideBar.vue'
import NavigationBar from '../layouts/NavigationBar.vue'
import { User, LogOut } from 'lucide-vue-next';
import { useRoute } from 'vue-router'
import { useCurrentTitle } from '@/composables/use-meta';
import MobileHeader from '../layouts/MobileHeader.vue'

const route = useRoute()
const appStore = useAppStore()
const extendedStore = useExtendedStore()
const { user, loading } = storeToRefs(extendedStore)
const prefStore = useUIPreferencesStore()
const isMiniSidebar = ref(prefStore.isMiniSidebar)
const drawerOpen = ref(false)
const showBackButton = computed(() => route.path !== "/dashboard")

const title = useCurrentTitle()

const toggleMiniSidebar = () => {
	isMiniSidebar.value = !isMiniSidebar.value
	prefStore.toggleMiniSidebar()
}

const toggleDrawer = () => {
	drawerOpen.value = !drawerOpen.value
}

const deviceStore = useDeviceStore()

watch(
	() => deviceStore.isMobile,
	(newValue, oldValue) => {
		console.log(`isMobile changed from ${oldValue} to ${newValue}`)
		if (!deviceStore.isMobile) {
			drawerOpen.value = false // Close the drawer if not in mobile view
		}
	},
)

const currentAccount = ref(extendedStore.currentAccount)
const isDropdownOpen = ref(false)
const toggleDropdown = () => {
	isDropdownOpen.value = !isDropdownOpen.value
}

const dropdownRef = ref(null)

// Close dropdown when clicking outside
const closeDropdown = (event) => {
	if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
		isDropdownOpen.value = false
	}
}

onMounted(() => {
	document.addEventListener('click', closeDropdown)
	appStore.toggleMainLoader()
})

onUnmounted(() => {
	document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
	transition:
		transform 0.3s ease-in-out,
		opacity 0.3s ease-in-out;
	/* Smooth transition */
}

.slide-enter {
	transform: translateX(-100%);
	/* Start from left */
	opacity: 0;
	/* Start invisible */
}

.slide-leave-active {
	transform: translateX(-100%);
	/* Move to left */
	opacity: 0;
	/* Fade out */
}

.slide-leave-to {
	transform: translateX(-100%);
	/* Ensure it leaves to the left */
	opacity: 0;
	/* Ensure it fades out */
}

nav {
	/*box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.4);*/
	position: sticky;
	top: 0;
	/*z-index: 999;*/
}

.side-bar.w-20 {
	box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.4);
}
</style>
