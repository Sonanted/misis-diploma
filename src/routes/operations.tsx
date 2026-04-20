import { createRoute } from '@tanstack/react-router';

import Operations from '../pages/Operations/Operations';

import { rootRoute } from './root';

export const operationsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/operations',
	component: Operations,
});
