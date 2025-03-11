import { axiosClient } from '@/composables/axios'

const cache = new Map()

const useApiRequest = () => {
	let link = ''
	const axios = axiosClient
	const formatResponse = res => {
		let out = { data: {}, error: false, message: null }
		if (res.status !== null && res.status == 'error') {
			out.error = true
			out.message = res.message
		} else out.data = res
		return out
	}
	const formatError = error => {
		let msg = error.message
		if (error.response != null) {
			if (error.response.message != null && error.response.message != '')
				msg = error.response.message
			if (
				error.response.data !== null &&
				error.response.data.message != null &&
				error.response.data.message != ''
			)
				msg = error.response.data.message
		}
		return msg
	}
	const fetch = async (url, params = {}) => {
		link = url
		let out = { data: {}, error: false, message: null }

		const urlKey = url + JSON.stringify(params)
		if (cache.has(urlKey)) return cache.get(urlKey)

		try {
			let response = await axiosClient.get(url, params)
			out = formatResponse(response.data)
		} catch (error) {
			out.error = true
			out.message = formatError(error)
		}

		//cache.set(urlKey, out);
		return out
	}
	const post = async (url, params, config = {}) => {
		link = url
		let out = { data: {}, error: false, message: null }
		try {
			let response = await axiosClient.post(url, params, config)
			out = formatResponse(response.data)
		} catch (error) {
			out.error = true
			out.message = formatError(error)
		}
		return out
	}
	const put = async (url, params, config = {}) => {
		link = url
		let out = { data: {}, error: false, message: null }
		try {
			let response = await axiosClient.put(url, params, config)
			out = formatResponse(response.data)
		} catch (error) {
			out.error = true
			out.message = formatError(error)
		}
		return out
	}
	return {
		fetch,
		post,
		put,
		axios,
	}
}
export default useApiRequest
