import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { filterTransactions } from './filter';
import { TransactionListActions } from './transaction-list-actions';
import { TransactionList, type TransactionItem } from './transaction-list';

type UncontrolledProps = {
	typeFilter?: never;
	onTypeFilterChange?: never;
	dateRange?: never;
	onDateRangeChange?: never;
	isFiltered?: never;
	onReset?: never;
};

type ControlledProps = {
	typeFilter: string;
	onTypeFilterChange: (v: string) => void;
	dateRange: DateRange | undefined;
	onDateRangeChange: (r: DateRange | undefined) => void;
	isFiltered: boolean;
	onReset: () => void;
};

type Props = {
	transactions: TransactionItem[];
	typeOptions?: { value: string; label: string }[];
	currency?: string;
	locale?: string;
	emptyMessage?: string;
	getDetailUrl?: (id: string) => string;
} & (ControlledProps | UncontrolledProps);

export function TransactionHistory({
	transactions,
	typeOptions,
	currency,
	locale,
	emptyMessage,
	getDetailUrl,
	typeFilter: externalTypeFilter,
	onTypeFilterChange,
	dateRange: externalDateRange,
	onDateRangeChange,
	isFiltered: externalIsFiltered,
	onReset: externalOnReset,
}: Props) {
	const isControlled = !!onTypeFilterChange;

	const [internalTypeFilter, setInternalTypeFilter] = useState('all');
	const [internalDateRange, setInternalDateRange] = useState<DateRange | undefined>(undefined);

	const typeFilter = isControlled ? (externalTypeFilter ?? 'all') : internalTypeFilter;
	const dateRange = isControlled ? externalDateRange : internalDateRange;
	const isFiltered = isControlled
		? (externalIsFiltered ?? false)
		: internalTypeFilter !== 'all' || internalDateRange !== undefined;

	const handleTypeChange = isControlled ? (onTypeFilterChange ?? (() => {})) : setInternalTypeFilter;
	const handleDateChange = isControlled
		? (onDateRangeChange ?? (() => {}))
		: setInternalDateRange;
	const handleReset = isControlled
		? (externalOnReset ?? (() => {}))
		: () => {
				setInternalTypeFilter('all');
				setInternalDateRange(undefined);
			};

	// When controlled, server already filtered — no client-side filtering needed
	const displayed = isControlled
		? transactions
		: filterTransactions(transactions, typeFilter, dateRange);

	return (
		<div>
			<div className="flex mb-1">
				<TransactionListActions
					dateRange={dateRange}
					onDateRangeChange={handleDateChange}
					typeOptions={typeOptions}
					typeFilter={typeFilter}
					onTypeFilterChange={handleTypeChange}
					isFiltered={isFiltered}
					onReset={handleReset}
				/>
			</div>
			<TransactionList
				transactions={displayed}
				currency={currency}
				locale={locale}
				emptyMessage={emptyMessage}
				getDetailUrl={getDetailUrl}
			/>
		</div>
	);
}
