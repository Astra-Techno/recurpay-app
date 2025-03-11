import { ref, onMounted, watch } from 'vue'
import useApiRequest from '@/composables/request'

const useListing = (
	url,
	filters = {},
	defaultPerPage = 10,
	isPagination = true,
	errorHandler = null,
) => {
	const { fetch } = useApiRequest()

	// State variables
	const items = ref([])
	const loading = ref(false)
	const currentPage = ref(1)
	const totalPages = ref(1)
	const totalItems = ref(0)
	const hasMore = ref(true) // For load more functionality
	const offset = ref(0) // For load more functionality (or starting point for pagination)
	const perPage = ref(defaultPerPage)

	// Per page options (could be customized)
	const perPageOptions = [10, 20, 50]

	// Create a unique key for sessionStorage based on the current URL and the given URL
	const getUniqueStorageKey = () => {
		return `use-listing-state-${encodeURIComponent(window.location.href)}-${encodeURIComponent(url)}`
	}

	// Load persisted state from sessionStorage (if available)
	const loadStateFromSessionStorage = () => {
		const savedState = JSON.parse(
			sessionStorage.getItem(getUniqueStorageKey()),
		)
		if (savedState) {
			currentPage.value = savedState.currentPage || 1
			perPage.value = savedState.perPage || defaultPerPage
			offset.value = savedState.offset || 0
			filters = savedState.filters || filters
		}
	}

	// Persist state to sessionStorage
	const saveStateToSessionStorage = () => {
		const state = {
			currentPage: currentPage.value,
			perPage: perPage.value,
			offset: offset.value,
			filters: filters,
		}
		sessionStorage.setItem(getUniqueStorageKey(), JSON.stringify(state))
	}

	// Watch state changes and persist to sessionStorage
	const watchArray = [currentPage, perPage, offset]
	// Only add filters to the watch array if it's a valid ref or reactive object
	if (filters.value) {
		watchArray.push(filters)
	}
	watch(watchArray, saveStateToSessionStorage)

	// Build request params dynamically
	const buildParams = () => {
		return {
			...filters,
			per_page: perPage.value,
			page: isPagination ? currentPage.value : undefined,
			offset: !isPagination ? offset.value : undefined, // Use offset for load more
		}
	}

	// Fetch items from the API
	const fetchItems = async () => {
		loading.value = true
		const params = buildParams()
		const { data, error, message } = await fetch(url, { params })

		if (!error) {
			totalItems.value = data.total || 0
			if (isPagination) {
				// For pagination, update the items and total pages
				items.value = data.data || []
				totalPages.value = data.last_page || 1
			} else {
				// For load more, append new items and check if there are more to load
				items.value = [...items.value, ...(data.data || [])]
				hasMore.value = items.value.length < data.total
			}
		} else {
			if (errorHandler) {
				errorHandler(message) // Call the error handler passed from the parent
			} else {
				console.error(message)
			}
		}
		loading.value = false
	}

	// Handle next page navigation
	const nextPage = () => {
		if (currentPage.value < totalPages.value) {
			currentPage.value++
			fetchItems()
		}
	}

	// Handle previous page navigation
	const prevPage = () => {
		if (currentPage.value > 1) {
			currentPage.value--
			fetchItems()
		}
	}

	// Handle changing the number of items per page
	const changePerPage = newPerPage => {
		perPage.value = newPerPage
		currentPage.value = 1 // Reset to the first page when per_page changes
		fetchItems()
	}

	// Load more items for the load more functionality
	const loadMore = () => {
		if (hasMore.value && !loading.value) {
			offset.value += perPage.value // Increment offset for the next set of data
			fetchItems()
		}
	}

	// Apply filters and reset pagination or load more
	const applyFilters = newFilters => {
		filters = newFilters
		currentPage.value = 1 // Reset to first page when filters change
		offset.value = 0 // Reset offset for load more
		fetchItems()
	}

	// Generate page numbers with ellipses (`...`) where necessary for pagination
	const pageNumbers = () => {
		const pages = []
		const range = 4
		let startPage = Math.max(currentPage.value - range, 1)
		let endPage = Math.min(currentPage.value + range, totalPages.value)

		if (startPage > 1) pages.push(1)
		if (startPage > 2) pages.push('...')

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i)
		}

		if (endPage < totalPages.value - 1) pages.push('...')
		if (endPage < totalPages.value) pages.push(totalPages.value)

		return pages
	}

	// Go to a specific page number
	const goToPage = page => {
		if (page !== '...') {
			// Avoid changing page for ellipsis
			currentPage.value = page
			fetchItems()
		}
	}

	// Load persisted state when the component is mounted
	onMounted(() => {
		loadStateFromSessionStorage()
		//fetchItems()
	})

	return {
		items,
		loading,
		currentPage,
		totalPages,
		totalItems,
		hasMore,
		perPage,
		perPageOptions,
		fetchItems,
		nextPage,
		prevPage,
		loadMore,
		applyFilters,
		pageNumbers,
		goToPage,
		changePerPage,
	}
}

export default useListing
