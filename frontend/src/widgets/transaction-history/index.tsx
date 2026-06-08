import { format } from 'date-fns';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { TransactionListActions } from './transaction-list-actions';
import { TransactionList, type TransactionItem } from './transaction-list';

type Props = {
	transactions: TransactionItem[];
	typeOptions?: { value: string; label: string }[];
	currency?: string;
	locale?: string;
	emptyMessage?: string;
	getDetailUrl?: (id: string) => string;
};

export function TransactionHistory({
	transactions,
	typeOptions,
	currency,
	locale,
	emptyMessage,
	getDetailUrl,
}: Props) {
	const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
	const [typeFilter, setTypeFilter] = useState('all');

	const isFiltered = typeFilter !== 'all' || dateRange !== undefined;

	const filtered = transactions.filter((tx) => {
		if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
		if (dateRange?.from && tx.date < format(dateRange.from, 'yyyy-MM-dd')) return false;
		if (dateRange?.to && tx.date > format(dateRange.to, 'yyyy-MM-dd')) return false;
		return true;
	});

	const resetFilters = () => {
		setDateRange(undefined);
		setTypeFilter('all');
	};

	return (
		<div>
			<div className="flex mb-1">
				<TransactionListActions
					dateRange={dateRange}
					onDateRangeChange={setDateRange}
					typeOptions={typeOptions}
					typeFilter={typeFilter}
					onTypeFilterChange={setTypeFilter}
					isFiltered={isFiltered}
					onReset={resetFilters}
				/>
			</div>
			<TransactionList
				transactions={filtered}
				currency={currency}
				locale={locale}
				emptyMessage={emptyMessage}
				getDetailUrl={getDetailUrl}
			/>
		</div>
	);
}
