import { format } from 'date-fns';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useTranslation } from 'react-i18next';
import { useAccounts } from '@/entities/account/queries';
import { operationToTransactionItem } from '@/entities/operation/helpers';
import type { OperationFilters } from '@/entities/operation/queries';
import { useOperations, useOperationsSummary } from '@/entities/operation/queries';
import { usePrivacyStore } from '@/features/balance-visibility/model';
import { formatBalance } from '@/shared/helpers';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import { Skeleton } from '@/shared/ui/skeleton';
import { TransactionHistory } from '@/widgets/transaction-history';

export function OperationsList() {
	const { t } = useTranslation();
	const balanceVisible = usePrivacyStore((s) => s.balanceVisible);

	const [typeFilter, setTypeFilter] = useState('all');
	const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

	const filters: OperationFilters = {
		direction:
			typeFilter !== 'all'
				? (typeFilter as OperationFilters['direction'])
				: undefined,
		dateFrom: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
		dateTo: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
	};

	const isFiltered = typeFilter !== 'all' || dateRange !== undefined;

	const resetFilters = () => {
		setTypeFilter('all');
		setDateRange(undefined);
	};

	const { data: accounts = [] } = useAccounts();
	const userAccountIds = new Set(accounts.map((a) => a.id));
	const accountCurrencyMap = new Map(accounts.map((a) => [a.id, a.currency]));

	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useOperations(filters);
	const { data: summary } = useOperationsSummary();

	const allOps = data?.pages.flatMap((p) => p.items) ?? [];
	const total = data?.pages[0]?.total ?? 0;

	const CURRENCY_ORDER = ['RUB', 'USD', 'EUR'] as const;
	const summaryEntries = CURRENCY_ORDER
		.filter((c) => {
			const entry = summary?.[c];
			return c === 'RUB' || (entry && (entry.income > 0 || entry.expenses > 0));
		})
		.map((c) => ({ currency: c, ...(summary?.[c] ?? { income: 0, expenses: 0 }) }));

	const TYPE_FILTER_OPTIONS = [
		{ value: 'all', label: t('operations.filter_all') },
		{ value: 'incoming', label: t('operations.filter_incoming') },
		{ value: 'outgoing', label: t('operations.filter_outgoing') },
		{ value: 'internal', label: t('operations.filter_internal') },
		{ value: 'other', label: t('operations.filter_other') },
	];

	const transactionItems = allOps.map((op) =>
		operationToTransactionItem(op, t, userAccountIds, null, accountCurrencyMap),
	);

	const fmt = (n: number, c: string) =>
		balanceVisible ? formatBalance(n, c as Parameters<typeof formatBalance>[1]) : `•••••• ${c}`;

	if (isLoading) {
		return (
			<div className="p-4 sm:p-8 space-y-4">
				<Skeleton className="h-8 w-48" />
				<div className="grid grid-cols-2 gap-4">
					<Skeleton className="h-24 rounded-xl" />
					<Skeleton className="h-24 rounded-xl" />
				</div>
				<Skeleton className="h-64 rounded-xl" />
			</div>
		);
	}

	return (
		<div className="p-4 sm:p-8">
			<div className="mb-6">
				<h1 className="text-2xl sm:text-3xl font-semibold mb-2">{t('operations.title')}</h1>
				<p className="text-muted-foreground">{t('operations.description')}</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<TrendingUp className="size-4 text-green-600" />
							{t('operations.income_this_month')}
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						{summaryEntries.map(({ currency: c, income }, i) => (
							<div key={c}>
								{i > 0 && <Separator className="mb-2" />}
								<p className="text-2xl sm:text-3xl font-bold text-green-600">+{fmt(income, c)}</p>
							</div>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<TrendingDown className="size-4" />
							{t('operations.expenses_this_month')}
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						{summaryEntries.map(({ currency: c, expenses }, i) => (
							<div key={c}>
								{i > 0 && <Separator className="mb-2" />}
								<p className="text-2xl sm:text-3xl font-bold">−{fmt(expenses, c)}</p>
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			<Card className="gap-1">
				<CardHeader>
					<CardTitle>
						{t('operations.all_operations')}
						{total > 0 && (
							<span className="ml-2 text-sm font-normal text-muted-foreground">({total})</span>
						)}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<TransactionHistory
						transactions={transactionItems}
						typeOptions={TYPE_FILTER_OPTIONS}
						currency={accounts[0]?.currency ?? 'RUB'}
						locale="ru-RU"
						getDetailUrl={(id) => `/operations/${id}`}
						typeFilter={typeFilter}
						onTypeFilterChange={setTypeFilter}
						dateRange={dateRange}
						onDateRangeChange={setDateRange}
						isFiltered={isFiltered}
						onReset={resetFilters}
					/>
					{hasNextPage && (
						<div className="mt-4 flex justify-center">
							<Button
								variant="outline"
								onClick={() => fetchNextPage()}
								disabled={isFetchingNextPage}
							>
								{isFetchingNextPage ? '...' : t('operations.load_more')}
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
