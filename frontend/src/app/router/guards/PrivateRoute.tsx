import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '@/entities/user/use-auth';

export default function PrivateRoute() {
	const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) return null;

	return isAuthenticated
		? <Outlet />
		: <Navigate to="/login" replace state={{ from: location }} />;
}
