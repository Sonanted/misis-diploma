import { describe, expect, it } from 'vitest';
import type { TransactionItem } from '@/widgets/transaction-history/transaction-list';
import { calculateTotals } from '../totals';

const item = (amount: number, type: string): TransactionItem => ({
	id: 'x',
	date: '2024-01-01',
	description: 'test',
	amount,
	type,
	typeLabel: type,
	fromAccountNumber: null,
	toAccountNumber: null,
});

describe('calculateTotals', () => {
	it('sums positive amounts as income', () => {
		const { income } = calculateTotals([item(100, 'incoming'), item(50, 'incoming')]);
		expect(income).toBe(150);
	});

	it('sums negative amounts as expenses', () => {
		const { expenses } = calculateTotals([item(-200, 'outgoing'), item(-50, 'outgoing')]);
		expect(expenses).toBe(-250);
	});

	it('excludes type "other" from both totals', () => {
		const { income, expenses } = calculateTotals([item(999, 'other'), item(100, 'incoming')]);
		expect(income).toBe(100);
		expect(expenses).toBe(0);
	});

	it('excludes type "internal" from both totals', () => {
		const { income, expenses } = calculateTotals([item(500, 'internal'), item(-300, 'outgoing')]);
		expect(income).toBe(0);
		expect(expenses).toBe(-300);
	});

	it('returns zeros for empty list', () => {
		const { income, expenses } = calculateTotals([]);
		expect(income).toBe(0);
		expect(expenses).toBe(0);
	});

	it('handles mixed list correctly', () => {
		const items = [
			item(200, 'incoming'),
			item(-100, 'outgoing'),
			item(500, 'internal'),
			item(0, 'other'),
		];
		const { income, expenses } = calculateTotals(items);
		expect(income).toBe(200);
		expect(expenses).toBe(-100);
	});
});
