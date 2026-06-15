import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/entities/user/use-auth';

export default function PublicRoute() {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) return null;

	return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}
