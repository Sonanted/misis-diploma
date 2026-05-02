import { BrowserRouter, Routes } from 'react-router';

import { routes } from './routes';

export function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>{routes}</Routes>
		</BrowserRouter>
	);
}
