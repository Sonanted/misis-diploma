import { createRouter } from '@tanstack/react-router';

import { dashboardRoute } from './dashboard';
import { operationsRoute } from './operations';
import { paymentsRoute } from './payments';
import { profileRoute } from './profile';
import { rootRoute } from './root';

const routeTree = rootRoute.addChildren([
	dashboardRoute,
	operationsRoute,
	paymentsRoute,
	profileRoute,
]);

export const router = createRouter({
	routeTree,
});
