import { describe, expect, it } from 'vitest';
import type { TransactionItem } from '../transaction-list';
import { filterTransactions } from '../filter';

const item = (overrides: Partial<TransactionItem> = {}): TransactionItem => ({
	id: '1',
	date: '2024-06-01',
	description: 'test',
	amount: 100,
	type: 'incoming',
	typeLabel: 'incoming',
	fromAccountNumber: null,
	toAccountNumber: null,
	...overrides,
});

describe('filterTransactions', () => {
	it('returns all when type filter is "all"', () => {
		const txs = [item({ type: 'incoming' }), item({ id: '2', type: 'outgoing' })];
		expect(filterTransactions(txs, 'all', undefined)).toHaveLength(2);
	});

	it('filters by specific type', () => {
		const txs = [item({ type: 'incoming' }), item({ id: '2', type: 'outgoing' })];
		const result = filterTransactions(txs, 'incoming', undefined);
		expect(result).toHaveLength(1);
		expect(result[0].type).toBe('incoming');
	});

	it('returns empty when no items match type', () => {
		const txs = [item({ type: 'incoming' })];
		expect(filterTransactions(txs, 'outgoing', undefined)).toHaveLength(0);
	});

	it('filters out transactions before dateRange.from', () => {
		const txs = [item({ date: '2024-01-01' }), item({ id: '2', date: '2024-06-01' })];
		const result = filterTransactions(txs, 'all', { from: new Date('2024-03-01') });
		expect(result).toHaveLength(1);
		expect(result[0].date).toBe('2024-06-01');
	});

	it('filters out transactions after dateRange.to', () => {
		const txs = [item({ date: '2024-01-01' }), item({ id: '2', date: '2024-06-01' })];
		const result = filterTransactions(txs, 'all', { to: new Date('2024-03-01') });
		expect(result).toHaveLength(1);
		expect(result[0].date).toBe('2024-01-01');
	});

	it('applies both from and to date range', () => {
		const txs = [
			item({ id: '1', date: '2024-01-01' }),
			item({ id: '2', date: '2024-03-15' }),
			item({ id: '3', date: '2024-06-01' }),
		];
		const result = filterTransactions(txs, 'all', {
			from: new Date('2024-02-01'),
			to: new Date('2024-04-01'),
		});
		expect(result).toHaveLength(1);
		expect(result[0].date).toBe('2024-03-15');
	});

	it('combines type and date filters', () => {
		const txs = [
			item({ id: '1', type: 'incoming', date: '2024-03-15' }),
			item({ id: '2', type: 'outgoing', date: '2024-03-15' }),
			item({ id: '3', type: 'incoming', date: '2024-01-01' }),
		];
		const result = filterTransactions(txs, 'incoming', { from: new Date('2024-02-01') });
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe('1');
	});

	it('includes boundary dates', () => {
		const txs = [item({ date: '2024-03-01' })];
		const result = filterTransactions(txs, 'all', {
			from: new Date('2024-03-01'),
			to: new Date('2024-03-01'),
		});
		expect(result).toHaveLength(1);
	});
});
