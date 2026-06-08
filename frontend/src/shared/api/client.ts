import axios from 'axios';

// Imported lazily to avoid circular dependency with the store
const getToken = () => {
	try {
		const raw = localStorage.getItem('auth');
		if (!raw) return null;
		const parsed = JSON.parse(raw) as { state?: { token?: string } };
		return parsed.state?.token ?? null;
	} catch {
		return null;
	}
};

export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use((config) => {
	const token = getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			const url = error.config?.url ?? '';
			if (!url.includes('/auth/')) {
				localStorage.removeItem('auth');
				window.location.href = '/login';
			}
		}
		return Promise.reject(error);
	},
);
