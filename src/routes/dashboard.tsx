import { createRoute } from '@tanstack/react-router';

import Dashboard from '../pages/Dashboard/Dashboard';

import { rootRoute } from './root';

export const dashboardRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/',
	component: Dashboard,
});
