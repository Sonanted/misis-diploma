import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CreateAccountDialog } from '../create-account-dialog';

vi.mock('@/entities/account/queries', () => ({
	useCreateAccount: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

// Render dialog content unconditionally to test form elements without opening
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

describe('CreateAccountDialog', () => {
	it('renders create button trigger', () => {
		render(<CreateAccountDialog />);
		// 'accounts.create' appears in both trigger button and submit button
		expect(screen.getAllByText('accounts.create')).toHaveLength(2);
	});

	it('renders dialog title', () => {
		render(<CreateAccountDialog />);
		expect(screen.getByText('accounts.dialog_title')).toBeInTheDocument();
	});

	it('renders name label and input', () => {
		render(<CreateAccountDialog />);
		expect(screen.getByText(/accounts\.name_label/)).toBeInTheDocument();
		expect(screen.getByPlaceholderText('accounts.name_placeholder')).toBeInTheDocument();
	});

	it('renders account type label', () => {
		render(<CreateAccountDialog />);
		expect(screen.getByText(/accounts\.type_label/)).toBeInTheDocument();
	});

	it('renders currency label', () => {
		render(<CreateAccountDialog />);
		expect(screen.getByText(/accounts\.currency_label/)).toBeInTheDocument();
	});

	it('renders account type options', () => {
		render(<CreateAccountDialog />);
		expect(screen.getByText('accounts.type_checking')).toBeInTheDocument();
		expect(screen.getByText('accounts.type_savings')).toBeInTheDocument();
		expect(screen.getByText('accounts.type_credit')).toBeInTheDocument();
		expect(screen.getByText('accounts.type_currency')).toBeInTheDocument();
	});

	it('renders currency options', () => {
		render(<CreateAccountDialog />);
		expect(screen.getByText('RUB — ₽')).toBeInTheDocument();
		expect(screen.getByText('USD — $')).toBeInTheDocument();
		expect(screen.getByText('EUR — €')).toBeInTheDocument();
	});

	it('renders cancel button', () => {
		render(<CreateAccountDialog />);
		expect(screen.getByText('accounts.cancel')).toBeInTheDocument();
	});

	it('renders dialog description', () => {
		render(<CreateAccountDialog />);
		expect(screen.getByText('accounts.dialog_description')).toBeInTheDocument();
	});
});
