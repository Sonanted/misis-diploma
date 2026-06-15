import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithRouter } from '@/test/test-utils';
import { OperationsList } from '../index';

vi.mock('@/features/transaction-filter', () => ({
	TransactionFilter: () => <div data-testid="tx-filter" />,
}));

vi.mock('@/entities/account/queries', () => ({
	useAccounts: vi.fn(),
}));

vi.mock('@/entities/operation/queries', () => ({
	useOperations: vi.fn(),
	useOperationsSummary: vi.fn(),
}));

describe('OperationsList', () => {
	it('shows skeleton while loading', async () => {
		const { useAccounts } = await import('@/entities/account/queries');
		const { useOperations, useOperationsSummary } = await import('@/entities/operation/queries');

		vi.mocked(useAccounts).mockReturnValue({ data: [] } as never);
		vi.mocked(useOperations).mockReturnValue({
			data: undefined,
			isLoading: true,
			fetchNextPage: vi.fn(),
			hasNextPage: false,
			isFetchingNextPage: false,
		} as never);
		vi.mocked(useOperationsSummary).mockReturnValue({ data: { income: 0, expenses: 0 } } as never);

		const { container } = renderWithRouter(<OperationsList />);
		expect(container).toBeInTheDocument();
	});

	it('renders operations title when data is loaded', async () => {
		const { useAccounts } = await import('@/entities/account/queries');
		const { useOperations, useOperationsSummary } = await import('@/entities/operation/queries');

		vi.mocked(useAccounts).mockReturnValue({ data: [] } as never);
		vi.mocked(useOperations).mockReturnValue({
			data: { pages: [{ items: [], total: 0, limit: 20, offset: 0 }] },
			isLoading: false,
			fetchNextPage: vi.fn(),
			hasNextPage: false,
			isFetchingNextPage: false,
		} as never);
		vi.mocked(useOperationsSummary).mockReturnValue({
			data: { income: 1000, expenses: -500 },
		} as never);

		renderWithRouter(<OperationsList />);
		expect(screen.getByText('operations.title')).toBeInTheDocument();
	});

	it('renders income summary card', async () => {
		const { useAccounts } = await import('@/entities/account/queries');
		const { useOperations, useOperationsSummary } = await import('@/entities/operation/queries');

		vi.mocked(useAccounts).mockReturnValue({ data: [] } as never);
		vi.mocked(useOperations).mockReturnValue({
			data: { pages: [{ items: [], total: 0, limit: 20, offset: 0 }] },
			isLoading: false,
			fetchNextPage: vi.fn(),
			hasNextPage: false,
			isFetchingNextPage: false,
		} as never);
		vi.mocked(useOperationsSummary).mockReturnValue({
			data: { income: 0, expenses: 0 },
		} as never);

		renderWithRouter(<OperationsList />);
		expect(screen.getByText('operations.income_this_month')).toBeInTheDocument();
		expect(screen.getByText('operations.expenses_this_month')).toBeInTheDocument();
	});

	it('shows total count when operations exist', async () => {
		const { useAccounts } = await import('@/entities/account/queries');
		const { useOperations, useOperationsSummary } = await import('@/entities/operation/queries');

		vi.mocked(useAccounts).mockReturnValue({ data: [] } as never);
		vi.mocked(useOperations).mockReturnValue({
			data: { pages: [{ items: [], total: 42, limit: 20, offset: 0 }] },
			isLoading: false,
			fetchNextPage: vi.fn(),
			hasNextPage: false,
			isFetchingNextPage: false,
		} as never);
		vi.mocked(useOperationsSummary).mockReturnValue({ data: { income: 0, expenses: 0 } } as never);

		renderWithRouter(<OperationsList />);
		expect(screen.getByText('(42)')).toBeInTheDocument();
	});

	it('shows load more button when hasNextPage', async () => {
		const { useAccounts } = await import('@/entities/account/queries');
		const { useOperations, useOperationsSummary } = await import('@/entities/operation/queries');

		vi.mocked(useAccounts).mockReturnValue({ data: [] } as never);
		vi.mocked(useOperations).mockReturnValue({
			data: { pages: [{ items: [], total: 100, limit: 20, offset: 0 }] },
			isLoading: false,
			fetchNextPage: vi.fn(),
			hasNextPage: true,
			isFetchingNextPage: false,
		} as never);
		vi.mocked(useOperationsSummary).mockReturnValue({ data: { income: 0, expenses: 0 } } as never);

		renderWithRouter(<OperationsList />);
		expect(screen.getByText('operations.load_more')).toBeInTheDocument();
	});
});
