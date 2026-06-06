import { format } from 'date-fns';
import { CreditCard, FileText, PlusCircle, Send } from 'lucide-react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { BalanceToggle } from '@/features/balance-visibility/balance-toggle';
import { usePrivacyStore } from '@/features/balance-visibility/model';
import { TransactionFilter } from '@/features/transaction-filter';
import { NotFound } from '@/pages/not-found';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Separator } from '@/shared/ui/separator';
import { TransactionHistory, type TransactionItem } from '@/widgets/transaction-history';

const TRANSACTION_TYPE = {
	TopUp: 'top_up',
	Transfer: 'transfer',
} as const;

type TransactionType = (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE];

type TypeFilter = 'all' | TransactionType;

const accountsData = {
	'1': {
		id: '1',
		name: 'Расчётный счёт',
		accountNumber: '40817 810 0 **** **** 3456',
		fullAccountNumber: '40817 8100 0000 0001 2345',
		balance: 15420.5,
		currency: 'RUB',
		type: 'Текущий',
		bik: '044525225',
		corrAccount: '30101 8104 0000 0002 25',
		bank: 'ПАО Сбербанк',
		linkedCards: [
			{ id: '3', name: 'Дебетовая карта', cardNumber: '**** 3456', type: 'Дебетовая' },
			{ id: '1', name: 'Visa Platinum', cardNumber: '**** 4532', type: 'Кредитная' },
		],
		recentTransactions: [
			{
				id: 't1',
				date: '2026-05-08',
				description: 'Магазин «Перекрёсток»',
				amount: -1274.5,
				type: TRANSACTION_TYPE.Transfer,
			},
			{
				id: 't2',
				date: '2026-05-07',
				description: 'Зачисление зарплаты',
				amount: 4500000000.0,
				type: TRANSACTION_TYPE.TopUp,
			},
			{
				id: 't3',
				date: '2026-05-06',
				description: 'Оплата ЖКХ',
				amount: -4832.0,
				type: TRANSACTION_TYPE.Transfer,
			},
			{
				id: 't4',
				date: '2026-05-05',
				description: 'Перевод на накопительный',
				amount: -15000.0,
				type: TRANSACTION_TYPE.Transfer,
			},
		],
	},
	'2': {
		id: '2',
		name: 'Накопительный счёт',
		accountNumber: '42301 810 0 **** **** 7890',
		fullAccountNumber: '42301 8100 0000 0005 6789',
		balance: 487502.25,
		currency: 'RUB',
		type: 'Накопительный',
		bik: '044525225',
		corrAccount: '30101 8104 0000 0002 25',
		bank: 'ПАО Сбербанк',
		linkedCards: [{ id: '2', name: 'Mastercard Gold', cardNumber: '**** 8765', type: 'Кредитная' }],
		recentTransactions: [
			{
				id: 't5',
				date: '2026-05-01',
				description: 'Начисление процентов',
				amount: 1252.5,
				type: TRANSACTION_TYPE.TopUp,
			},
			{
				id: 't6',
				date: '2026-04-28',
				description: 'Перевод с расчётного',
				amount: 15000.0,
				type: TRANSACTION_TYPE.TopUp,
			},
		],
	},
	'3': {
		id: '3',
		name: 'Кредитный счёт',
		accountNumber: '45506 810 0 **** **** 1234',
		fullAccountNumber: '45506 8100 0000 0009 0123',
		balance: -92340.0,
		currency: 'RUB',
		type: 'Кредитный',
		bik: '044525225',
		corrAccount: '30101 8104 0000 0002 25',
		bank: 'ПАО Сбербанк',
		linkedCards: [{ id: '6', name: 'Бизнес-дебет', cardNumber: '**** 5566', type: 'Дебетовая' }],
		recentTransactions: [
			{
				id: 't7',
				date: '2026-05-08',
				description: 'Платёж по кредиту',
				amount: -15400.0,
				type: TRANSACTION_TYPE.Transfer,
			},
			{
				id: 't8',
				date: '2026-05-07',
				description: 'Покупка техники',
				amount: -34050.0,
				type: TRANSACTION_TYPE.Transfer,
			},
			{
				id: 't9',
				date: '2026-05-06',
				description: 'Зачисление кредита',
				amount: 100000.0,
				type: TRANSACTION_TYPE.TopUp,
			},
		],
	},
};

export function AccountDetail() {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const [detailsOpen, setDetailsOpen] = useState(false);
	const { balanceVisible, toggle } = usePrivacyStore();
	const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
	const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

	const TYPE_LABELS: Record<TransactionType, string> = {
		top_up: t('account_detail.type_topup'),
		transfer: t('account_detail.type_transfer'),
	};

	const TYPE_FILTER_OPTIONS: { value: TypeFilter; label: string }[] = [
		{ value: 'all', label: t('account_detail.filter_all') },
		{ value: TRANSACTION_TYPE.TopUp, label: t('account_detail.filter_topup') },
		{ value: TRANSACTION_TYPE.Transfer, label: t('account_detail.filter_transfer') },
	];

	const account = id ? accountsData[id as keyof typeof accountsData] : null;

	if (!account) {
		return (
			<NotFound
				title={t('account_detail.not_found_title')}
				description={t('account_detail.not_found_description')}
				backTo="/accounts"
				backLabel={t('account_detail.back')}
			/>
		);
	}

	const isFiltered = typeFilter !== 'all' || dateRange !== undefined;

	const filteredTransactions = account.recentTransactions.filter((t) => {
		if (typeFilter !== 'all' && t.type !== typeFilter) return false;
		if (dateRange?.from && t.date < format(dateRange.from, 'yyyy-MM-dd')) return false;
		if (dateRange?.to && t.date > format(dateRange.to, 'yyyy-MM-dd')) return false;
		return true;
	});

	function resetFilters() {
		setDateRange(undefined);
		setTypeFilter('all');
	}

	const transactionItems: TransactionItem[] = filteredTransactions.map((tx) => ({
		id: tx.id,
		date: tx.date,
		description: tx.description,
		amount: tx.amount,
		typeLabel: TYPE_LABELS[tx.type],
	}));

	return (
		<div className="p-4 sm:p-8">
			<div className="mb-6">
				<div className="flex items-start justify-between flex-wrap gap-y-2 mb-2">
					<h1 className="text-2xl sm:text-3xl font-semibold">{account.name}</h1>
					<Badge variant="secondary">{account.type}</Badge>
				</div>
				<p className="text-sm text-muted-foreground break-all">{account.accountNumber}</p>
			</div>

			<Card className="mb-6">
				<CardHeader>
					<CardTitle>{t('account_detail.available_balance')}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-2">
						<p className="text-3xl sm:text-4xl font-bold">
							{balanceVisible
								? `${account.balance.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽`
								: '•••••• ₽'}
						</p>
						<BalanceToggle visible={balanceVisible} onToggle={toggle} />
					</div>
					<p className="text-sm text-muted-foreground mt-2">{account.currency}</p>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
				<Link to="/new-payment" className="w-full">
					<Button className="w-full">
						<Send className="size-4 mr-2" />
						{t('account_detail.transfer')}
					</Button>
				</Link>
				<Button className="w-full">
					<PlusCircle className="size-4 mr-2" />
					{t('account_detail.topup')}
				</Button>
				<Button className="w-full" onClick={() => setDetailsOpen(true)}>
					<FileText className="size-4 mr-2" />
					{t('account_detail.details')}
				</Button>
			</div>

			<Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t('account_detail.details_title')}</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 pt-2">
						<div>
							<p className="text-sm text-muted-foreground">{t('account_detail.account_number')}</p>
							<p className="font-mono text-sm mt-0.5">{account.fullAccountNumber}</p>
						</div>
						<Separator />
						<div>
							<p className="text-sm text-muted-foreground">{t('account_detail.bik')}</p>
							<p className="font-mono text-sm mt-0.5">{account.bik}</p>
						</div>
						<Separator />
						<div>
							<p className="text-sm text-muted-foreground">{t('account_detail.corr_account')}</p>
							<p className="font-mono text-sm mt-0.5">{account.corrAccount}</p>
						</div>
						<Separator />
						<div>
							<p className="text-sm text-muted-foreground">{t('account_detail.bank')}</p>
							<p className="text-sm mt-0.5">{account.bank}</p>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			<Card className="mb-6">
				<CardHeader>
					<CardTitle>{t('account_detail.linked_cards')}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{account.linkedCards.map((card, index) => (
							<div key={card.id}>
								{index > 0 && <Separator className="mb-3" />}
								<Link
									to={`/cards/${card.id}`}
									className="flex items-center justify-between hover:bg-accent -mx-3 px-3 py-2 rounded-md transition-colors gap-2"
								>
									<div className="flex items-center gap-3 min-w-0 flex-1">
										<div className="p-2 bg-primary/10 rounded-lg shrink-0">
											<CreditCard className="size-4 text-primary" />
										</div>
										<div className="min-w-0">
											<p className="font-medium text-sm">{card.name}</p>
											<p className="text-xs text-muted-foreground">{card.cardNumber}</p>
										</div>
									</div>
									<Badge variant="secondary" className="text-xs shrink-0">
										{card.type}
									</Badge>
								</Link>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between flex-wrap gap-y-2">
						<CardTitle>{t('account_detail.recent_operations')}</CardTitle>
						<div className="flex items-center gap-1">
							<BalanceToggle visible={balanceVisible} onToggle={toggle} />
							<TransactionFilter
								dateRange={dateRange}
								onDateRangeChange={setDateRange}
								typeOptions={TYPE_FILTER_OPTIONS}
								typeFilter={typeFilter}
								onTypeFilterChange={(v) => setTypeFilter(v as TypeFilter)}
								isFiltered={isFiltered}
								onReset={resetFilters}
							/>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					<TransactionHistory
						transactions={transactionItems}
						getDetailUrl={(txId) => `/operations/${txId}`}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
