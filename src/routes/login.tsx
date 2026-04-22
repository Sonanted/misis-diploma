import { createRoute } from '@tanstack/react-router';

import { LoginForm } from '@/components/login-form';

import { unauthRoute } from './unauth';

export const loginRoute = createRoute({
	getParentRoute: () => unauthRoute,
	path: '/login',
	component: LoginForm,
});
