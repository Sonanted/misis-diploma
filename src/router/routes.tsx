import { Route } from 'react-router';

import PrivateLayout from '@/components/layouts/private-layout';
import PublicLayout from '@/components/layouts/public-layout';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Login from '@/pages/Login/Login';
import Operations from '@/pages/Operations/Operations';
import Payments from '@/pages/Payments/Payments';
import Signup from '@/pages/Signup/Signup';

import PrivateRoute from './guards/PrivateRoute';
import PublicRoute from './guards/PublicRoute';

export const routes = (
	<>
		<Route element={<PublicRoute />}>
			<Route element={<PublicLayout />}>
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="*" element={<Login />} />
			</Route>
		</Route>
		<Route element={<PrivateRoute />}>
			<Route element={<PrivateLayout />}>
				<Route path="/" element={<Dashboard />} />
				<Route path="/operations" element={<Operations />} />
				<Route path="/payments" element={<Payments />} />
				<Route path="*" element={<Dashboard />} />
			</Route>
		</Route>
	</>
);
