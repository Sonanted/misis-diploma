import { createRoute, redirect } from '@tanstack/react-router';

import { Layout } from '@/components/layout';

import { rootRoute } from './root';

export const protectedRoute = createRoute({
	getParentRoute: () => rootRoute,
	id: 'protected',
	component: Layout,
	beforeLoad: () => {
		const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
		// if (!token) {
		// 	throw redirect({ to: '/login' });
		// }
		return {};
	},
});
