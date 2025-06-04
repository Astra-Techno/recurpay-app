<template>
	<!-- Screen loader -->
	<div>
		<div v-if="isLoading"
			class="fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[1] grid place-content-center animate__animated">
			<SimpleLoader></SimpleLoader>
		</div> 

		<!--<SkeletonLoader v-if="isLoading" :count="3" class="px-4 pb-4" /> -->
		<component v-if="PageComp" :is="PageComp" />
	</div>
</template>

<script lang="ts" setup>
import { watch, ref, shallowRef, provide } from 'vue';
import { useAppStore } from '@/stores/index';
import { useMeta } from '@/composables/use-meta';
import { useRoute, useRouter } from 'vue-router';
import useApiRequest from '@/composables/request';
import SimpleLoader from '@/components/elements/SimpleLoader.vue'


const route = useRoute();
const router = useRouter();
const store = useAppStore();
const request = useApiRequest();

const PageComp = shallowRef<Component | null>(null);
const isLoading = ref(false);
const moduleCache = new Map<string, Component>(); // Use Map for better caching
const views = import.meta.glob('../views/**/*.vue');

// Create a reactive query params variable & provide globally
const queryParamsRef = ref<string[]>([]);
provide('QueryParams', queryParamsRef);

// Function to extract path and query parameters (IDs) from URL
const normalizePageName = (pageName: string | null): { path: string; queryParams: string[] } => {
	if (!pageName) return { path: '', queryParams: [] };

	const segments = pageName.split('/');
	const pathSegments: string[] = [];
	const queryParams: string[] = [];

	segments.forEach((segment) => {
		if (/^\d+$/.test(segment)) {
			queryParams.push(segment); // Store numbers as query params
		} else {
			pathSegments.push(segment); // Store other segments as path
		}
	});

	return { path: pathSegments.join('/'), queryParams };
};

// Function to handle guest token generation
const handleGuestToken = async () => {
	const response = await request.post('/guest-token');
	if (response.error) {
		router.push('/login');
		return false;
	}
	store.setUser(response.data.user);
	store.setToken(response.data.token);
	store.setGuest('1');
	return true;
};

// Function to load components dynamically (with caching)
const loadComponent = async (pageName: string, queryParams: string[]) => {
	try {
		PageComp.value = null;
		isLoading.value = true;

		// Generate a unique cache key using path + query params
		const cacheKey = `${pageName}?${queryParams.join('&')}`;

		// Check if the component is already cached
		if (moduleCache.has(cacheKey)) {
			PageComp.value = moduleCache.get(cacheKey);
			return;
		}

		// Dynamically load component
		const componentPath = `./${pageName}.vue`;
		if (!views[componentPath]) {
			console.warn(`Component not found: ${componentPath}`);
			router.push('/error404');
			return;
		}

		const module = await views[componentPath]();
		moduleCache.set(cacheKey, module.default); // Cache the component
		PageComp.value = module.default;
	} catch (error) {
		console.error('Error loading component:', error);
		router.push('/error404');
	} finally {
		store.isShowMainLoader = false
		isLoading.value = false;
		setTimeout(() => store.toggleComponent(true), 500); // Smooth transition
	}
};

// Watch for full route path changes
watch(
	() => route.fullPath, // Watch full path (includes IDs in URL)
	async () => {
		const pageName = route.params.pageName as string;
		const { path, queryParams } = normalizePageName(pageName);

		// Update queryParamsRef (reactive)
		queryParamsRef.value = queryParams;

		// Redirect to dashboard if logged in and trying to access login
		if (store.user.guest != '1' && store.user.token && (!path || path === 'login')) {
			router.push('/dashboard');
			return;
		}

		// Handle guest users
		if (!store.user.token && store.guestPages.indexOf(path) === -1) {
			const tokenGenerated = await handleGuestToken();
			if (!tokenGenerated) return;
		}

		// Prevent guests from accessing restricted pages
		if (store.user.guest === '1' && store.guestPages.indexOf(path) === -1 && path !== 'login') {
			store.setUser(null);
			store.setToken(null);
			router.push('/login');
			return;
		}

		// Load the component dynamically
		await loadComponent(path, queryParams);
	},
	{ immediate: true }
);

useMeta({ title: 'MyProperties' });
</script>
