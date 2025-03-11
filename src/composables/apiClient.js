import axios from "axios";
import useApiRequest from '@/composables/request'

const createApiClient = (context) => {
	// Init vars
	const apiRequest = useApiRequest();
	let baseURL = localStorage.getItem(`${context}-baseURL`);
	let token = localStorage.getItem(`${context}-token`);
	let tokenExpiry = localStorage.getItem(`${context}-tokenExpiry`);

	// Function to set token and expiry
	const setToken = (siteURL, accessToken, expiresIn) => {
		baseURL = siteURL;
		token = accessToken;
		expiresIn = 30;
		tokenExpiry = new Date().getTime() + expiresIn * 1000;
		localStorage.setItem(`${context}-baseURL`, baseURL);
		localStorage.setItem(`${context}-token`, token);
		localStorage.setItem(`${context}-tokenExpiry`, tokenExpiry);
	};
	
	// Function to check if token is expired
	const isTokenExpired = () => !baseURL || !token || isNaN(tokenExpiry) || new Date().getTime() > tokenExpiry;
	
	// Function to request a new token
	const fetchToken = async () => {
		try {
			const response = await apiRequest.post('task/users/getSiteAccessToken', { 'alias': context });
			if (response.error) {
				throw new Error(response.message);
			}
			if (!response.data || !response.data.site_url || !response.data.access_token || !response.data.expires_in) {
				throw new Error('Invalid token response');
			}
			const { site_url: siteURL, access_token: accessToken, expires_in: expiresIn } = response.data;
			setToken(siteURL, accessToken, expiresIn);
			return { siteURL, accessToken };
		} catch (error) {
			console.error('Error fetching token:', error);
			throw error;
		}
	};

	// Create axios instance
	const instance = axios.create({
		headers: {
			'Content-Type': 'application/json'
		}
	});
	
	// Request interceptor to add token to headers
	instance.interceptors.request.use(
		async (config) => {
			if (!isTokenExpired()) {
				config.baseURL = baseURL;
				config.headers.Authorization = `Bearer ${token}`;
			} else {
				const { siteURL, accessToken } = await fetchToken();
				config.baseURL = siteURL;
				config.headers.Authorization = `Bearer ${accessToken}`;
			}
			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);
	
	// Response interceptor to handle token expiry or errors
	instance.interceptors.response.use(
		(response) => response,
		async (error) => {
			const originalRequest = error.config;
			if (error.response && error.response.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true;
				const { siteURL, accessToken } = await fetchToken();
				originalRequest.baseURL = siteURL;
				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				return instance(originalRequest);
			}
			if (error.response && error.response.data) {
				if (error.response.data.error && error.response.data.error_description)
					error.message = error.response.data.error + ': ' + error.response.data.error_description;
			}
			return Promise.reject(error);
		}
	);
	
	return instance;
}

export default createApiClient;