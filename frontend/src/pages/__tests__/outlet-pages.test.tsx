import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import Cards from '../cards/index';
import Dashboard from '../dashboard/index';
import Operations from '../operations/index';
import Payments from '../payments/index';
import Profile from '../profile/index';

// Profile renders Settings which calls useMe — mock all user/account queries
vi.mock('@/entities/user/queries', () => ({
	useMe: vi.fn(() => ({ data: undefined, isLoading: false })),
	useUpdateMe: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
	useChangePassword: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));
vi.mock('@/entities/account/queries', () => ({
	useAccounts: vi.fn(() => ({ data: [], isLoading: false })),
	useBankInfo: vi.fn(() => ({ data: undefined })),
}));

function renderOutlet(Component: React.ComponentType) {
	return render(
		<MemoryRouter initialEntries={['/']}>
			<Routes>
				<Route path="/" element={<Component />}>
					<Route index element={<div>child</div>} />
				</Route>
			</Routes>
		</MemoryRouter>,
	);
}

describe('Outlet pages', () => {
	it('Dashboard renders without crashing', () => {
		const { container } = renderOutlet(Dashboard);
		expect(container).toBeInTheDocument();
	});

	it('Cards renders without crashing', () => {
		const { container } = renderOutlet(Cards);
		expect(container).toBeInTheDocument();
	});

	it('Operations renders without crashing', () => {
		const { container } = renderOutlet(Operations);
		expect(container).toBeInTheDocument();
	});

	it('Payments renders without crashing', () => {
		const { container } = renderOutlet(Payments);
		expect(container).toBeInTheDocument();
	});

	it('Profile renders without crashing', () => {
		const { container } = renderOutlet(Profile);
		expect(container).toBeInTheDocument();
	});
});
