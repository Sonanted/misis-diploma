import axios from 'axios';

export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true, // send httpOnly cookie on every request
});

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			const url = error.config?.url ?? '';
			// /auth/* and /users/me are allowed to return 401 without redirect:
			// auth endpoints handle their own errors, /users/me 401 means "not logged in"
			const isAuthEndpoint = url.includes('/auth/');
			const isMeEndpoint = url.endsWith('/users/me');
			if (!isAuthEndpoint && !isMeEndpoint) {
				window.location.href = '/login';
			}
		}
		return Promise.reject(error);
	},
);
