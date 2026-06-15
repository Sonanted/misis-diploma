import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TopupDialog } from '../topup-dialog';

vi.mock('@/entities/account/queries', () => ({
	useTopupAccount: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
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
});
