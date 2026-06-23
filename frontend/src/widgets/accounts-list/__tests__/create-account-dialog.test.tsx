import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import { describe, expect, it, vi } from 'vitest';
import { useCreateAccount } from '@/entities/account/queries';
import { CreateAccountDialog } from '../create-account-dialog';

vi.mock('sonner', () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));

const mockMutate = vi.fn();

vi.mock('@/entities/account/queries', () => ({
	useCreateAccount: vi.fn(() => ({ mutate: mockMutate, isPending: false })),
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

// Smart Select mock: passes onValueChange through so SelectItem clicks work
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
						? React.cloneElement(child as React.ReactElement<{ onValueChange?: (v: string) => void }>, {
								onValueChange,
							})
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
						? React.cloneElement(child as React.ReactElement<{ onValueChange?: (v: string) => void }>, {
								onValueChange,
							})
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

	it('shows credit limit field when credit type is selected', async () => {
		render(<CreateAccountDialog />);
		await userEvent.click(screen.getByText('accounts.type_credit'));
		await waitFor(() =>
			expect(screen.getByText(/accounts\.credit_limit_label/)).toBeInTheDocument(),
		);
	});

	it('calls createAccount.mutate on valid form submit', async () => {
		mockMutate.mockClear();
		render(<CreateAccountDialog />);

		await userEvent.type(
			screen.getByPlaceholderText('accounts.name_placeholder'),
			'My Account',
		);
		await userEvent.click(screen.getByText('accounts.type_checking'));
		await userEvent.click(screen.getByText('RUB — ₽'));

		const submitBtn = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
		await userEvent.click(submitBtn);

		await waitFor(() => expect(mockMutate).toHaveBeenCalled());
	});

	it('calls toast.success on createAccount success', async () => {
		mockMutate.mockClear();
		vi.mocked(toast.success).mockClear();
		render(<CreateAccountDialog />);

		await userEvent.type(
			screen.getByPlaceholderText('accounts.name_placeholder'),
			'Test',
		);
		await userEvent.click(screen.getByText('accounts.type_checking'));
		await userEvent.click(screen.getByText('RUB — ₽'));

		const submitBtn = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
		await userEvent.click(submitBtn);

		await waitFor(() => expect(mockMutate).toHaveBeenCalled());
		const [, options] = mockMutate.mock.calls[0];
		options.onSuccess({ name: 'Test' });

		expect(vi.mocked(toast.success)).toHaveBeenCalled();
	});

	it('calls toast.error on createAccount error', async () => {
		mockMutate.mockClear();
		vi.mocked(toast.error).mockClear();
		render(<CreateAccountDialog />);

		await userEvent.type(
			screen.getByPlaceholderText('accounts.name_placeholder'),
			'Test',
		);
		await userEvent.click(screen.getByText('accounts.type_checking'));
		await userEvent.click(screen.getByText('RUB — ₽'));

		const submitBtn = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
		await userEvent.click(submitBtn);

		await waitFor(() => expect(mockMutate).toHaveBeenCalled());
		const [, options] = mockMutate.mock.calls[0];
		options.onError(new Error('fail'));

		expect(vi.mocked(toast.error)).toHaveBeenCalledWith('accounts.create_error');
	});

	it('disables submit when isPending', () => {
		vi.mocked(useCreateAccount).mockImplementation(() => ({ mutate: mockMutate, isPending: true }));
		render(<CreateAccountDialog />);
		const submitBtn = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
		expect(submitBtn).toBeDisabled();
	});
});
