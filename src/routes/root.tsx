import { createRootRoute } from '@tanstack/react-router';

import { Layout } from '@/components/layout';

export const rootRoute = createRootRoute({
	component: Layout,
});
