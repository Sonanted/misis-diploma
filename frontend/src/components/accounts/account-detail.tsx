import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CreditCard, FileText, PlusCircle, Send, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { Link, useParams } from 'react-router';
import { cn } from '@/lib/utils';
import { NotFound } from '@/pages/NotFound/NotFound';
import { Badge } from '../ui/badge';
import { Button, buttonVariants } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Separator } from '../ui/separator';

const TRANSACTION_TYPE = {
	TopUp: 'top_up',
	Transfer: 'transfer',
} as const;

type TransactionType = (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE];

type TypeFilter = 'all' | TransactionType;

const TYPE_LABELS: Record<TransactionType, string> = {
	top_up: 'Пополнение',
	transfer: 'Перевод',
};

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
				amount: 45000.0,
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

const TYPE_FILTER_OPTIONS: { value: TypeFilter; label: string }[] = [
	{ value: 'all', label: 'Все' },
	{ value: TRANSACTION_TYPE.TopUp, label: 'Пополнения' },
	{ value: TRANSACTION_TYPE.Transfer, label: 'Переводы' },
];

export function AccountDetail() {
	const { id } = useParams<{ id: string }>();
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
	const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

	const account = id ? accountsData[id as keyof typeof accountsData] : null;

	if (!account) {
		return (
			<NotFound
				title="Счёт не найден"
				description="Такого счёта не существует или он был удалён."
				backTo="/accounts"
				backLabel="К счетам"
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

	return (
		<div className="p-8">
			<div className="mb-6">
				<div className="flex items-start justify-between mb-2">
					<h1 className="text-3xl font-semibold">{account.name}</h1>
					<Badge variant="secondary">{account.type}</Badge>
				</div>
				<p className="text-muted-foreground">{account.accountNumber}</p>
			</div>

			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Доступный баланс</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-4xl font-bold">
						{account.balance.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽
					</p>
					<p className="text-sm text-muted-foreground mt-2">{account.currency}</p>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
				<Link to="/new-payment">
					<Button className="w-full">
						<Send className="size-4 mr-2" />
						Перевести
					</Button>
				</Link>
				<Button>
					<PlusCircle className="size-4 mr-2" />
					Пополнить
				</Button>
				<Button onClick={() => setDetailsOpen(true)}>
					<FileText className="size-4 mr-2" />
					Реквизиты
				</Button>
			</div>

			<Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Реквизиты счёта</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 pt-2">
						<div>
							<p className="text-sm text-muted-foreground">Номер счёта</p>
							<p className="font-mono text-sm mt-0.5">{account.fullAccountNumber}</p>
						</div>
						<Separator />
						<div>
							<p className="text-sm text-muted-foreground">БИК</p>
							<p className="font-mono text-sm mt-0.5">{account.bik}</p>
						</div>
						<Separator />
						<div>
							<p className="text-sm text-muted-foreground">Корр. счёт</p>
							<p className="font-mono text-sm mt-0.5">{account.corrAccount}</p>
						</div>
						<Separator />
						<div>
							<p className="text-sm text-muted-foreground">Банк</p>
							<p className="text-sm mt-0.5">{account.bank}</p>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Привязанные карты</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{account.linkedCards.map((card, index) => (
							<div key={card.id}>
								{index > 0 && <Separator className="mb-3" />}
								<Link
									to={`/cards/${card.id}`}
									className="flex items-center justify-between hover:bg-accent -mx-3 px-3 py-2 rounded-md transition-colors"
								>
									<div className="flex items-center gap-3">
										<div className="p-2 bg-primary/10 rounded-lg">
											<CreditCard className="size-4 text-primary" />
										</div>
										<div>
											<p className="font-medium text-sm">{card.name}</p>
											<p className="text-xs text-muted-foreground">{card.cardNumber}</p>
										</div>
									</div>
									<Badge variant="secondary" className="text-xs">
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
					<div className="flex items-center justify-between">
						<CardTitle>Последние операции</CardTitle>
						<Popover>
							<PopoverTrigger
								className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'relative')}
							>
								<SlidersHorizontal className="size-4" />
								{isFiltered && <span className="absolute top-1 right-1 size-1.5 rounded-full bg-primary" />}
							</PopoverTrigger>
							<PopoverContent align="end" className="w-auto p-0">
								<div className="p-3 flex flex-col gap-3">
									<p className="text-sm font-medium">Фильтры</p>

									<div className="flex flex-col gap-1.5">
										<p className="text-xs text-muted-foreground">Период</p>
										<Calendar
											mode="range"
											locale={ru}
											captionLayout="dropdown"
											selected={dateRange}
											onSelect={(range) => setDateRange(range)}
										/>
									</div>

									<div className="flex flex-col gap-1.5">
										<p className="text-xs text-muted-foreground">Тип операции</p>
										<div className="flex gap-1">
											{TYPE_FILTER_OPTIONS.map((opt) => (
												<Button
													key={opt.value}
													size="sm"
													variant={typeFilter === opt.value ? 'default' : 'outline'}
													onClick={() => setTypeFilter(opt.value)}
												>
													{opt.label}
												</Button>
											))}
										</div>
									</div>

									{isFiltered && (
										<Button variant="ghost" size="sm" className="w-full" onClick={resetFilters}>
											Сбросить фильтры
										</Button>
									)}
								</div>
							</PopoverContent>
						</Popover>
					</div>
				</CardHeader>

				<CardContent>
					{filteredTransactions.length === 0 ? (
						<p className="text-sm text-muted-foreground text-center py-4">Операции не найдены</p>
					) : (
						<div className="space-y-4">
							{filteredTransactions.map((transaction, index) => (
								<div key={transaction.id}>
									{index > 0 && <Separator className="mb-4" />}
									<div className="flex items-center justify-between">
										<div>
											<div className="flex items-center gap-2">
												<p className="font-medium">{transaction.description}</p>
												<Badge variant="secondary" className="text-xs">
													{TYPE_LABELS[transaction.type]}
												</Badge>
											</div>
											<p className="text-sm text-muted-foreground">{transaction.date}</p>
										</div>
										<p
											className={`font-semibold ${
												transaction.amount > 0 ? 'text-green-600' : 'text-foreground'
											}`}
										>
											{transaction.amount > 0 ? '+' : '−'}
											{Math.abs(transaction.amount).toLocaleString('ru-RU', {
												minimumFractionDigits: 2,
											})}{' '}
											₽
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
