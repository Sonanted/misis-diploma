import { createBrowserRouter, Navigate } from 'react-router';
import Cards from '@/pages/cards';
import Dashboard from '@/pages/dashboard';
import ForgotPassword from '@/pages/forgot-password';
import Login from '@/pages/login';
import Operations from '@/pages/operations';
import Payments from '@/pages/payments';
import Profile from '@/pages/profile';
import Signup from '@/pages/signup';
import { AccountDetail } from '@/widgets/account-detail';
import { AccountsList } from '@/widgets/accounts-list';
import { CardDetail } from '@/widgets/card-detail';
import { CardsList } from '@/widgets/cards-list';
import { OperationDetail } from '@/widgets/operation-detail';
import { OperationsList } from '@/widgets/operations-list';
import { NewPayment } from '@/widgets/payment-form';
import { AccountBreadcrumb, CardBreadcrumb } from './breadcrumbs';
import PrivateLayout from '../layouts/private-layout';
import PublicLayout from '../layouts/public-layout';
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
								handle: { breadcrumb: 'sidebar.dashboard' },
							},
							{
								path: 'accounts',
								handle: { breadcrumb: 'accounts.title' },
								children: [
									{
										index: true,
										element: <Navigate to="/" replace />,
									},
									{
										path: ':id',
										element: <AccountDetail />,
										handle: { breadcrumb: ({ params }) => <AccountBreadcrumb id={params.id} /> },
									},
								],
							},
						],
					},
					{
						path: 'cards',
						element: <Cards />,
						handle: { breadcrumb: 'sidebar.cards' },
						children: [
							{
								index: true,
								element: <CardsList />,
							},
							{
								path: ':id',
								element: <CardDetail />,
								handle: { breadcrumb: ({ params }: { params: Record<string, string | undefined> }) => <CardBreadcrumb id={params.id} /> },
							},
						],
					},
					{
						path: 'operations',
						element: <Operations />,
						handle: { breadcrumb: 'sidebar.operations' },
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
						handle: { breadcrumb: 'sidebar.payments' },
						children: [
							{
								index: true,
								element: <NewPayment />,
							},
						],
					},
					{
						path: 'settings',
						element: <Profile />,
						handle: { breadcrumb: 'settings.title' },
					},
					{ path: '*', element: <Navigate to="/" replace /> },
				],
			},
		],
	},
]);
