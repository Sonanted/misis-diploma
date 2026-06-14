import { useAuthStore } from './model';

function isTokenExpired(token: string): boolean {
	try {
		const payload = JSON.parse(atob(token.split('.')[1])) as { exp?: number };
		return typeof payload.exp === 'number' && payload.exp * 1000 < Date.now();
	} catch {
		return true;
	}
}

export function useAuth() {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const token = useAuthStore((s) => s.token);
	const logout = useAuthStore((s) => s.logout);

	if (isAuthenticated && token && isTokenExpired(token)) {
		logout();
		return false;
	}

	return isAuthenticated;
}
