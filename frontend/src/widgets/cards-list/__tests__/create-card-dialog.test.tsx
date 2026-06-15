import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CreateCardDialog } from '../create-card-dialog';

vi.mock('@/entities/account/queries', () => ({
	useAccounts: vi.fn(() => ({
		data: [
			{
				id: 'acc_1',
				name: 'Main Account',
				accountNumber: '12345678901234',
				type: 'checking',
				status: 'active',
			},
			{
				id: 'acc_2',
				name: 'Credit Account',
				accountNumber: '98765432109876',
				type: 'credit',
				status: 'active',
			},
		],
	})),
}));

vi.mock('@/entities/card/queries', () => ({
	useCreateCard: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

vi.mock('@/shared/ui/dialog', () => ({
	Dialog: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	DialogContent: ({ children }: { children: ReactNode }) => (
		<div role="dialog">{children}</div>
	),
	DialogHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	DialogTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
	DialogDescription: ({ children }: { children: ReactNode }) => <p>{children}</p>,
	DialogTrigger: ({ render }: { render?: ReactNode }) => <div>{render}</div>,
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

describe('CreateCardDialog', () => {
	it('renders without crashing', () => {
		const { container } = render(<CreateCardDialog />);
		expect(container.firstChild).toBeInTheDocument();
	});

	it('renders default create card trigger button', () => {
		render(<CreateCardDialog />);
		// 'cards.create' appears in both trigger button and submit button
		expect(screen.getAllByText('cards.create')).toHaveLength(2);
	});

	it('renders custom trigger when provided', () => {
		render(<CreateCardDialog trigger={<button type="button">Custom Trigger</button>} />);
		expect(screen.getByText('Custom Trigger')).toBeInTheDocument();
	});

	it('renders dialog title', () => {
		render(<CreateCardDialog />);
		expect(screen.getByText('cards.dialog_title')).toBeInTheDocument();
	});

	it('renders dialog description', () => {
		render(<CreateCardDialog />);
		expect(screen.getByText('cards.dialog_description')).toBeInTheDocument();
	});

	it('renders card name input', () => {
		render(<CreateCardDialog />);
		expect(screen.getByText(/cards\.name_label/)).toBeInTheDocument();
		expect(screen.getByPlaceholderText('cards.name_placeholder')).toBeInTheDocument();
	});

	it('renders account selector label', () => {
		render(<CreateCardDialog />);
		expect(screen.getByText(/cards\.account_label/)).toBeInTheDocument();
	});

	it('renders eligible accounts in selector', () => {
		render(<CreateCardDialog />);
		expect(screen.getByText(/Main Account/)).toBeInTheDocument();
		expect(screen.getByText(/Credit Account/)).toBeInTheDocument();
	});

	it('renders cancel button', () => {
		render(<CreateCardDialog />);
		expect(screen.getByText('cards.cancel')).toBeInTheDocument();
	});

	it('renders with default account id pre-selected', () => {
		render(<CreateCardDialog defaultAccountId="acc_1" />);
		expect(screen.getByText('cards.dialog_title')).toBeInTheDocument();
	});
});
