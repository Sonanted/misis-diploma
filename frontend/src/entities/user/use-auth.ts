import { useAuthStore } from './model';

export function useAuth() {
	return useAuthStore((state) => state.isAuthenticated);
}
