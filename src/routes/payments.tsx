import { createRoute } from '@tanstack/react-router';

import Payments from '../pages/Payments/Payments';

import { protectedRoute } from './protected';

export const paymentsRoute = createRoute({
	getParentRoute: () => protectedRoute,
	path: '/payments',
	component: Payments,
});
