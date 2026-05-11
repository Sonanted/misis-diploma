import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const accounts = [
	{
		id: '1',
		name: 'Checking Account',
		accountNumber: '****3456',
		balance: 15420.5,
		currency: 'USD',
		type: 'Checking',
	},
	{
		id: '2',
		name: 'Savings Account',
		accountNumber: '****7890',
		balance: 48750.25,
		currency: 'USD',
		type: 'Savings',
	},
	{
		id: '3',
		name: 'Business Account',
		accountNumber: '****1234',
		balance: 92340.0,
		currency: 'USD',
		type: 'Business',
	},
];

export function AccountsList() {
	return (
		<div className="p-8">
			<div className="mb-6">
				<h1 className="text-3xl font-semibold mb-2">Accounts</h1>
				<p className="text-muted-foreground">Manage your bank accounts</p>
			</div>
			<div className="grid gap-4">
				{accounts.map((account) => (
					<Link key={account.id} to={`/accounts/${account.id}`}>
						<Card className="hover:bg-accent transition-colors cursor-pointer">
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div>
										<CardTitle className="text-xl">{account.name}</CardTitle>
										<p className="text-sm text-muted-foreground mt-1">{account.accountNumber}</p>
									</div>
									<Badge variant="secondary">{account.type}</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between">
									<div>
										<p className="text-3xl font-bold">
											${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
										</p>
										<p className="text-sm text-muted-foreground mt-1">Available Balance</p>
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
