import { RouterProvider } from '@tanstack/react-router';

import { router } from './routes/router';

const App = () => {
	return <RouterProvider router={router} />;
	// return (
	// 	<BrowserRouter>
	// 		<Header></Header>
	// 		<AppRouter></AppRouter>
	// 	</BrowserRouter>
	// );
};

export default App;
