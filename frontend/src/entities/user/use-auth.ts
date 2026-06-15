import { useMe } from './queries';

export function useAuth() {
	const { data, isLoading } = useMe();
	return { isAuthenticated: !!data, isLoading };
}
