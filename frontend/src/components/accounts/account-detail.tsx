import { ArrowLeft, CreditCard, Download, Send } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

const accountsData = {
	'1': {
		id: '1',
		name: 'Checking Account',
		accountNumber: '4532 **** **** 3456',
		balance: 15420.5,
		currency: 'USD',
		type: 'Checking',
		iban: 'US64 SVBK 0000 0000 0000 3456',
		swift: 'SVBKUS6S',
		linkedCards: [
			{ id: '3', name: 'Debit Card', cardNumber: '**** 3456', type: 'Debit' },
			{ id: '1', name: 'Visa Platinum', cardNumber: '**** 4532', type: 'Credit' },
		],
		recentTransactions: [
			{ id: 't1', date: '2026-05-08', description: 'Grocery Store', amount: -127.45 },
			{ id: 't2', date: '2026-05-07', description: 'Salary Deposit', amount: 4500.0 },
			{ id: 't3', date: '2026-05-06', description: 'Electric Bill', amount: -89.32 },
			{ id: 't4', date: '2026-05-05', description: 'Online Transfer', amount: -250.0 },
		],
	},
	'2': {
		id: '2',
		name: 'Savings Account',
		accountNumber: '4532 **** **** 7890',
		balance: 48750.25,
		currency: 'USD',
		type: 'Savings',
		iban: 'US64 SVBK 0000 0000 0000 7890',
		swift: 'SVBKUS6S',
		linkedCards: [{ id: '2', name: 'Mastercard Gold', cardNumber: '**** 8765', type: 'Credit' }],
		recentTransactions: [
			{ id: 't5', date: '2026-05-01', description: 'Interest Payment', amount: 125.25 },
			{ id: 't6', date: '2026-04-28', description: 'Transfer from Checking', amount: 2000.0 },
		],
	},
	'3': {
		id: '3',
		name: 'Business Account',
		accountNumber: '4532 **** **** 1234',
		balance: 92340.0,
		currency: 'USD',
		type: 'Business',
		iban: 'US64 SVBK 0000 0000 0000 1234',
		swift: 'SVBKUS6S',
		linkedCards: [{ id: '6', name: 'Business Debit', cardNumber: '**** 5566', type: 'Debit' }],
		recentTransactions: [
			{ id: 't7', date: '2026-05-08', description: 'Client Payment', amount: 5400.0 },
			{ id: 't8', date: '2026-05-07', description: 'Office Supplies', amount: -340.5 },
			{ id: 't9', date: '2026-05-06', description: 'Software Subscription', amount: -299.0 },
		],
	},
};

export function AccountDetail() {
	const { id } = useParams<{ id: string }>();
	const account = id ? accountsData[id as keyof typeof accountsData] : null;

	if (!account) {
		return (
			<div className="p-8">
				<p>Account not found</p>
			</div>
		);
	}

	return (
		<div className="p-8">
			<Link to="/accounts">
				<Button variant="ghost" className="mb-6">
					<ArrowLeft className="size-4 mr-2" />
					Back to Accounts
				</Button>
			</Link>

			<div className="mb-6">
				<div className="flex items-start justify-between mb-2">
					<h1 className="text-3xl font-semibold">{account.name}</h1>
					<Badge variant="secondary">{account.type}</Badge>
				</div>
				<p className="text-muted-foreground">{account.accountNumber}</p>
			</div>

			<div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-6">
				<Card>
					<CardHeader>
						<CardTitle>Available Balance</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-4xl font-bold">
							${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
						</p>
						<p className="text-sm text-muted-foreground mt-2">{account.currency}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Account Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div>
							<p className="text-sm text-muted-foreground">IBAN</p>
							<p className="font-mono text-sm">{account.iban}</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">SWIFT/BIC</p>
							<p className="font-mono text-sm">{account.swift}</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="flex gap-3 mb-6">
				<Link to="/new-payment" className="flex-1">
					<Button className="w-full">
						<Send className="size-4 mr-2" />
						Send Money
					</Button>
				</Link>
				<Button variant="outline" className="flex-1">
					<Download className="size-4 mr-2" />
					Download Statement
				</Button>
			</div>

			<div className="grid gap-6 md:grid-cols-1 mb-6">
				<Card>
					<CardHeader>
						<CardTitle>Linked Cards</CardTitle>
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
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Recent Transactions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{account.recentTransactions.map((transaction, index) => (
							<div key={transaction.id}>
								{index > 0 && <Separator className="mb-4" />}
								<div className="flex items-center justify-between">
									<div>
										<p className="font-medium">{transaction.description}</p>
										<p className="text-sm text-muted-foreground">{transaction.date}</p>
									</div>
									<p
										className={`font-semibold ${
											transaction.amount > 0 ? 'text-green-600' : 'text-foreground'
										}`}
									>
										{transaction.amount > 0 ? '+' : ''}$
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
