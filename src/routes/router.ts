import { createRouter } from '@tanstack/react-router';

import { dashboardRoute } from './dashboard';
import { loginRoute } from './login';
import { operationsRoute } from './operations';
import { paymentsRoute } from './payments';
import { profileRoute } from './profile';
import { protectedRoute } from './protected';
import { rootRoute } from './root';
import { signupRoute } from './signup';
import { unauthRoute } from './unauth';

protectedRoute.addChildren([dashboardRoute, operationsRoute, paymentsRoute, profileRoute]);

unauthRoute.addChildren([loginRoute, signupRoute]);

const routeTree = rootRoute.addChildren([unauthRoute, protectedRoute]);

export const router = createRouter({
	routeTree,
});
