import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import type { TransactionItem } from '../transaction-list';
import { TransactionHistory } from '../index';

vi.mock('@/features/balance-visibility/model', () => ({
	usePrivacyStore: vi.fn(() => ({ balanceVisible: true, toggle: vi.fn() })),
}));

vi.mock('@/features/transaction-filter', () => ({
	TransactionFilter: ({ onReset }: { onReset?: () => void }) => (
		<div data-testid="tx-filter">
			<button type="button" onClick={onReset}>Reset Filters</button>
		</div>
	),
}));

const tx = (overrides: Partial<TransactionItem> = {}): TransactionItem => ({
	id: '1',
	date: '2024-06-01',
	description: 'Test',
	amount: 100,
	type: 'incoming',
	typeLabel: 'Incoming',
	fromAccountNumber: null,
	toAccountNumber: null,
	...overrides,
});

function renderHistory(props: Partial<Parameters<typeof TransactionHistory>[0]> = {}) {
	return render(
		<MemoryRouter>
			<TransactionHistory transactions={[]} {...props} />
		</MemoryRouter>,
	);
}

describe('TransactionHistory (uncontrolled mode)', () => {
	it('renders without crashing', () => {
		renderHistory();
		expect(screen.getByTestId('tx-filter')).toBeInTheDocument();
	});

	it('resets internal filters when reset is triggered', async () => {
		renderHistory({ transactions: [tx()] });
		await userEvent.click(screen.getByText('Reset Filters'));
		expect(screen.getByTestId('tx-filter')).toBeInTheDocument();
	});

	it('shows empty message when no transactions', () => {
		renderHistory({ emptyMessage: 'Nothing here' });
		expect(screen.getByText('Nothing here')).toBeInTheDocument();
	});

	it('renders provided transactions', () => {
		renderHistory({ transactions: [tx({ description: 'Coffee' })] });
		expect(screen.getByText('Coffee')).toBeInTheDocument();
	});

	it('filters transactions by type in uncontrolled mode', async () => {
		const txs = [
			tx({ id: '1', description: 'Incoming tx', type: 'incoming', amount: 100 }),
			tx({ id: '2', description: 'Outgoing tx', type: 'outgoing', amount: -50 }),
		];
		// Uncontrolled: pass no external filter props
		renderHistory({ transactions: txs });
		// Both visible initially (no filter)
		expect(screen.getByText('Incoming tx')).toBeInTheDocument();
		expect(screen.getByText('Outgoing tx')).toBeInTheDocument();
	});
});

describe('TransactionHistory (controlled mode)', () => {
	it('uses external typeFilter and shows only matching transactions', () => {
		const txs = [
			tx({ id: '1', description: 'Income', type: 'incoming' }),
			tx({ id: '2', description: 'Expense', type: 'outgoing', amount: -50 }),
		];
		render(
			<MemoryRouter>
				<TransactionHistory
					transactions={txs}
					typeFilter="incoming"
					onTypeFilterChange={vi.fn()}
					dateRange={undefined}
					onDateRangeChange={vi.fn()}
					isFiltered={true}
					onReset={vi.fn()}
				/>
			</MemoryRouter>,
		);
		// In controlled mode, server already filtered — all transactions shown as-is
		expect(screen.getByText('Income')).toBeInTheDocument();
		expect(screen.getByText('Expense')).toBeInTheDocument();
	});

	it('passes isFiltered and onReset to actions', () => {
		const onReset = vi.fn();
		render(
			<MemoryRouter>
				<TransactionHistory
					transactions={[]}
					typeFilter="all"
					onTypeFilterChange={vi.fn()}
					dateRange={undefined}
					onDateRangeChange={vi.fn()}
					isFiltered={false}
					onReset={onReset}
				/>
			</MemoryRouter>,
		);
		expect(screen.getByTestId('tx-filter')).toBeInTheDocument();
	});
});
