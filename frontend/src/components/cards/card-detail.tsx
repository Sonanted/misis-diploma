import { CreditCard as CreditCardIcon, Lock, Trash2 } from 'lucide-react';
import { useParams } from 'react-router';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

const cardsData = {
	'1': {
		id: '1',
		name: 'Visa Platinum',
		cardNumber: '**** **** **** 4532',
		fullNumber: '4532 1234 5678 4532',
		expiryDate: '12/28',
		cvv: '***',
		balance: 2340.5,
		limit: 10000,
		type: 'Credit',
		status: 'Active',
		cardHolder: 'John Doe',
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
		cvv: '***',
		balance: 0,
		limit: 15000,
		type: 'Credit',
		status: 'Active',
		cardHolder: 'John Doe',
		transactions: [{ id: 't5', date: '2026-05-01', merchant: 'Payment Received', amount: -450.0 }],
	},
	'3': {
		id: '3',
		name: 'Debit Card',
		cardNumber: '**** **** **** 3456',
		fullNumber: '4532 9876 5432 3456',
		expiryDate: '03/26',
		cvv: '***',
		balance: 15420.5,
		limit: 0,
		type: 'Debit',
		status: 'Active',
		cardHolder: 'John Doe',
		transactions: [
			{ id: 't6', date: '2026-05-08', merchant: 'Grocery Store', amount: 127.45 },
			{ id: 't7', date: '2026-05-07', merchant: 'Pharmacy', amount: 34.2 },
		],
	},
};

export function CardDetail() {
	const { id } = useParams<{ id: string }>();
	const card = id ? cardsData[id as keyof typeof cardsData] : null;

	if (!card) {
		return (
			<div className="p-8">
				<p>Card not found</p>
			</div>
		);
	}

	return (
		<div className="p-8">
			<div className="mb-6">
				<div className="flex items-start justify-between mb-2">
					<h1 className="text-3xl font-semibold">{card.name}</h1>
					<div className="flex gap-2">
						<Badge variant="secondary">{card.type}</Badge>
						<Badge variant="outline">{card.status}</Badge>
					</div>
				</div>
				<p className="text-muted-foreground">{card.cardNumber}</p>
			</div>

			<div className="grid gap-6 mb-6">
				<Card className="bg-linear-to-br from-slate-900 to-slate-700 text-white border-0">
					<CardContent className="p-6">
						<div className="flex justify-between items-start mb-8">
							<CreditCardIcon className="size-10" />
							<p className="text-sm opacity-90">{card.type} Card</p>
						</div>
						<div className="space-y-4">
							<p className="text-xl tracking-wider font-mono">{card.fullNumber}</p>
							<div className="flex justify-between items-end">
								<div>
									<p className="text-xs opacity-70 mb-1">CARDHOLDER</p>
									<p className="font-medium">{card.cardHolder}</p>
								</div>
								<div className="text-right">
									<p className="text-xs opacity-70 mb-1">EXPIRES</p>
									<p className="font-medium">{card.expiryDate}</p>
								</div>
								<div className="text-right">
									<p className="text-xs opacity-70 mb-1">CVV</p>
									<p className="font-medium">{card.cvv}</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="grid gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>{card.type === 'Credit' ? 'Current Balance' : 'Available Balance'}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-4xl font-bold">
								${card.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
							</p>
							{card.type === 'Credit' && (
								<p className="text-sm text-muted-foreground mt-2">
									Available: $
									{(card.limit - card.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
								<p className="text-4xl font-bold">${card.limit.toLocaleString('en-US')}</p>
								<p className="text-sm text-muted-foreground mt-2">
									{((card.balance / card.limit) * 100).toFixed(1)}% utilized
								</p>
							</CardContent>
						</Card>
					)}
				</div>
			</div>

			<div className="flex gap-3 mb-6">
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
					<CardTitle>Recent Transactions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{card.transactions.map((transaction, index) => (
							<div key={transaction.id}>
								{index > 0 && <Separator className="mb-4" />}
								<div className="flex items-center justify-between">
									<div>
										<p className="font-medium">{transaction.merchant}</p>
										<p className="text-sm text-muted-foreground">{transaction.date}</p>
									</div>
									<p
										className={`font-semibold ${transaction.amount < 0 ? 'text-green-600' : 'text-foreground'}`}
									>
										{transaction.amount < 0 ? '+' : '-'}$
										{Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
									</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
