import type { TransactionItem } from '@/widgets/transaction-history/transaction-list';

const NEUTRAL_TYPES = new Set(['other', 'internal']);

export function calculateTotals(items: TransactionItem[]): { income: number; expenses: number } {
	const financial = items.filter((ti) => !NEUTRAL_TYPES.has(ti.type ?? ''));
	const income = financial
		.filter((ti) => ti.amount > 0)
		.reduce((sum, ti) => sum + ti.amount, 0);
	const expenses = financial
		.filter((ti) => ti.amount < 0)
		.reduce((sum, ti) => sum + ti.amount, 0);
	return { income, expenses };
}
