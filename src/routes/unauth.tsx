import { createRoute } from '@tanstack/react-router';

import UnauthLayout from '@/components/unauth-layout';

import { rootRoute } from './root';

export const unauthRoute = createRoute({
	getParentRoute: () => rootRoute,
	id: 'unauth',
	component: UnauthLayout,
});
