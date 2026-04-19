import { createRoute } from '@tanstack/react-router';

import Payments from '../pages/Payments/Payments';

import { rootRoute } from './root';

export const paymentsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/payments',
	component: Payments,
});
