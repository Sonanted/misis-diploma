import { TrendingDown, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAccounts } from '@/entities/account/queries';
import { operationToTransactionItem } from '@/entities/operation/helpers';
import { useOperations } from '@/entities/operation/queries';
import { usePrivacyStore } from '@/features/balance-visibility/model';
import { formatBalance } from '@/shared/helpers';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { TransactionHistory } from '@/widgets/transaction-history';

export function OperationsList() {
	const { t } = useTranslation();
	const balanceVisible = usePrivacyStore((s) => s.balanceVisible);

	const { data: accounts = [] } = useAccounts();
	const userAccountIds = new Set(accounts.map((a) => a.id));

	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useOperations();

	const allOps = data?.pages.flatMap((p) => p.items) ?? [];
	const total = data?.pages[0]?.total ?? 0;

	const TYPE_FILTER_OPTIONS = [
		{ value: 'all', label: t('operations.filter_all') },
		{ value: 'incoming', label: t('operations.filter_incoming') },
		{ value: 'outgoing', label: t('operations.filter_outgoing') },
		{ value: 'internal', label: t('operations.filter_internal') },
		{ value: 'other', label: t('operations.filter_other') },
	];

	const transactionItems = allOps.map((op) =>
		operationToTransactionItem(op, t, userAccountIds),
	);

	const financialOps = allOps.filter((op) => op.amount !== null);
	const currency = accounts[0]?.currency ?? 'RUB';

	const NEUTRAL_TYPES = new Set(['other', 'internal']);

	const totalIncome = financialOps
		.filter((op) => {
			const dir = transactionItems.find((ti) => ti.id === op.id);
			return dir && dir.amount > 0 && !NEUTRAL_TYPES.has(dir.type ?? '');
		})
		.reduce((sum, op) => sum + (op.amount ?? 0), 0);

	const totalExpenses = financialOps
		.filter((op) => {
			const dir = transactionItems.find((ti) => ti.id === op.id);
			return dir && dir.amount < 0 && !NEUTRAL_TYPES.has(dir.type ?? '');
		})
		.reduce((sum, op) => sum + (op.amount ?? 0), 0);

	const fmt = (n: number) =>
		balanceVisible ? formatBalance(n, currency) : `•••••• ${currency}`;

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
					<CardContent>
						<p className="text-2xl sm:text-3xl font-bold text-green-600">+{fmt(totalIncome)}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<TrendingDown className="size-4" />
							{t('operations.expenses_this_month')}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl sm:text-3xl font-bold">−{fmt(totalExpenses)}</p>
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
						currency={currency}
						locale="ru-RU"
						getDetailUrl={(id) => `/operations/${id}`}
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
