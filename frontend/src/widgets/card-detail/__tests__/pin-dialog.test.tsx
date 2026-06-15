import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PinDialog } from '../pin-dialog';

vi.mock('@/entities/card/queries', () => ({
	useChangeCardPin: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

vi.mock('@/shared/ui/dialog', () => ({
	Dialog: ({ open, children }: { open: boolean; children: React.ReactNode }) =>
		open ? <div role="dialog">{children}</div> : null,
	DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

vi.mock('@/shared/ui/input-otp', () => ({
	InputOTP: ({
		value,
		onChange,
		children,
	}: {
		value: string;
		onChange: (v: string) => void;
		children: React.ReactNode;
	}) => (
		<div>
			<input
				aria-label="OTP input"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
			{children}
		</div>
	),
	InputOTPGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	InputOTPSlot: ({ index }: { index: number }) => <span>{index}</span>,
}));

function renderPinDialog() {
	return render(
		<PinDialog
			cardId="card_1"
			pin="1234"
			trigger={<button type="button">Open PIN</button>}
		/>,
	);
}

describe('PinDialog', () => {
	it('renders trigger button', () => {
		renderPinDialog();
		expect(screen.getByText('Open PIN')).toBeInTheDocument();
	});

	it('does not show dialog content by default', () => {
		renderPinDialog();
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('opens dialog when trigger is clicked', async () => {
		renderPinDialog();
		await userEvent.click(screen.getByText('Open PIN'));
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('shows dialog title when open', async () => {
		renderPinDialog();
		await userEvent.click(screen.getByText('Open PIN'));
		expect(screen.getByText('cards.pin_dialog_title')).toBeInTheDocument();
	});

	it('shows current pin label', async () => {
		renderPinDialog();
		await userEvent.click(screen.getByText('Open PIN'));
		expect(screen.getByText('cards.pin_current_label')).toBeInTheDocument();
	});

	it('shows masked pin by default', async () => {
		renderPinDialog();
		await userEvent.click(screen.getByText('Open PIN'));
		expect(screen.getByText('••••')).toBeInTheDocument();
	});

	it('reveals pin when eye button is clicked', async () => {
		renderPinDialog();
		await userEvent.click(screen.getByText('Open PIN'));
		const eyeBtn = screen.getByRole('button', { name: 'cards.pin_show' });
		await userEvent.click(eyeBtn);
		expect(screen.getByText('1234')).toBeInTheDocument();
	});

	it('shows change pin label', async () => {
		renderPinDialog();
		await userEvent.click(screen.getByText('Open PIN'));
		expect(screen.getByText('cards.pin_change_label')).toBeInTheDocument();
	});

	it('shows cancel and submit buttons', async () => {
		renderPinDialog();
		await userEvent.click(screen.getByText('Open PIN'));
		expect(screen.getByText('common.cancel')).toBeInTheDocument();
		expect(screen.getByText('cards.pin_submit')).toBeInTheDocument();
	});

	it('closes dialog when cancel is clicked', async () => {
		renderPinDialog();
		await userEvent.click(screen.getByText('Open PIN'));
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		await userEvent.click(screen.getByText('common.cancel'));
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('submit button is disabled when no new PIN entered', async () => {
		renderPinDialog();
		await userEvent.click(screen.getByText('Open PIN'));
		const submitBtn = screen.getByText('cards.pin_submit').closest('button');
		expect(submitBtn).toBeDisabled();
	});
});
