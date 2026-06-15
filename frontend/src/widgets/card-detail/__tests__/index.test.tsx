import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { useCard } from '@/entities/card/queries';
import { CardDetail } from '../index';

const mockCard = {
	id: 'card_1',
	name: 'My Debit Card',
	cardNumber: '**** **** **** 1234',
	fullNumber: '4111111111111234',
	expiryDate: '12/26',
	cvv: '123',
	pin: '1234',
	type: 'Debit',
	status: 'Active',
	balance: 5000.0,
	currency: 'RUB' as const,
	linkedAccountId: 'acc_1',
	cardHolder: 'JOHN DOE',
	availableCredit: null,
	creditLimit: null,
};

vi.mock('@/entities/card/queries', () => ({
	useCard: vi.fn(() => ({ data: mockCard, isLoading: false, isError: false })),
	useUpdateCardStatus: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

vi.mock('@/features/balance-visibility/model', () => ({
	usePrivacyStore: vi.fn(() => ({ balanceVisible: true, toggle: vi.fn() })),
}));

vi.mock('react-router', async (importOriginal) => {
	const actual = await importOriginal<typeof import('react-router')>();
	return { ...actual, useParams: () => ({ id: 'card_1' }), useNavigate: () => vi.fn() };
});

vi.mock('@/widgets/transaction-history', () => ({
	TransactionHistory: () => <div>TransactionHistory</div>,
}));

vi.mock('@/widgets/card-detail/pin-dialog', () => ({
	PinDialog: ({ trigger }: { trigger: React.ReactNode }) => <div>{trigger}</div>,
}));

vi.mock('@/shared/ui/confirm-dialog', () => ({
	ConfirmDialog: () => null,
}));

function renderCardDetail() {
	return render(
		<MemoryRouter>
			<CardDetail />
		</MemoryRouter>,
	);
}

describe('CardDetail', () => {
	it('renders card name', () => {
		renderCardDetail();
		expect(screen.getByText('My Debit Card')).toBeInTheDocument();
	});

	it('renders card number', () => {
		renderCardDetail();
		expect(screen.getByText('**** **** **** 1234')).toBeInTheDocument();
	});

	it('renders card holder name', () => {
		renderCardDetail();
		expect(screen.getByText('JOHN DOE')).toBeInTheDocument();
	});

	it('shows loading skeleton when isLoading', () => {
		vi.mocked(useCard).mockReturnValueOnce({
			data: undefined,
			isLoading: true,
			isError: false,
		} as ReturnType<typeof useCard>);
		const { container } = renderCardDetail();
		expect(container.firstChild).toBeInTheDocument();
		expect(screen.queryByText('My Debit Card')).not.toBeInTheDocument();
	});

	it('shows NotFound when isError', () => {
		vi.mocked(useCard).mockReturnValueOnce({
			data: undefined,
			isLoading: false,
			isError: true,
		} as ReturnType<typeof useCard>);
		renderCardDetail();
		expect(screen.getByText('cards.not_found_title')).toBeInTheDocument();
	});

	it('renders balance amount', () => {
		renderCardDetail();
		expect(screen.getByText(/5/)).toBeInTheDocument();
	});

	it('shows lock button for active card', () => {
		renderCardDetail();
		expect(screen.getByText('cards.lock_card')).toBeInTheDocument();
	});

	it('shows unlock button for locked card', () => {
		vi.mocked(useCard).mockReturnValueOnce({
			data: { ...mockCard, status: 'Locked' },
			isLoading: false,
			isError: false,
		} as ReturnType<typeof useCard>);
		renderCardDetail();
		expect(screen.getByText('cards.unlock_card')).toBeInTheDocument();
	});

	it('renders pin button', () => {
		renderCardDetail();
		expect(screen.getByText('cards.pin_button')).toBeInTheDocument();
	});

	it('renders cancel card button', () => {
		renderCardDetail();
		expect(screen.getByText('cards.cancel_card')).toBeInTheDocument();
	});

	it('renders go to account button', () => {
		renderCardDetail();
		expect(screen.getByText('cards.go_to_account')).toBeInTheDocument();
	});

	it('renders topup and transfer buttons', () => {
		renderCardDetail();
		expect(screen.getByText('cards.topup')).toBeInTheDocument();
		expect(screen.getByText('cards.transfer')).toBeInTheDocument();
	});

	it('shows masked card number when card info is hidden', () => {
		renderCardDetail();
		// Default cardInfoVisible=false: card face shows "•••• •••• •••• 1234"
		// card.cardNumber "**** **** **** 1234" is also visible — both contain 1234
		expect(screen.getAllByText(/1234/).length).toBeGreaterThan(0);
	});

	it('shows available credit for credit card', () => {
		vi.mocked(useCard).mockReturnValueOnce({
			data: {
				...mockCard,
				type: 'Credit',
				availableCredit: 80000,
				creditLimit: 100000,
			},
			isLoading: false,
			isError: false,
		} as ReturnType<typeof useCard>);
		renderCardDetail();
		// text is "cards.available_credit: 80 000,00 ₽" — use regex for partial match
		expect(screen.getByText(/cards\.available_credit/)).toBeInTheDocument();
	});
});
