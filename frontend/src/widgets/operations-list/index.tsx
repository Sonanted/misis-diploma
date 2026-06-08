import { TrendingDown, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePrivacyStore } from '@/features/balance-visibility/model';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { TransactionHistory } from '@/widgets/transaction-history';

const operations = [
	{
		id: '1',
		type: 'incoming',
		description: 'Salary Deposit',
		amount: 4500.0,
		date: '2026-05-07',
		account: 'Checking Account',
	},
	{
		id: '2',
		type: 'outgoing',
		description: 'Rent Payment',
		amount: 1850.0,
		date: '2026-05-06',
		account: 'Checking Account',
	},
	{
		id: '3',
		type: 'transfer',
		description: 'Transfer to Savings',
		amount: 2000.0,
		date: '2026-05-05',
		account: 'Checking → Savings',
	},
	{
		id: '4',
		type: 'outgoing',
		description: 'Electric Bill',
		amount: 89.32,
		date: '2026-05-04',
		account: 'Checking Account',
	},
	{
		id: '5',
		type: 'incoming',
		description: 'Freelance Payment',
		amount: 750.0,
		date: '2026-05-03',
		account: 'Business Account',
	},
	{
		id: '6',
		type: 'outgoing',
		description: 'Online Shopping',
		amount: 234.5,
		date: '2026-05-02',
		account: 'Credit Card',
	},
];

export function OperationsList() {
	const { t } = useTranslation();
	const balanceVisible = usePrivacyStore((s) => s.balanceVisible);

	const TYPE_LABELS: Record<string, string> = {
		incoming: t('operations.type_incoming'),
		outgoing: t('operations.type_outgoing'),
		transfer: t('operations.type_transfer'),
	};

	const TYPE_FILTER_OPTIONS = [
		{ value: 'all', label: t('operations.filter_all') },
		{ value: 'incoming', label: t('operations.filter_incoming') },
		{ value: 'outgoing', label: t('operations.filter_outgoing') },
		{ value: 'transfer', label: t('operations.filter_transfer') },
	];

	const transactionItems = operations.map((op) => ({
		id: op.id,
		date: op.date,
		description: op.description,
		amount: op.type === 'incoming' ? op.amount : -op.amount,
		type: op.type,
		typeLabel: TYPE_LABELS[op.type],
	}));

	const totalIncome = operations
		.filter((op) => op.type === 'incoming')
		.reduce((sum, op) => sum + op.amount, 0);

	const totalExpenses = operations
		.filter((op) => op.type !== 'incoming')
		.reduce((sum, op) => sum + op.amount, 0);

	const fmt = (n: number) =>
		balanceVisible ? `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$••••••';

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
					<CardTitle>{t('operations.all_operations')}</CardTitle>
				</CardHeader>
				<CardContent>
					<TransactionHistory
						transactions={transactionItems}
						typeOptions={TYPE_FILTER_OPTIONS}
						currency="$"
						locale="en-US"
						getDetailUrl={(id) => `/operations/${id}`}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
