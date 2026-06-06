import { RouterProvider } from 'react-router';
import { Toaster } from '@/shared/ui/sonner';
import { router } from './routes';

export function AppRouter() {
	return (
		<>
			<RouterProvider router={router} />
			<Toaster />
		</>
	);
}
