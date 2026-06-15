import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { useAccount } from '@/entities/account/queries';
import { useCards } from '@/entities/card/queries';
import { useMe } from '@/entities/user/queries';
import { usePrivacyStore } from '@/features/balance-visibility/model';
import { AccountDetail } from '../index';

vi.mock('@/entities/account/queries', () => ({
	useAccount: vi.fn(() => ({
		data: {
			id: 'acc_1',
			name: 'My Checking',
			accountNumber: '12345678901234567890',
			balance: 15000.5,
			currency: 'RUB',
			type: 'checking',
			status: 'active',
			creditLimit: null,
			interestRate: null,
		},
		isLoading: false,
		isError: false,
	})),
	useBankInfo: vi.fn(() => ({ data: { bik: '044525225', name: 'Test Bank' } })),
	useMonthlyPayment: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
	useSetPrimaryAccount: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
	useUpdateAccountStatus: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

vi.mock('@/entities/card/queries', () => ({
	useCards: vi.fn(() => ({ data: [] })),
}));

vi.mock('@/entities/operation/queries', () => ({
	useAccountOperations: vi.fn(() => ({
		data: undefined,
		fetchNextPage: vi.fn(),
		hasNextPage: false,
		isFetchingNextPage: false,
	})),
}));

vi.mock('@/entities/user/queries', () => ({
	useMe: vi.fn(() => ({ data: { id: 'usr_1', primaryAccountId: 'acc_other' } })),
}));

vi.mock('@/features/balance-visibility/model', () => ({
	usePrivacyStore: vi.fn(() => ({ balanceVisible: true, toggle: vi.fn() })),
}));

vi.mock('react-router', async (importOriginal) => {
	const actual = await importOriginal<typeof import('react-router')>();
	return { ...actual, useParams: () => ({ id: 'acc_1' }), useNavigate: () => vi.fn() };
});

vi.mock('@/widgets/transaction-history', () => ({
	TransactionHistory: () => <div>TransactionHistory</div>,
}));

vi.mock('@/widgets/cards-list/create-card-dialog', () => ({
	CreateCardDialog: ({ trigger }: { trigger: React.ReactNode }) => <div>{trigger}</div>,
}));

vi.mock('@/widgets/account-detail/topup-dialog', () => ({
	TopupDialog: ({ trigger }: { trigger: React.ReactNode }) => <div>{trigger}</div>,
}));

vi.mock('@/shared/ui/confirm-dialog', () => ({
	ConfirmDialog: () => null,
}));

function renderAccountDetail() {
	return render(
		<MemoryRouter>
			<AccountDetail />
		</MemoryRouter>,
	);
}

describe('AccountDetail', () => {
	it('renders account name', () => {
		renderAccountDetail();
		expect(screen.getByText('My Checking')).toBeInTheDocument();
	});

	it('renders masked account number', () => {
		renderAccountDetail();
		expect(screen.getByText(/\*{4}7890/)).toBeInTheDocument();
	});

	it('shows loading state when isLoading is true', () => {
		vi.mocked(useAccount).mockReturnValueOnce({
			data: undefined,
			isLoading: true,
			isError: false,
		} as ReturnType<typeof useAccount>);
		const { container } = renderAccountDetail();
		expect(container.firstChild).toBeInTheDocument();
		expect(screen.queryByText('My Checking')).not.toBeInTheDocument();
	});

	it('shows NotFound when isError is true', () => {
		vi.mocked(useAccount).mockReturnValueOnce({
			data: undefined,
			isLoading: false,
			isError: true,
		} as ReturnType<typeof useAccount>);
		renderAccountDetail();
		expect(screen.getByText('account_detail.not_found_title')).toBeInTheDocument();
	});

	it('shows primary badge when account is primary', () => {
		vi.mocked(useMe).mockReturnValueOnce({
			data: { id: 'usr_1', primaryAccountId: 'acc_1' } as ReturnType<typeof useMe>['data'],
		} as ReturnType<typeof useMe>);
		renderAccountDetail();
		expect(screen.getByText('accounts.primary')).toBeInTheDocument();
	});

	it('shows set primary button when account is eligible and not primary', () => {
		renderAccountDetail();
		expect(screen.getByText('accounts.set_primary')).toBeInTheDocument();
	});

	it('renders transfer button', () => {
		renderAccountDetail();
		expect(screen.getByText('account_detail.transfer')).toBeInTheDocument();
	});

	it('renders topup button', () => {
		renderAccountDetail();
		expect(screen.getByText('account_detail.topup')).toBeInTheDocument();
	});

	it('renders details button', () => {
		renderAccountDetail();
		expect(screen.getByText('account_detail.details')).toBeInTheDocument();
	});

	it('renders close account button', () => {
		renderAccountDetail();
		expect(screen.getByText('account_detail.close_account')).toBeInTheDocument();
	});

	it('shows masked balance when not visible', () => {
		vi.mocked(usePrivacyStore).mockReturnValueOnce({ balanceVisible: false, toggle: vi.fn() });
		renderAccountDetail();
		expect(screen.getByText(/••••••/)).toBeInTheDocument();
	});

	it('renders TransactionHistory section', () => {
		renderAccountDetail();
		expect(screen.getByText('TransactionHistory')).toBeInTheDocument();
	});

	it('shows monthly payment button for credit accounts', () => {
		vi.mocked(useAccount).mockReturnValueOnce({
			data: {
				id: 'acc_1',
				name: 'My Credit',
				accountNumber: '12345678901234567890',
				balance: 5000,
				currency: 'RUB',
				type: 'credit',
				status: 'active',
				creditLimit: 100000,
				interestRate: 18,
			},
			isLoading: false,
			isError: false,
		} as ReturnType<typeof useAccount>);
		renderAccountDetail();
		expect(screen.getByText('account_detail.monthly_payment')).toBeInTheDocument();
	});

	it('renders linked cards when present', () => {
		vi.mocked(useCards).mockReturnValueOnce({
			data: [
				{
					id: 'card_1',
					name: 'Debit Card',
					cardNumber: '**** 1234',
					type: 'Debit',
					status: 'Active',
					linkedAccountId: 'acc_1',
				} as NonNullable<ReturnType<typeof useCards>['data']>[0],
			],
		} as ReturnType<typeof useCards>);
		renderAccountDetail();
		expect(screen.getByText('Debit Card')).toBeInTheDocument();
	});

	it('shows create card button for active checking account', () => {
		renderAccountDetail();
		expect(screen.getByText('account_detail.create_card')).toBeInTheDocument();
	});
});
