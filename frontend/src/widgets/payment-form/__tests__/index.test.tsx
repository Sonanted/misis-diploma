import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { NewPayment } from '../index';

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
	useTransfer: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

vi.mock('@/shared/ui/select', () => ({
	Select: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	SelectTrigger: ({ children }: { children: ReactNode }) => (
		<button type="button">{children}</button>
	),
	SelectValue: ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>,
	SelectContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	SelectItem: ({ children, value }: { children: ReactNode; value: string }) => (
		<div data-value={value}>{children}</div>
	),
}));

vi.mock('@/widgets/payment-form/payment-confirm-dialog', () => ({
	PaymentConfirmDialog: ({ onClose }: { onClose: () => void }) => (
		<div>
			<span>PaymentConfirmDialog</span>
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
});
