import { Navigate, Outlet, useLocation } from 'react-router';

import { useAuth } from '@/entities/user/use-auth';

export default function PrivateRoute() {
	const auth = useAuth();
	const location = useLocation();

	return auth ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}
