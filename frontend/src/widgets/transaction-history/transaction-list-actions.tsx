import type { DateRange } from 'react-day-picker';
import { BalanceToggle } from '@/features/balance-visibility/balance-toggle';
import { usePrivacyStore } from '@/features/balance-visibility/model';
import { TransactionFilter } from '@/features/transaction-filter';

type Props = {
	dateRange: DateRange | undefined;
	onDateRangeChange: (range: DateRange | undefined) => void;
	typeOptions?: { value: string; label: string }[];
	typeFilter: string;
	onTypeFilterChange: (value: string) => void;
	isFiltered: boolean;
	onReset: () => void;
};

export function TransactionListActions({
	dateRange,
	onDateRangeChange,
	typeOptions,
	typeFilter,
	onTypeFilterChange,
	isFiltered,
	onReset,
}: Props) {
	const { balanceVisible, toggle } = usePrivacyStore();
	return (
		<div className="flex items-center gap-1">
			<BalanceToggle visible={balanceVisible} onToggle={toggle} />
			<TransactionFilter
				dateRange={dateRange}
				onDateRangeChange={onDateRangeChange}
				typeOptions={typeOptions}
				typeFilter={typeFilter}
				onTypeFilterChange={onTypeFilterChange}
				isFiltered={isFiltered}
				onReset={onReset}
			/>
		</div>
	);
}
