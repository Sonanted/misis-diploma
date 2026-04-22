import { createRoute } from '@tanstack/react-router';

import Operations from '../pages/Operations/Operations';

import { protectedRoute } from './protected';

export const operationsRoute = createRoute({
	getParentRoute: () => protectedRoute,
	path: '/operations',
	component: Operations,
});
