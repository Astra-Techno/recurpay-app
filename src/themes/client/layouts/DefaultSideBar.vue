<template>
	<div class="text-lg select-none">
		<!-- Logo and Toggle button -->
		<div class="flex items-center mb-6">
			<Icon name="IconMinimal" class="cursor-pointer mr-2" v-if="!isMiniSidebar" @click="toggleMiniSidebar" />

			<h1 class="flex-1 text-l font-black italic pt-1 cursor-pointer " @click="toggleMiniSidebar" v-if="!isMiniSidebar">
				MyProps<span class="text-[8px] flex relative right-[-50px] leading-none w-full text-right">Rent.Pay.Go.</span></h1>

			<Icon name="IconMinimal" class="cursor-pointer" v-if="isMiniSidebar" @click="toggleMiniSidebar" />

			<button @click="toggleMiniSidebar" class="text-xl normal ml-auto p-1">
				<IconLeftArrow v-if="!isMiniSidebar" />
				<IconRightArrow v-else />
			</button>
		</div>

		<RouterLink v-if="extendedStore.user" class="flex items-center mb-6" :to="'/profile'"
			:class="{ 'border-y': !isMiniSidebar, 'py-2': !isMiniSidebar }" @click="toggleDrawer">
			<div class="flex-none">
				<img class="w-10 h-10 rounded border" :src="'/media/' + extendedStore.user.profile_picture_thumb"
					v-default-image alt="Profile-Pic" />
			</div>
			<div v-if="!isMiniSidebar" class="ml-2 w-40">
				<div class="truncate" :title="extendedStore.user.fullname">{{ extendedStore.user.fullname }}</div>
				<div class="text-xs truncate" :title="extendedStore.user.email">{{ extendedStore.user.email }}</div>
			</div>
		</RouterLink>

		<!-- Sidebar content rendered dynamically from routes array -->
		<ul>
			<li v-for="route in routes" :key="route.path" class="text-primary">
				<div v-if="isMiniSidebar">
					<div v-if="route.children"
						class="hover:bg-gray-300 py-2 px-2 flex items-center cursor-pointer relative mini-sidebar-dropdown"
						@click="toggleSubMenu(route)" :title="route.label">
						<Icon :name="route.icon" class="flex-none" />
						<div v-if="expandedMenus.includes(route.path)"
							class="fixed left-[60px] mt-2 bg-white shadow-lg rounded-md z-10">
							<ul>
								<li v-for="child in route.children" :key="child.path">
									<RouterLink :to="child.path" class="hover:bg-gray-200 py-2 px-4 flex items-center">
										<Icon :name="route.icon" v-if="child.icon" class="flex-none" />
										<span class="ml-2">{{ child.label }}</span>
									</RouterLink>
								</li>
							</ul>
						</div>
					</div>
					<RouterLink v-else :title="route.label" :to="route.path"
						class="hover:bg-gray-300 py-2 grid justify-items-center">
						<Icon :name="route.icon" />
					</RouterLink>
				</div>
				<div v-else>
					<div v-if="route.children" class="hover:bg-gray-300 py-2 px-4 flex items-center cursor-pointer"
						@click="toggleSubMenu(route)">
						<Icon :name="route.icon" class="flex-none" />
						<span class="ml-2">{{ route.label }}</span>
						<IconDownArrow v-if="route.children && !expandedMenus.includes(route.path)" class="ml-auto" />
						<IconUpArrow v-if="route.children && expandedMenus.includes(route.path)" class="ml-auto" />
					</div>
					<RouterLink v-else :to="route.path" class="hover:bg-gray-300 py-2 px-4 flex items-center"
						@click="toggleDrawer">
						<Icon :name="route.icon" class="flex-none" />
						<span class="ml-2">{{ route.label }}</span>
					</RouterLink>
					<!-- Sub-menu -->
					<ul v-if="route.children && expandedMenus.includes(route.path)">
						<li v-for="child in route.children" :key="child.path" class="pl-6">
							<RouterLink :to="child.path" class="hover:bg-gray-200 py-2 px-4 flex items-center"
								@click="toggleDrawer">
								<Icon :name="route.icon" v-if="child.icon" class="flex-none" />
								<span class="ml-2">{{ child.label }}</span>
							</RouterLink>
						</li>
					</ul>
				</div>
			</li>
		</ul>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useExtendedStore } from '../stores/extendedStore'
import IconLeftArrow from '../icons/IconLeftArrow.vue'
import IconRightArrow from '../icons/IconRightArrow.vue'
import IconUpArrow from '../icons/IconUpArrow.vue'
import IconDownArrow from '../icons/IconDownArrow.vue'

// Props to control sidebar behavior
const props = defineProps({
	isMiniSidebar: {
		type: Boolean,
		required: true,
	},
	toggleMiniSidebar: {
		type: Function,
		required: true,
	},
	toggleDrawer: {
		type: Function,
		required: false,
	},
})

// Manage expanded sub-menus
const expandedMenus = ref([])

const toggleSubMenu = (route) => {
	if (route.children) {
		const index = expandedMenus.value.indexOf(route.path)
		if (index === -1) {
			if (props.isMiniSidebar) {
				expandedMenus.value = []
			}
			expandedMenus.value.push(route.path)
		} else {
			expandedMenus.value.splice(index, 1)
		}
	}
}

// Close dropdown when clicking outside
const closeDropdown = (event) => {
	if (props.isMiniSidebar) {
		if (!event.target.closest('.mini-sidebar-dropdown')) {
			expandedMenus.value = []
		}
	}
}

// Register event listener
onMounted(() => {
	document.addEventListener('click', closeDropdown)
})

// Cleanup event listener
onUnmounted(() => {
	document.removeEventListener('click', closeDropdown)
})

// Define the routes array with path, label, and component
const routes = [
	{ path: '/dashboard', label: 'Dashboard', icon: 'IconDashboard' },
	{ path: '/users', label: 'Users', icon: 'IconToDo' },
	{ path: '/properties', label: 'Properties', icon: 'IconMaintenance' },
	{ path: '/tenants', label: 'Tenants', icon: 'IconMaintenance' },
	{ path: '/logout', label: 'Logout', icon: 'IconLogout' },
]

const extendedStore = useExtendedStore()
</script>
