import { ArrowRight, CreditCard } from 'lucide-react';
import { Link } from 'react-router';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const cards = [
	{
		id: '1',
		name: 'Visa Platinum',
		cardNumber: '**** 4532',
		expiryDate: '12/28',
		balance: 2340.5,
		limit: 10000,
		type: 'Credit',
		status: 'Active',
	},
	{
		id: '2',
		name: 'Mastercard Gold',
		cardNumber: '**** 8765',
		expiryDate: '08/27',
		balance: 0,
		limit: 15000,
		type: 'Credit',
		status: 'Active',
	},
	{
		id: '3',
		name: 'Debit Card',
		cardNumber: '**** 3456',
		expiryDate: '03/26',
		balance: 15420.5,
		limit: 0,
		type: 'Debit',
		status: 'Active',
	},
];

export function CardsList() {
	return (
		<div className="p-8">
			<div className="mb-6">
				<h1 className="text-3xl font-semibold mb-2">Cards</h1>
				<p className="text-muted-foreground">Manage your debit and credit cards</p>
			</div>
			<div className="grid gap-4">
				{cards.map((card) => (
					<Link key={card.id} to={`/cards/${card.id}`}>
						<Card className="hover:bg-accent transition-colors cursor-pointer">
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-3">
										<div className="p-2 bg-primary/10 rounded-lg">
											<CreditCard className="size-5 text-primary" />
										</div>
										<div>
											<CardTitle className="text-xl">{card.name}</CardTitle>
											<p className="text-sm text-muted-foreground mt-1">
												{card.cardNumber} • Exp {card.expiryDate}
											</p>
										</div>
									</div>
									<div className="flex gap-2">
										<Badge variant="secondary">{card.type}</Badge>
										<Badge variant="outline">{card.status}</Badge>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between">
									<div>
										{card.type === 'Credit' ? (
											<>
												<p className="text-2xl font-bold">
													${card.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
												</p>
												<p className="text-sm text-muted-foreground mt-1">
													${(card.limit - card.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
													available of ${card.limit.toLocaleString('en-US')}
												</p>
											</>
										) : (
											<>
												<p className="text-2xl font-bold">
													${card.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
												</p>
												<p className="text-sm text-muted-foreground mt-1">Current Balance</p>
											</>
										)}
									</div>
									<ArrowRight className="size-5 text-muted-foreground" />
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
