import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { useAccounts } from '@/entities/account/queries';
import { useOperation } from '@/entities/operation/queries';
import { OperationDetail } from '../index';

const mockOp = {
	id: 'op_1',
	type: 'transfer' as const,
	fromAccountId: 'acc_ext',
	toAccountId: 'acc_1',
	fromAccountNumber: '12345678901234',
	toAccountNumber: '98765432109876',
	amount: 1500.0,
	description: 'Test payment',
	createdAt: new Date('2024-01-15T10:30:00').toISOString(),
	currency: 'RUB',
};

vi.mock('@/entities/operation/queries', () => ({
	useOperation: vi.fn(() => ({ data: mockOp, isLoading: false, isError: false })),
}));

vi.mock('@/entities/account/queries', () => ({
	useAccounts: vi.fn(() => ({
		data: [{ id: 'acc_1', accountNumber: '98765432109876' }],
	})),
}));

vi.mock('react-router', async (importOriginal) => {
	const actual = await importOriginal<typeof import('react-router')>();
	return { ...actual, useParams: () => ({ id: 'op_1' }) };
});

function renderOperationDetail() {
	return render(
		<MemoryRouter>
			<OperationDetail />
		</MemoryRouter>,
	);
}

describe('OperationDetail', () => {
	it('renders operation description', () => {
		renderOperationDetail();
		expect(screen.getByRole('heading', { name: 'Test payment' })).toBeInTheDocument();
	});

	it('renders amount', () => {
		renderOperationDetail();
		expect(screen.getByText(/1 500,00/)).toBeInTheDocument();
	});

	it('shows loading skeleton when isLoading', () => {
		vi.mocked(useOperation).mockReturnValueOnce({
			data: undefined,
			isLoading: true,
			isError: false,
		} as ReturnType<typeof useOperation>);
		const { container } = renderOperationDetail();
		expect(container.firstChild).toBeInTheDocument();
		expect(screen.queryByText('Test payment')).not.toBeInTheDocument();
	});

	it('shows NotFound when isError', () => {
		vi.mocked(useOperation).mockReturnValueOnce({
			data: undefined,
			isLoading: false,
			isError: true,
		} as ReturnType<typeof useOperation>);
		renderOperationDetail();
		expect(screen.getByText('operations.not_found_title')).toBeInTheDocument();
	});

	it('renders completed badge', () => {
		renderOperationDetail();
		expect(screen.getByText('operations.status_completed')).toBeInTheDocument();
	});

	it('renders from account label', () => {
		renderOperationDetail();
		expect(screen.getByText('operations.from')).toBeInTheDocument();
	});

	it('renders to account label', () => {
		renderOperationDetail();
		expect(screen.getByText('operations.to')).toBeInTheDocument();
	});

	it('shows internal badge when both accounts belong to user', () => {
		vi.mocked(useOperation).mockReturnValueOnce({
			data: { ...mockOp, fromAccountId: 'acc_1', toAccountId: 'acc_2' },
			isLoading: false,
			isError: false,
		} as ReturnType<typeof useOperation>);
		vi.mocked(useAccounts).mockReturnValueOnce({
			data: [
				{ id: 'acc_1', accountNumber: '12345678901234' },
				{ id: 'acc_2', accountNumber: '98765432109876' },
			],
		} as ReturnType<typeof useAccounts>);
		renderOperationDetail();
		expect(screen.getByText('operations.type_internal')).toBeInTheDocument();
	});

	it('renders topup operation', () => {
		vi.mocked(useOperation).mockReturnValueOnce({
			data: {
				...mockOp,
				type: 'topup',
				fromAccountId: null,
				fromAccountNumber: null,
				description: null,
			},
			isLoading: false,
			isError: false,
		} as ReturnType<typeof useOperation>);
		renderOperationDetail();
		expect(screen.getByText('operations.transaction_amount')).toBeInTheDocument();
	});

	it('shows type label when no description', () => {
		vi.mocked(useOperation).mockReturnValueOnce({
			data: { ...mockOp, description: null },
			isLoading: false,
			isError: false,
		} as ReturnType<typeof useOperation>);
		renderOperationDetail();
		expect(screen.getByRole('heading', { name: 'operations.type_transfer' })).toBeInTheDocument();
	});

	it('renders notes when description present', () => {
		renderOperationDetail();
		expect(screen.getByText('operations.notes')).toBeInTheDocument();
		// description appears in both h1 heading and the notes section
		expect(screen.getAllByText('Test payment')).toHaveLength(2);
	});

	it('renders reference number section', () => {
		renderOperationDetail();
		expect(screen.getByText('operations.reference_number')).toBeInTheDocument();
		expect(screen.getByText('op_1')).toBeInTheDocument();
	});
});
