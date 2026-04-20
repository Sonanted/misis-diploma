import { createRoute } from '@tanstack/react-router';

import Profile from '../pages/Profile/Profile';

import { rootRoute } from './root';

export const profileRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/profile',
	component: Profile,
});
