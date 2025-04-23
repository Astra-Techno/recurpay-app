<template>
	<div class="flex h-screen w-full md:w-3/12 mx-auto bg-white dark:bg-gray-900">
		<!-- Main Content -->
		<div class="flex-1 flex flex-col overflow-hidden">

			<!-- Navigation Bar -->
			<NavigationBar>
				<template #flex-items>
					<MobileHeader />
				</template>
			</NavigationBar>

			<!-- Scrollable Content Area (scroll enabled, scrollbar hidden) -->
			<div class="flex-1 overflow-y-scroll hide-scrollbar relative bg-gray-100 text-gray-800 rounded-t-2xl"
				:class="[isDashboard ? 'top-0' : '-top-10 z-20']">
				<slot />
			</div>

			<!-- Bottom Navigation for Mobile -->
			<BottomNav v-if="deviceStore.isMobile" :showBackButton="showBackButton" :toggleDrawer="toggleDrawer" />
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
import BottomNav from '../layouts/BottomNav.vue'
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

const isDashboard = computed(() => route.path === '/dashboard')
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

/* Hide scrollbar but keep scrolling */
.hide-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
