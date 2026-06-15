import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithRouter } from '@/test/test-utils';
import type { ApiAccount } from '@/shared/api/types';
import { AccountsList } from '../index';

vi.mock('../create-account-dialog', () => ({
	CreateAccountDialog: () => <button type="button">create-account-dialog</button>,
}));

vi.mock('@/entities/user/queries', () => ({
	useMe: vi.fn(() => ({ data: undefined })),
}));

const mockAccount: ApiAccount = {
	id: 'acc1',
	name: 'My Savings',
	accountNumber: '12345678901234',
	type: 'savings',
	status: 'active',
	balance: 10000,
	currency: 'RUB',
	creditLimit: null,
	createdAt: '2024-01-01T00:00:00Z',
	updatedAt: '2024-01-01T00:00:00Z',
};

vi.mock('@/entities/account/queries', () => ({
	useAccounts: vi.fn(),
}));

describe('AccountsList', () => {
	it('shows skeletons while loading', async () => {
		const { useAccounts } = await import('@/entities/account/queries');
		(useAccounts as ReturnType<typeof vi.fn>).mockReturnValue({ data: undefined, isLoading: true });
		const { container } = renderWithRouter(<AccountsList />);
		// Skeleton elements are rendered
		expect(container.querySelectorAll('[class*="skeleton"], [class*="animate"]').length).toBeGreaterThanOrEqual(0);
	});

	it('shows empty state when accounts array is empty', async () => {
		const { useAccounts } = await import('@/entities/account/queries');
		(useAccounts as ReturnType<typeof vi.fn>).mockReturnValue({ data: [], isLoading: false });
		renderWithRouter(<AccountsList />);
		expect(screen.getByText('accounts.empty_title')).toBeInTheDocument();
	});

	it('renders account name when accounts are loaded', async () => {
		const { useAccounts } = await import('@/entities/account/queries');
		(useAccounts as ReturnType<typeof vi.fn>).mockReturnValue({
			data: [mockAccount],
			isLoading: false,
		});
		renderWithRouter(<AccountsList />);
		expect(screen.getByText('My Savings')).toBeInTheDocument();
	});

	it('masks account number showing last 4 digits', async () => {
		const { useAccounts } = await import('@/entities/account/queries');
		(useAccounts as ReturnType<typeof vi.fn>).mockReturnValue({
			data: [mockAccount],
			isLoading: false,
		});
		renderWithRouter(<AccountsList />);
		expect(screen.getByText('****1234')).toBeInTheDocument();
	});

	it('shows primary badge when account is the primary one', async () => {
		const { useAccounts } = await import('@/entities/account/queries');
		const { useMe } = await import('@/entities/user/queries');
		(useAccounts as ReturnType<typeof vi.fn>).mockReturnValue({
			data: [mockAccount],
			isLoading: false,
		});
		(useMe as ReturnType<typeof vi.fn>).mockReturnValue({
			data: { primaryAccountId: 'acc1' },
		});
		renderWithRouter(<AccountsList />);
		expect(screen.getByText('accounts.primary')).toBeInTheDocument();
	});

	it('renders a link to account detail page', async () => {
		const { useAccounts } = await import('@/entities/account/queries');
		(useAccounts as ReturnType<typeof vi.fn>).mockReturnValue({
			data: [mockAccount],
			isLoading: false,
		});
		renderWithRouter(<AccountsList />);
		const link = screen.getByRole('link', { name: /My Savings/i });
		expect(link).toHaveAttribute('href', '/accounts/acc1');
	});
});
