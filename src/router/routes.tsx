import { Route } from 'react-router';

import { Layout } from '@/components/layout';
import UnauthLayout from '@/components/unauth-layout';
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
			<Route element={<UnauthLayout />}>
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="*" element={<Login />} />
			</Route>
		</Route>
		<Route element={<PrivateRoute />}>
			(
			<Route element={<Layout />}>
				<Route path="/" element={<Dashboard />} />
				<Route path="/operations" element={<Operations />} />
				<Route path="/payments" element={<Payments />} />
				<Route path="*" element={<Dashboard />} />
			</Route>
			);
		</Route>
	</>
);
