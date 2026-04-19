import { Outlet, createRootRoute } from '@tanstack/react-router';

import Header from '@/components/Header/Header';

export const rootRoute = createRootRoute({
	component: () => (
		<>
			<Header></Header>
			<Outlet />
		</>
	),
});
