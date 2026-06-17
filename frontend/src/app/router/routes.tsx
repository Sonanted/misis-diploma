import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import PrivateLayout from '../layouts/private-layout';
import PublicLayout from '../layouts/public-layout';
import { AccountBreadcrumb, CardBreadcrumb, OperationBreadcrumb } from './breadcrumbs';
import PrivateRoute from './guards/PrivateRoute';
import PublicRoute from './guards/PublicRoute';

const Cards = lazy(() => import('@/pages/cards'));
const Dashboard = lazy(() => import('@/pages/dashboard'));
const ForgotPassword = lazy(() => import('@/pages/forgot-password'));
const Login = lazy(() => import('@/pages/login'));
const Operations = lazy(() => import('@/pages/operations'));
const Payments = lazy(() => import('@/pages/payments'));
const Profile = lazy(() => import('@/pages/profile'));
const Signup = lazy(() => import('@/pages/signup'));

const AccountDetail = lazy(() =>
	import('@/widgets/account-detail').then((m) => ({ default: m.AccountDetail })),
);
const AccountsList = lazy(() =>
	import('@/widgets/accounts-list').then((m) => ({ default: m.AccountsList })),
);
const CardDetail = lazy(() =>
	import('@/widgets/card-detail').then((m) => ({ default: m.CardDetail })),
);
const CardsList = lazy(() =>
	import('@/widgets/cards-list').then((m) => ({ default: m.CardsList })),
);
const OperationDetail = lazy(() =>
	import('@/widgets/operation-detail').then((m) => ({ default: m.OperationDetail })),
);
const OperationsList = lazy(() =>
	import('@/widgets/operations-list').then((m) => ({ default: m.OperationsList })),
);
const NewPayment = lazy(() =>
	import('@/widgets/payment-form').then((m) => ({ default: m.NewPayment })),
);

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
										handle: {
											breadcrumb: ({ params }: { params: Record<string, string | undefined> }) => (
												<AccountBreadcrumb id={params.id} />
											),
										},
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
								handle: {
									breadcrumb: ({ params }: { params: Record<string, string | undefined> }) => (
										<CardBreadcrumb id={params.id} />
									),
								},
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
								handle: {
									breadcrumb: ({ params }: { params: Record<string, string | undefined> }) => (
										<OperationBreadcrumb id={params.id} />
									),
								},
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
