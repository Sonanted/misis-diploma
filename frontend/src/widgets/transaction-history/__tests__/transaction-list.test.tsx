import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { usePrivacyStore } from '@/features/balance-visibility/model';
import { renderWithRouter } from '@/test/test-utils';
import type { TransactionItem } from '../transaction-list';
import { TransactionList } from '../transaction-list';

const tx = (overrides: Partial<TransactionItem> = {}): TransactionItem => ({
	id: '1',
	date: '2024-06-01',
	description: 'Coffee shop',
	amount: -25,
	type: 'outgoing',
	typeLabel: 'Outgoing',
	fromAccountNumber: null,
	toAccountNumber: null,
	...overrides,
});

describe('TransactionList', () => {
	it('shows custom emptyMessage when list is empty', () => {
		renderWithRouter(<TransactionList transactions={[]} emptyMessage="No history" />);
		expect(screen.getByText('No history')).toBeInTheDocument();
	});

	it('shows i18n key as empty message when no override', () => {
		renderWithRouter(<TransactionList transactions={[]} />);
		expect(screen.getByText('transaction_history.empty')).toBeInTheDocument();
	});

	it('renders transaction description', () => {
		renderWithRouter(<TransactionList transactions={[tx()]} />);
		expect(screen.getByText('Coffee shop')).toBeInTheDocument();
	});

	it('renders transaction date', () => {
		renderWithRouter(<TransactionList transactions={[tx()]} />);
		expect(screen.getByText('2024-06-01')).toBeInTheDocument();
	});

	it('renders typeLabel badge', () => {
		renderWithRouter(<TransactionList transactions={[tx({ typeLabel: 'Outgoing' })]} />);
		expect(screen.getByText('Outgoing')).toBeInTheDocument();
	});

	it('renders multiple transactions', () => {
		const txs = [
			tx({ id: '1', description: 'First' }),
			tx({ id: '2', description: 'Second' }),
		];
		renderWithRouter(<TransactionList transactions={txs} />);
		expect(screen.getByText('First')).toBeInTheDocument();
		expect(screen.getByText('Second')).toBeInTheDocument();
	});

	it('hides balance when privacy store is toggled off', () => {
		usePrivacyStore.setState({ balanceVisible: false });
		renderWithRouter(<TransactionList transactions={[tx()]} currency="RUB" />);
		expect(screen.getByText(/•••• RUB/)).toBeInTheDocument();
		usePrivacyStore.setState({ balanceVisible: true });
	});

	it('shows amount when balance is visible', () => {
		usePrivacyStore.setState({ balanceVisible: true });
		renderWithRouter(<TransactionList transactions={[tx({ amount: 100 })]} currency="₽" locale="en-US" />);
		expect(screen.queryByText(/••••/)).not.toBeInTheDocument();
	});

	it('renders account route for internal transfers', () => {
		const transfer = tx({
			type: 'internal',
			fromAccountNumber: '11112222',
			toAccountNumber: '33334444',
		});
		renderWithRouter(<TransactionList transactions={[transfer]} />);
		expect(screen.getByText(/•• 2222/)).toBeInTheDocument();
		expect(screen.getByText(/•• 4444/)).toBeInTheDocument();
	});
});
