import { Route, Routes } from 'react-router';

import Dashboard from './pages/Dashboard/Dashboard';
import Operations from './pages/Operations/Operations';
import Payments from './pages/Payments/Payments';
import Profile from './pages/Profile/Profile';

const AppRouter = () => {
	return (
		<Routes>
			<Route path="/" element={<Dashboard />} />
			<Route path="/operations" element={<Operations />} />
			<Route path="/payments" element={<Payments />} />
			<Route path="/profile" element={<Profile />} />
		</Routes>
	);
};

export default AppRouter;
