import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCard } from '@/entities/card/queries';
import { CardDetail } from '../index';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const mockUpdateCardStatusMutate = vi.hoisted(() => vi.fn());

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
	useUpdateCardStatus: vi.fn(() => ({ mutate: mockUpdateCardStatusMutate, isPending: false })),
	useRevealCard: vi.fn(() => ({ data: undefined, isFetching: false })),
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
	ConfirmDialog: ({
		open,
		onConfirm,
		onClose,
	}: {
		open: boolean;
		onConfirm: () => void;
		onClose: () => void;
	}) =>
		open ? (
			<div role="dialog">
				<button type="button" onClick={onConfirm}>
					ConfirmAction
				</button>
				<button type="button" onClick={onClose}>
					CloseDialog
				</button>
			</div>
		) : null,
}));

function renderCardDetail() {
	return render(
		<MemoryRouter>
			<CardDetail />
		</MemoryRouter>,
	);
}

describe('CardDetail', () => {
	beforeEach(() => {
		mockUpdateCardStatusMutate.mockClear();
	});

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
		expect(screen.getByText(/cards\.available_credit/)).toBeInTheDocument();
	});

	it('clicking eye button toggles card visibility state', async () => {
		renderCardDetail();
		const eyeBtn = screen.getByLabelText('Show card info');
		await userEvent.click(eyeBtn);
		// cardInfoVisible becomes true but revealed is undefined → showData stays false
		// button stays with same aria-label since showData is false
		expect(screen.getByLabelText('Show card info')).toBeInTheDocument();
	});

	it('shows confirm dialog when lock card button is clicked', async () => {
		renderCardDetail();
		await userEvent.click(screen.getByText('cards.lock_card'));
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('closes confirm dialog when CloseDialog is clicked', async () => {
		renderCardDetail();
		await userEvent.click(screen.getByText('cards.lock_card'));
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		await userEvent.click(screen.getByText('CloseDialog'));
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('calls updateStatus.mutate with Locked on lock confirm', async () => {
		renderCardDetail();
		await userEvent.click(screen.getByText('cards.lock_card'));
		await userEvent.click(screen.getByText('ConfirmAction'));
		expect(mockUpdateCardStatusMutate).toHaveBeenCalledWith(
			{ id: 'card_1', dto: { status: 'Locked' } },
			expect.any(Object),
		);
	});

	it('shows success toast after locking card', async () => {
		vi.mocked(toast.success).mockClear();
		renderCardDetail();
		await userEvent.click(screen.getByText('cards.lock_card'));
		await userEvent.click(screen.getByText('ConfirmAction'));
		const [, callbacks] = mockUpdateCardStatusMutate.mock.calls[0];
		callbacks.onSuccess();
		expect(vi.mocked(toast.success)).toHaveBeenCalledWith('cards.lock_card_toast');
	});

	it('shows confirm dialog when cancel card button is clicked', async () => {
		renderCardDetail();
		await userEvent.click(screen.getByText('cards.cancel_card'));
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('calls updateStatus.mutate with Closed on cancel confirm', async () => {
		renderCardDetail();
		await userEvent.click(screen.getByText('cards.cancel_card'));
		await userEvent.click(screen.getByText('ConfirmAction'));
		expect(mockUpdateCardStatusMutate).toHaveBeenCalledWith(
			{ id: 'card_1', dto: { status: 'Closed' } },
			expect.any(Object),
		);
	});

	it('shows error toast when updateStatus fails', async () => {
		vi.mocked(toast.error).mockClear();
		renderCardDetail();
		await userEvent.click(screen.getByText('cards.lock_card'));
		await userEvent.click(screen.getByText('ConfirmAction'));
		const [, callbacks] = mockUpdateCardStatusMutate.mock.calls[0];
		callbacks.onError();
		expect(vi.mocked(toast.error)).toHaveBeenCalledWith('cards.action_error');
	});

	it('shows credit limit card for credit card', () => {
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
		expect(screen.getByText('cards.credit_limit')).toBeInTheDocument();
	});
});
