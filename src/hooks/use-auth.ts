export function useAuth() {
	const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
	return {
		isAuthenticated: Boolean(token),
		token,
	};
}
