import { createBrowserRouter, Navigate } from 'react-router';
import { AccountDetail } from '@/components/accounts/account-detail';
import { AccountsList } from '@/components/accounts/accounts-list';
import { CardDetail } from '@/components/cards/card-detail';
import { CardsList } from '@/components/cards/cards-list';
import PrivateLayout from '@/components/layouts/private-layout';
import PublicLayout from '@/components/layouts/public-layout';
import { OperationDetail } from '@/components/operations/operation-detail';
import { OperationsList } from '@/components/operations/operations-list';
import { NewPayment } from '@/components/payment/new-payment';
import Cards from '@/pages/Cards/Cards';
import Dashboard from '@/pages/Dashboard/Dashboard';
import ForgotPassword from '@/pages/ForgotPassword/ForgotPassword';
import Login from '@/pages/Login/Login';
import Operations from '@/pages/Operations/Operations';
import Payments from '@/pages/Payments/Payments';
import Profile from '@/pages/Profile/Profile';
import Signup from '@/pages/Signup/Signup';
import PrivateRoute from './guards/PrivateRoute';
import PublicRoute from './guards/PublicRoute';

export const router = createBrowserRouter([
	{
		element: <PublicRoute />,
		children: [
			{
				element: <PublicLayout />,
				children: [
					{ path: '/login', element: <Login /> },
					{ path: '/signup', element: <Signup /> },
					{ path: '/forgot-password', element: <ForgotPassword /> },
					{ path: '/login', element: <Login /> },
					{ path: '/signup', element: <Signup /> },
					{ path: '/forgot-password', element: <ForgotPassword /> },
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
						path: '',
						element: <Dashboard />,
						children: [
							{
								index: true,
								element: <AccountsList />,
								handle: { breadcrumb: 'Dashboard' },
							},
							{
								path: 'accounts',
								handle: { breadcrumb: 'Accounts' },
								children: [
									{
										index: true,
										element: <Navigate to="/" replace />,
									},
									{
										path: ':id',
										element: <AccountDetail />,
										handle: { breadcrumb: ({ params }) => params.id },
									},
								],
							},
						],
					},
					{
						path: 'cards',
						element: <Cards />,
						handle: { breadcrumb: 'Cards' },
						children: [
							{
								index: true,
								element: <CardsList />,
							},
							{
								path: ':id',
								element: <CardDetail />,
								handle: { breadcrumb: ({ params }) => params.id },
							},
						],
					},
					{
						path: 'operations',
						element: <Operations />,
						handle: { breadcrumb: 'Operations' },
						children: [
							{
								index: true,
								element: <OperationsList />,
							},
							{
								path: ':id',
								element: <OperationDetail />,
								handle: { breadcrumb: ({ params }) => params.id },
							},
						],
					},
					{
						path: 'payments',
						element: <Payments />,
						handle: { breadcrumb: 'Payments' },
						children: [
							{
								index: true,
								element: <NewPayment />,
							},
						],
					},
					{
						path: 'profile',
						element: <Profile />,
						handle: { breadcrumb: 'Profile' },
					},
					{ path: '*', element: <Navigate to="/" replace /> },
				],
			},
		],
	},
]);
