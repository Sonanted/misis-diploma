import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import { describe, expect, it, vi } from 'vitest';
import { useCreateCard } from '@/entities/card/queries';
import { CreateCardDialog } from '../create-card-dialog';

vi.mock('sonner', () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));

const mockCardMutate = vi.fn();

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
	useCreateCard: vi.fn(() => ({ mutate: mockCardMutate, isPending: false })),
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

	it('renders custom React element trigger with onClick injected', () => {
		render(<CreateCardDialog trigger={<button type="button">Custom Trigger</button>} />);
		expect(screen.getByText('Custom Trigger')).toBeInTheDocument();
	});

	it('renders non-element trigger (string) directly without cloning', () => {
		render(<CreateCardDialog trigger={'Plain text trigger'} />);
		expect(screen.getByText('Plain text trigger')).toBeInTheDocument();
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

	it('calls createCard.mutate when form is submitted with defaultAccountId', async () => {
		mockCardMutate.mockClear();
		render(<CreateCardDialog defaultAccountId="acc_1" />);

		await userEvent.type(screen.getByPlaceholderText('cards.name_placeholder'), 'My Card');

		// With defaultAccountId pre-filled, selectedAccount is defined → submit is enabled
		const submitBtn = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
		await userEvent.click(submitBtn);

		await waitFor(() =>
			expect(mockCardMutate).toHaveBeenCalledWith(
				{ name: 'My Card', accountId: 'acc_1' },
				expect.any(Object),
			),
		);
	});

	it('calls toast.success on createCard success', async () => {
		mockCardMutate.mockClear();
		vi.mocked(toast.success).mockClear();
		render(<CreateCardDialog defaultAccountId="acc_1" />);

		await userEvent.type(screen.getByPlaceholderText('cards.name_placeholder'), 'My Card');
		const submitBtn = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
		await userEvent.click(submitBtn);

		await waitFor(() => expect(mockCardMutate).toHaveBeenCalled());
		const [, options] = mockCardMutate.mock.calls[0];
		options.onSuccess({ name: 'My Card' });

		expect(vi.mocked(toast.success)).toHaveBeenCalled();
	});

	it('calls toast.error on createCard error', async () => {
		mockCardMutate.mockClear();
		vi.mocked(toast.error).mockClear();
		render(<CreateCardDialog defaultAccountId="acc_1" />);

		await userEvent.type(screen.getByPlaceholderText('cards.name_placeholder'), 'My Card');
		const submitBtn = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
		await userEvent.click(submitBtn);

		await waitFor(() => expect(mockCardMutate).toHaveBeenCalled());
		const [, options] = mockCardMutate.mock.calls[0];
		options.onError(new Error('fail'));

		expect(vi.mocked(toast.error)).toHaveBeenCalledWith('cards.create_error');
	});

	it('disables submit when isPending', () => {
		vi.mocked(useCreateCard).mockImplementation(() => ({ mutate: mockCardMutate, isPending: true }));
		render(<CreateCardDialog defaultAccountId="acc_1" />);
		const submitBtn = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
		expect(submitBtn).toBeDisabled();
	});
});
