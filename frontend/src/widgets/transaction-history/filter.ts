import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import type { TransactionItem } from './transaction-list';

export function filterTransactions(
	transactions: TransactionItem[],
	typeFilter: string,
	dateRange: DateRange | undefined,
): TransactionItem[] {
	return transactions.filter((tx) => {
		if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
		if (dateRange?.from && tx.date < format(dateRange.from, 'yyyy-MM-dd')) return false;
		if (dateRange?.to && tx.date > format(dateRange.to, 'yyyy-MM-dd')) return false;
		return true;
	});
}
