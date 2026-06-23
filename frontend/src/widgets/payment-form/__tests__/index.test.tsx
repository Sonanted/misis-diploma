import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NewPayment } from '../index';

const mockTransferMutate = vi.hoisted(() => vi.fn());

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

vi.mock('@/entities/account/queries', () => ({
	useAccounts: vi.fn(() => ({
		data: [
			{
				id: 'acc_1',
				name: 'Main Account',
				accountNumber: '12345678901234567890',
				balance: 10000,
				currency: 'RUB',
				type: 'checking',
				status: 'active',
			},
		],
	})),
}));

vi.mock('@/entities/transfer/queries', () => ({
	useTransfer: vi.fn(() => ({ mutate: mockTransferMutate, isPending: false })),
}));

vi.mock('@/shared/api/transfers', () => ({
	resolveDestinationCurrency: vi.fn().mockResolvedValue({ toCurrency: 'RUB' }),
}));

vi.mock('@/shared/api/currency-rates', () => ({
	getCurrencyRates: vi.fn().mockResolvedValue({
		rates: { RUB: 1, USD: 0.011, EUR: 0.01 },
		updatedAt: '2024-01-15T10:00:00Z',
	}),
}));

vi.mock('@/shared/ui/select', () => {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	const React = require('react');
	return {
		Select: ({
			children,
			onValueChange,
		}: {
			children: ReactNode;
			onValueChange?: (v: string) => void;
		}) =>
			React.createElement(
				'div',
				null,
				React.Children.map(children, (child: ReactNode) =>
					React.isValidElement(child)
						? React.cloneElement(
								child as React.ReactElement<{ onValueChange?: (v: string) => void }>,
								{ onValueChange },
							)
						: child,
				),
			),
		SelectTrigger: ({ children }: { children: ReactNode }) => (
			<button type="button">{children}</button>
		),
		SelectValue: ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>,
		SelectContent: ({
			children,
			onValueChange,
		}: {
			children: ReactNode;
			onValueChange?: (v: string) => void;
		}) =>
			React.createElement(
				'div',
				null,
				React.Children.map(children, (child: ReactNode) =>
					React.isValidElement(child)
						? React.cloneElement(
								child as React.ReactElement<{ onValueChange?: (v: string) => void }>,
								{ onValueChange },
							)
						: child,
				),
			),
		SelectItem: ({
			children,
			value,
			onValueChange,
		}: {
			children: ReactNode;
			value: string;
			onValueChange?: (v: string) => void;
		}) => (
			<button type="button" data-value={value} onClick={() => onValueChange?.(value)}>
				{children}
			</button>
		),
	};
});

vi.mock('@/widgets/payment-form/payment-confirm-dialog', () => ({
	PaymentConfirmDialog: ({
		onClose,
		onConfirm,
	}: {
		onClose: () => void;
		onConfirm: () => void;
	}) => (
		<div>
			<span>PaymentConfirmDialog</span>
			<button type="button" onClick={onConfirm}>
				ConfirmPayment
			</button>
			<button type="button" onClick={onClose}>
				Close
			</button>
		</div>
	),
}));

function renderNewPayment() {
	return render(
		<MemoryRouter>
			<NewPayment />
		</MemoryRouter>,
	);
}

describe('NewPayment', () => {
	beforeEach(() => {
		mockTransferMutate.mockClear();
	});

	it('renders page title', () => {
		renderNewPayment();
		expect(screen.getByText('payments.title')).toBeInTheDocument();
	});

	it('renders three payment method buttons', () => {
		renderNewPayment();
		expect(screen.getByText('payments.method_account')).toBeInTheDocument();
		expect(screen.getByText('payments.method_phone')).toBeInTheDocument();
		expect(screen.getByText('payments.method_card')).toBeInTheDocument();
	});

	it('shows select method prompt when no method selected', () => {
		renderNewPayment();
		expect(screen.getByText('payments.select_method')).toBeInTheDocument();
	});

	it('shows form when account method is selected', async () => {
		renderNewPayment();
		await userEvent.click(screen.getByText('payments.method_account'));
		expect(screen.getByText('payments.pay_by_account')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('payments.account_placeholder')).toBeInTheDocument();
	});

	it('shows form when phone method is selected', async () => {
		renderNewPayment();
		await userEvent.click(screen.getByText('payments.method_phone'));
		expect(screen.getByText('payments.pay_by_phone')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('payments.phone_placeholder')).toBeInTheDocument();
	});

	it('shows form when card method is selected', async () => {
		renderNewPayment();
		await userEvent.click(screen.getByText('payments.method_card'));
		expect(screen.getByText('payments.pay_by_card')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('payments.card_placeholder')).toBeInTheDocument();
	});

	it('shows phone hint when phone method is selected', async () => {
		renderNewPayment();
		await userEvent.click(screen.getByText('payments.method_phone'));
		expect(screen.getByText('payments.phone_hint')).toBeInTheDocument();
	});

	it('shows card hint when card method is selected', async () => {
		renderNewPayment();
		await userEvent.click(screen.getByText('payments.method_card'));
		expect(screen.getByText('payments.card_hint')).toBeInTheDocument();
	});

	it('renders send button inside form', async () => {
		renderNewPayment();
		await userEvent.click(screen.getByText('payments.method_account'));
		expect(screen.getByText('payments.send')).toBeInTheDocument();
	});

	it('method subs are rendered', () => {
		renderNewPayment();
		expect(screen.getByText('payments.method_account_sub')).toBeInTheDocument();
		expect(screen.getByText('payments.method_phone_sub')).toBeInTheDocument();
		expect(screen.getByText('payments.method_card_sub')).toBeInTheDocument();
	});

	it('switching methods resets the form', async () => {
		renderNewPayment();
		await userEvent.click(screen.getByText('payments.method_account'));
		expect(screen.getByText('payments.pay_by_account')).toBeInTheDocument();
		await userEvent.click(screen.getByText('payments.method_phone'));
		expect(screen.getByText('payments.pay_by_phone')).toBeInTheDocument();
	});

	it('shows PaymentConfirmDialog after valid form submit', async () => {
		renderNewPayment();
		await userEvent.click(screen.getByText('payments.method_account'));

		// Select the from-account
		await userEvent.click(screen.getByText(/Main Account/));

		const recipientInput = screen.getByPlaceholderText('payments.account_placeholder');
		const amountInput = screen.getByPlaceholderText('0.00');

		await userEvent.type(recipientInput, '98765432109876543210');
		await userEvent.type(amountInput, '100');

		await userEvent.click(screen.getByText('payments.send'));

		await waitFor(() => {
			expect(screen.getByText('PaymentConfirmDialog')).toBeInTheDocument();
		});
	});

	it('calls transfer.mutate when confirm button is clicked', async () => {
		renderNewPayment();
		await userEvent.click(screen.getByText('payments.method_account'));
		await userEvent.click(screen.getByText(/Main Account/));

		const recipientInput = screen.getByPlaceholderText('payments.account_placeholder');
		const amountInput = screen.getByPlaceholderText('0.00');

		await userEvent.type(recipientInput, '98765432109876543210');
		await userEvent.type(amountInput, '100');

		await userEvent.click(screen.getByText('payments.send'));

		await waitFor(() => screen.getByText('PaymentConfirmDialog'));
		await userEvent.click(screen.getByText('ConfirmPayment'));

		expect(mockTransferMutate).toHaveBeenCalled();
	});

	it('shows success toast and resets after successful transfer', async () => {
		vi.mocked(toast.success).mockClear();

		renderNewPayment();
		await userEvent.click(screen.getByText('payments.method_account'));
		await userEvent.click(screen.getByText(/Main Account/));

		await userEvent.type(screen.getByPlaceholderText('payments.account_placeholder'), '12345');
		await userEvent.type(screen.getByPlaceholderText('0.00'), '50');

		await userEvent.click(screen.getByText('payments.send'));
		await waitFor(() => screen.getByText('PaymentConfirmDialog'));
		await userEvent.click(screen.getByText('ConfirmPayment'));

		const [, callbacks] = mockTransferMutate.mock.calls[0];
		await act(async () => {
			callbacks.onSuccess();
		});

		expect(vi.mocked(toast.success)).toHaveBeenCalledWith('payments.toast_success');
		expect(screen.queryByText('PaymentConfirmDialog')).not.toBeInTheDocument();
	});

	it('shows error toast on transfer failure', async () => {
		vi.mocked(toast.error).mockClear();

		renderNewPayment();
		await userEvent.click(screen.getByText('payments.method_account'));
		await userEvent.click(screen.getByText(/Main Account/));

		await userEvent.type(screen.getByPlaceholderText('payments.account_placeholder'), '12345');
		await userEvent.type(screen.getByPlaceholderText('0.00'), '50');

		await userEvent.click(screen.getByText('payments.send'));
		await waitFor(() => screen.getByText('PaymentConfirmDialog'));
		await userEvent.click(screen.getByText('ConfirmPayment'));

		const [, callbacks] = mockTransferMutate.mock.calls[0];
		callbacks.onError(new Error('Network error'));

		expect(vi.mocked(toast.error)).toHaveBeenCalledWith('payments.toast_error');
	});

	it('closing confirm dialog hides it', async () => {
		renderNewPayment();
		await userEvent.click(screen.getByText('payments.method_account'));
		await userEvent.click(screen.getByText(/Main Account/));

		await userEvent.type(screen.getByPlaceholderText('payments.account_placeholder'), '12345');
		await userEvent.type(screen.getByPlaceholderText('0.00'), '50');

		await userEvent.click(screen.getByText('payments.send'));
		await waitFor(() => screen.getByText('PaymentConfirmDialog'));
		await userEvent.click(screen.getByText('Close'));

		expect(screen.queryByText('PaymentConfirmDialog')).not.toBeInTheDocument();
	});
});
