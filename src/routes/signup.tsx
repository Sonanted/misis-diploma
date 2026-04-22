import { createRoute } from '@tanstack/react-router';

import { SignupForm } from '@/components/signup-form';

import { unauthRoute } from './unauth';

export const signupRoute = createRoute({
	getParentRoute: () => unauthRoute,
	path: '/signup',
	component: SignupForm,
});
