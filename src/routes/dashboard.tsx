import { createRoute } from '@tanstack/react-router';

import Dashboard from '../pages/Dashboard/Dashboard';

import { protectedRoute } from './protected';

export const dashboardRoute = createRoute({
	getParentRoute: () => protectedRoute,
	path: '/',
	component: Dashboard,
});
