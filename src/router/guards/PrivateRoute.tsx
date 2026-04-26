import { Navigate, Outlet } from 'react-router';

import { useAuth } from '@/hooks/use-auth';

export default function PrivateRoute() {
	const auth = useAuth();

	return auth ? <Outlet /> : <Navigate to="/login" />;
}
