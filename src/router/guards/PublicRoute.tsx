import { Navigate, Outlet } from 'react-router';

import { useAuth } from '@/hooks/use-auth';

export default function PublicRoute() {
	const auth = useAuth();

	return !auth ? <Outlet /> : <Navigate to="/" />;
}
