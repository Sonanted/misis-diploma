import { format } from 'date-fns';
import { CreditCard as CreditCardIcon, Eye, EyeOff, ExternalLink, Lock, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { Link, useParams } from 'react-router';
import { BalanceToggle } from '@/features/balance-visibility/balance-toggle';
import { usePrivacyStore } from '@/features/balance-visibility/model';
import { TransactionFilter } from '@/features/transaction-filter';
import { NotFound } from '@/pages/not-found';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { TransactionHistory, type TransactionItem } from '@/widgets/transaction-history';

const cardsData = {
	'1': {
		id: '1',
		name: 'Visa Platinum',
		cardNumber: '**** **** **** 4532',
		fullNumber: '4532 1234 5678 4532',
		expiryDate: '12/28',
		cvv: '123',
		balance: 2340.5,
		limit: 10000,
		type: 'Credit',
		status: 'Active',
		cardHolder: 'John Doe',
		linkedAccountId: '1',
		linkedAccountName: 'Расчётный счёт',
		transactions: [
			{ id: 't1', date: '2026-05-08', merchant: 'Amazon.com', amount: 89.99 },
			{ id: 't2', date: '2026-05-07', merchant: 'Starbucks', amount: 12.5 },
			{ id: 't3', date: '2026-05-06', merchant: 'Gas Station', amount: 65.0 },
			{ id: 't4', date: '2026-05-05', merchant: 'Restaurant', amount: 78.25 },
		],
	},
	'2': {
		id: '2',
		name: 'Mastercard Gold',
		cardNumber: '**** **** **** 8765',
		fullNumber: '5412 3456 7890 8765',
		expiryDate: '08/27',
		cvv: '456',
		balance: 0,
		limit: 15000,
		type: 'Credit',
		status: 'Active',
		cardHolder: 'John Doe',
		linkedAccountId: '2',
		linkedAccountName: 'Накопительный счёт',
		transactions: [{ id: 't5', date: '2026-05-01', merchant: 'Payment Received', amount: -450.0 }],
	},
	'3': {
		id: '3',
		name: 'Debit Card',
		cardNumber: '**** **** **** 3456',
		fullNumber: '4532 9876 5432 3456',
		expiryDate: '03/26',
		cvv: '789',
		balance: 15420.5,
		limit: 0,
		type: 'Debit',
		status: 'Active',
		cardHolder: 'John Doe',
		linkedAccountId: '1',
		linkedAccountName: 'Расчётный счёт',
		transactions: [
			{ id: 't6', date: '2026-05-08', merchant: 'Grocery Store', amount: 127.45 },
			{ id: 't7', date: '2026-05-07', merchant: 'Pharmacy', amount: 34.2 },
		],
	},
};

export function CardDetail() {
	const { id } = useParams<{ id: string }>();
	const { balanceVisible, toggle } = usePrivacyStore();
	const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
	const [cardInfoVisible, setCardInfoVisible] = useState(false);
	const card = id ? cardsData[id as keyof typeof cardsData] : null;

	if (!card) {
		return (
			<NotFound
				title="Card Not Found"
				description="The card you're looking for doesn't exist or has been removed."
				backTo="/cards"
				backLabel="Go to Cards"
			/>
		);
	}

	const isFiltered = dateRange !== undefined;

	function resetFilters() {
		setDateRange(undefined);
	}

	const filteredTransactions = card.transactions.filter((t) => {
		if (dateRange?.from && t.date < format(dateRange.from, 'yyyy-MM-dd')) return false;
		if (dateRange?.to && t.date > format(dateRange.to, 'yyyy-MM-dd')) return false;
		return true;
	});

	// card sign convention: positive = charge (expense), negative = refund (income)
	// TransactionItem convention: positive = income, negative = expense → negate
	const transactionItems: TransactionItem[] = filteredTransactions.map((t) => ({
		id: t.id,
		date: t.date,
		description: t.merchant,
		amount: -t.amount,
	}));

	return (
		<div className="p-4 sm:p-8">
			<div className="mb-6">
				<div className="flex items-start justify-between flex-wrap gap-y-2 mb-2">
					<h1 className="text-2xl sm:text-3xl font-semibold">{card.name}</h1>
					<div className="flex gap-2">
						<Badge variant="secondary">{card.type}</Badge>
						<Badge variant="outline">{card.status}</Badge>
					</div>
				</div>
				<p className="text-sm text-muted-foreground">{card.cardNumber}</p>
			</div>

			<div className="grid gap-6 mb-6">
				<div className="flex justify-center">
					<div
						className="w-full max-w-sm rounded-2xl bg-linear-to-br from-slate-900 to-slate-700 text-white p-4 sm:p-6 flex flex-col justify-between shadow-xl"
						style={{ aspectRatio: '85.6/53.98' }}
					>
						<div className="flex justify-between items-start">
							<CreditCardIcon className="size-6 sm:size-8" />
							<div className="flex items-center gap-2">
								<span className="text-xs opacity-80">{card.type}</span>
								<button
									type="button"
									onClick={() => setCardInfoVisible((v) => !v)}
									className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
									aria-label={cardInfoVisible ? 'Hide card info' : 'Show card info'}
								>
									{cardInfoVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
								</button>
							</div>
						</div>

						<p className="text-sm sm:text-base tracking-wider sm:tracking-widest font-mono">
							{cardInfoVisible
								? card.fullNumber
								: `•••• •••• •••• ${card.fullNumber.slice(-4)}`}
						</p>

						<div className="flex justify-between items-end">
							<div>
								<p className="text-[10px] opacity-60 mb-1">CARDHOLDER</p>
								<p className="text-xs sm:text-sm font-medium">{card.cardHolder}</p>
							</div>
							<div className="text-center">
								<p className="text-[10px] opacity-60 mb-1">EXPIRES</p>
								<p className="text-xs sm:text-sm font-medium font-mono">
									{cardInfoVisible ? card.expiryDate : '••/••'}
								</p>
							</div>
							<div className="text-right">
								<p className="text-[10px] opacity-60 mb-1">CVV</p>
								<p className="text-xs sm:text-sm font-medium font-mono">
									{cardInfoVisible ? card.cvv : '•••'}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>
								{card.type === 'Credit' ? 'Current Balance' : 'Available Balance'}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-2">
								<p className="text-3xl sm:text-4xl font-bold">
									{balanceVisible
										? `$${card.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
										: '$••••••'}
								</p>
								<BalanceToggle visible={balanceVisible} onToggle={toggle} />
							</div>
							{card.type === 'Credit' && (
								<p className="text-sm text-muted-foreground mt-2">
									Available:{' '}
									{balanceVisible
										? `$${(card.limit - card.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
										: '$••••••'}
								</p>
							)}
						</CardContent>
					</Card>

					{card.type === 'Credit' && (
						<Card>
							<CardHeader>
								<CardTitle>Credit Limit</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-3xl sm:text-4xl font-bold">
									${card.limit.toLocaleString('en-US')}
								</p>
								<p className="text-sm text-muted-foreground mt-2">
									{((card.balance / card.limit) * 100).toFixed(1)}% utilized
								</p>
							</CardContent>
						</Card>
					)}
				</div>
			</div>

			<div className="flex gap-2 sm:gap-3 mb-6">
				<Link to={`/accounts/${card.linkedAccountId}`} className="flex-1">
					<Button variant="outline" className="w-full">
						<ExternalLink className="size-4 mr-2" />
						{card.linkedAccountName}
					</Button>
				</Link>
				<Button variant="outline" className="flex-1">
					<Lock className="size-4 mr-2" />
					Lock Card
				</Button>
				<Button variant="outline" className="flex-1">
					<Trash2 className="size-4 mr-2" />
					Cancel Card
				</Button>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between flex-wrap gap-y-2">
						<CardTitle>Recent Transactions</CardTitle>
						<div className="flex items-center gap-1">
							<BalanceToggle visible={balanceVisible} onToggle={toggle} />
							<TransactionFilter
								dateRange={dateRange}
								onDateRangeChange={setDateRange}
								isFiltered={isFiltered}
								onReset={resetFilters}
							/>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<TransactionHistory
						transactions={transactionItems}
						currency="$"
						locale="en-US"
						getDetailUrl={(id) => `/operations/${id}`}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
