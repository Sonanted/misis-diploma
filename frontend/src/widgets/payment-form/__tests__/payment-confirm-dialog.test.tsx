import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { PaymentConfirmDialog } from '../payment-confirm-dialog';

vi.mock('@/shared/ui/dialog', () => ({
	Dialog: ({ open, children }: { open: boolean; children: ReactNode }) =>
		open ? <div role="dialog">{children}</div> : null,
	DialogContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	DialogHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	DialogTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
	DialogFooter: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

const mockAccounts = [
	{
		id: 'acc_1',
		name: 'Main Account',
		accountNumber: '12345678901234567890',
		balance: 10000,
		currency: 'RUB',
	},
];

const defaultData = {
	method: 'account' as const,
	fromAccountId: 'acc_1',
	recipientIdentifier: '98765432109876543210',
	amount: 1500,
	description: 'Test payment',
};

function renderDialog(overrides?: Partial<typeof defaultData>) {
	const onClose = vi.fn();
	const onConfirm = vi.fn();
	const result = render(
		<PaymentConfirmDialog
			open={true}
			data={{ ...defaultData, ...overrides }}
			accounts={mockAccounts}
			isPending={false}
			onClose={onClose}
			onConfirm={onConfirm}
		/>,
	);
	return { ...result, onClose, onConfirm };
}

describe('PaymentConfirmDialog', () => {
	it('renders dialog when open', () => {
		renderDialog();
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('does not render when closed', () => {
		render(
			<PaymentConfirmDialog
				open={false}
				data={defaultData}
				accounts={mockAccounts}
				isPending={false}
				onClose={vi.fn()}
				onConfirm={vi.fn()}
			/>,
		);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('renders confirm title', () => {
		renderDialog();
		expect(screen.getByText('payments.confirm_title')).toBeInTheDocument();
	});

	it('renders from account label', () => {
		renderDialog();
		expect(screen.getByText('payments.from_account')).toBeInTheDocument();
	});

	it('renders masked account number', () => {
		renderDialog();
		expect(screen.getByText(/Main Account/)).toBeInTheDocument();
	});

	it('renders recipient account label for account method', () => {
		renderDialog({ method: 'account' });
		expect(screen.getByText('payments.recipient_account')).toBeInTheDocument();
	});

	it('renders recipient phone label for phone method', () => {
		renderDialog({ method: 'phone' });
		expect(screen.getByText('payments.recipient_phone')).toBeInTheDocument();
	});

	it('renders recipient card label for card method', () => {
		renderDialog({ method: 'card' });
		expect(screen.getByText('payments.recipient_card')).toBeInTheDocument();
	});

	it('renders amount', () => {
		renderDialog();
		expect(screen.getByText('1500')).toBeInTheDocument();
	});

	it('renders description when provided', () => {
		renderDialog({ description: 'Test payment' });
		expect(screen.getByText('Test payment')).toBeInTheDocument();
	});

	it('does not render description row when description is undefined', () => {
		renderDialog({ description: undefined });
		expect(screen.queryByText('payments.description_optional')).not.toBeInTheDocument();
	});

	it('calls onConfirm when confirm button clicked', async () => {
		const { onConfirm } = renderDialog();
		await userEvent.click(screen.getByText('payments.send'));
		expect(onConfirm).toHaveBeenCalled();
	});

	it('calls onClose when cancel button clicked', async () => {
		const { onClose } = renderDialog();
		await userEvent.click(screen.getByText('payments.cancel'));
		expect(onClose).toHaveBeenCalled();
	});

	it('shows sending text when isPending', () => {
		render(
			<PaymentConfirmDialog
				open={true}
				data={defaultData}
				accounts={mockAccounts}
				isPending={true}
				onClose={vi.fn()}
				onConfirm={vi.fn()}
			/>,
		);
		expect(screen.getByText('payments.sending')).toBeInTheDocument();
	});
});
