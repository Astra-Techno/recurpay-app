<template>
	<div class="flex h-screen">
		<!-- Main Content -->
		<div class="flex-1 flex flex-col" :class="[!deviceStore.isMobile ? 'overflow-y-auto' : '']">
			<!-- Navigation Bar -->
			<NavigationBar>
				<template #flex-items>
					<div v-if="deviceStore.isMobile" class="flex-none w-11">
						<button @click="toggleDrawer" class="flex items-center normal">
							<IconOPWhite />
							<IconRightArrow class="text-white" />
						</button>
					</div>
					<div class="flex-1">

					</div>
					<div class="flex-none w-8">
						<button class="text-white opacity-50">
							<IconBell />
						</button>
					</div>
				</template>
			</NavigationBar>

			<!-- Main content -->
			<div class="container px-12 sm:px-6 lg:px-8 main relative"
				>
				<slot />
			</div>

			<!-- Footer -->
			 <Footer />
		</div>
	</div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch, computed } from 'vue'
import { useAppStore } from '@/stores/index'
import { useExtendedStore } from '../../stores/extendedStore'
import { storeToRefs } from 'pinia'
import { useUIPreferencesStore } from '../../stores/uiPreferences'
import { useDeviceStore } from '../../stores/useDeviceStore'

import NavigationBar from './NavigationBar.vue'
import Footer from './FooterNav.vue'
import IconBell from '../../icons/IconBell.vue'
import IconOPWhite from '../../icons/IconOPWhite.vue'
import IconRightArrow from '../../icons/IconRightArrow.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const appStore = useAppStore()
const extendedStore = useExtendedStore()
const { user, loading } = storeToRefs(extendedStore)
const prefStore = useUIPreferencesStore()
const isMiniSidebar = ref(prefStore.isMiniSidebar)
const drawerOpen = ref(false)
const showBackButton = computed(() => route.path !== "/dashboard")

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
	box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.4);
	position: sticky;
	top: 0;
	/*z-index: 999;*/
}

.side-bar.w-20 {
	box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.4);
}
</style>
