import { Navigate, createBrowserRouter } from 'react-router';

import PrivateLayout from '@/components/layouts/private-layout';
import PublicLayout from '@/components/layouts/public-layout';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Login from '@/pages/Login/Login';
import Operations from '@/pages/Operations/Operations';
import Payments from '@/pages/Payments/Payments';
import Signup from '@/pages/Signup/Signup';

import PrivateRoute from './guards/PrivateRoute';
import PublicRoute from './guards/PublicRoute';
import { CreateAccountForm } from '@/components/account-create-form';

export const router = createBrowserRouter([
	{
		element: <PublicRoute />,
		children: [
			{
				element: <PublicLayout />,
				children: [
					{ path: '/login', element: <Login /> },
					{ path: '/signup', element: <Signup /> },
					{ path: '*', element: <Navigate to="/login" replace /> },
				],
			},
		],
	},

	{
		element: <PrivateRoute />,
		children: [
			{
				element: <PrivateLayout />,
				children: [
					{
						index: true,
						element: <Dashboard />,
						handle: { breadcrumb: 'Dashboard' },
					},
					{
						path: 'operations',
						element: <Operations />,
						handle: { breadcrumb: 'Operations' },
					},
					{
						path: 'payments',
						element: <Payments />,
						handle: { breadcrumb: 'Payments' },
					},
					{ path: '*', element: <Navigate to="/" replace /> },
					
				],
			},
		],
	},
]);
