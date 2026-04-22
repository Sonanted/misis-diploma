import { createRoute } from '@tanstack/react-router';

import Profile from '../pages/Profile/Profile';

import { protectedRoute } from './protected';

export const profileRoute = createRoute({
	getParentRoute: () => protectedRoute,
	path: '/profile',
	component: Profile,
});
