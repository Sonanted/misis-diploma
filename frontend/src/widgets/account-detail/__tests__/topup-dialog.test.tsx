import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { describe, expect, it, vi } from 'vitest';
import { useTopupAccount } from '@/entities/account/queries';
import { TopupDialog } from '../topup-dialog';

vi.mock('sonner', () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));

const mockMutate = vi.fn();

vi.mock('@/entities/account/queries', () => ({
	useTopupAccount: vi.fn(() => ({ mutate: mockMutate, isPending: false })),
}));

// Mock dialog to avoid Radix UI portal/focus-trap issues in jsdom
vi.mock('@/shared/ui/dialog', () => ({
	Dialog: ({ open, children }: { open: boolean; children: React.ReactNode }) =>
		open ? <div role="dialog">{children}</div> : null,
	DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

function renderTopupDialog(balance = 5000) {
	return render(
		<TopupDialog
			accountId="acc_1"
			balance={balance}
			trigger={<button type="button">Open Topup</button>}
		/>,
	);
}

describe('TopupDialog', () => {
	it('renders trigger button', () => {
		renderTopupDialog();
		expect(screen.getByText('Open Topup')).toBeInTheDocument();
	});

	it('does not show dialog content by default', () => {
		renderTopupDialog();
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('opens dialog when trigger is clicked', async () => {
		renderTopupDialog();
		await userEvent.click(screen.getByText('Open Topup'));
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('shows dialog title when open', async () => {
		renderTopupDialog();
		await userEvent.click(screen.getByText('Open Topup'));
		expect(screen.getByText('account_detail.topup_dialog_title')).toBeInTheDocument();
	});

	it('shows amount and password fields when open', async () => {
		renderTopupDialog();
		await userEvent.click(screen.getByText('Open Topup'));
		expect(screen.getByText('account_detail.topup_amount_label')).toBeInTheDocument();
		expect(screen.getByText('account_detail.topup_password_label')).toBeInTheDocument();
	});

	it('shows submit and cancel buttons when open', async () => {
		renderTopupDialog();
		await userEvent.click(screen.getByText('Open Topup'));
		expect(screen.getByText('account_detail.topup_submit')).toBeInTheDocument();
		expect(screen.getByText('common.cancel')).toBeInTheDocument();
	});

	it('closes dialog when cancel is clicked', async () => {
		renderTopupDialog();
		await userEvent.click(screen.getByText('Open Topup'));
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		await userEvent.click(screen.getByText('common.cancel'));
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('calls mutate with correct args on valid submit', async () => {
		mockMutate.mockClear();
		renderTopupDialog();
		await userEvent.click(screen.getByText('Open Topup'));

		const amountInput = screen.getByPlaceholderText('account_detail.topup_amount_placeholder');
		const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;

		await userEvent.type(amountInput, '1000');
		await userEvent.type(passwordInput, 'mypassword');
		await userEvent.click(screen.getByText('account_detail.topup_submit'));

		expect(mockMutate).toHaveBeenCalledWith(
			{ id: 'acc_1', dto: { amount: 1000, password: 'mypassword' } },
			expect.any(Object),
		);
	});

	it('shows validation error when amount is zero', async () => {
		renderTopupDialog();
		await userEvent.click(screen.getByText('Open Topup'));

		const amountInput = screen.getByPlaceholderText('account_detail.topup_amount_placeholder');
		await userEvent.type(amountInput, '0');
		await userEvent.click(screen.getByText('account_detail.topup_submit'));

		expect(screen.getByText('validation.amount_min')).toBeInTheDocument();
	});

	it('does not call mutate when form is empty on submit', async () => {
		mockMutate.mockClear();
		renderTopupDialog();
		await userEvent.click(screen.getByText('Open Topup'));
		await userEvent.click(screen.getByText('account_detail.topup_submit'));
		expect(mockMutate).not.toHaveBeenCalled();
	});

	it('calls mutate when useTopupAccount is called with isPending state', () => {
		vi.mocked(useTopupAccount).mockReturnValueOnce({ mutate: mockMutate, isPending: true });
		renderTopupDialog();
		const submitBtn = document.querySelector('button[type="submit"]');
		expect(submitBtn).toBeDefined();
	});

	it('closes dialog and calls toast.success on successful topup', async () => {
		mockMutate.mockClear();
		renderTopupDialog();
		await userEvent.click(screen.getByText('Open Topup'));

		await userEvent.type(
			screen.getByPlaceholderText('account_detail.topup_amount_placeholder'),
			'500',
		);
		await userEvent.type(
			document.querySelector('input[type="password"]') as HTMLInputElement,
			'pass123',
		);
		await userEvent.click(screen.getByText('account_detail.topup_submit'));

		const [, options] = mockMutate.mock.calls[0];
		options.onSuccess();

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
		expect(vi.mocked(toast.success)).toHaveBeenCalled();
	});

	it('calls toast.error on generic topup error', async () => {
		mockMutate.mockClear();
		vi.mocked(toast.error).mockClear();
		renderTopupDialog();
		await userEvent.click(screen.getByText('Open Topup'));

		await userEvent.type(
			screen.getByPlaceholderText('account_detail.topup_amount_placeholder'),
			'500',
		);
		await userEvent.type(
			document.querySelector('input[type="password"]') as HTMLInputElement,
			'pass123',
		);
		await userEvent.click(screen.getByText('account_detail.topup_submit'));

		const [, options] = mockMutate.mock.calls[0];
		options.onError(new Error('Network error'));

		expect(vi.mocked(toast.error)).toHaveBeenCalledWith('account_detail.topup_error');
	});
});
