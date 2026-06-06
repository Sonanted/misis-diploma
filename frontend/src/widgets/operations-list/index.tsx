import { ArrowDownLeft, ArrowRight, ArrowUpRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';

const operations = [
	{
		id: '1',
		type: 'incoming',
		description: 'Salary Deposit',
		amount: 4500.0,
		date: '2026-05-07',
		time: '09:15 AM',
		status: 'Completed',
		account: 'Checking Account',
	},
	{
		id: '2',
		type: 'outgoing',
		description: 'Rent Payment',
		amount: 1850.0,
		date: '2026-05-06',
		time: '10:30 AM',
		status: 'Completed',
		account: 'Checking Account',
	},
	{
		id: '3',
		type: 'transfer',
		description: 'Transfer to Savings',
		amount: 2000.0,
		date: '2026-05-05',
		time: '02:45 PM',
		status: 'Completed',
		account: 'Checking → Savings',
	},
	{
		id: '4',
		type: 'outgoing',
		description: 'Electric Bill',
		amount: 89.32,
		date: '2026-05-04',
		time: '11:20 AM',
		status: 'Completed',
		account: 'Checking Account',
	},
	{
		id: '5',
		type: 'incoming',
		description: 'Freelance Payment',
		amount: 750.0,
		date: '2026-05-03',
		time: '04:15 PM',
		status: 'Completed',
		account: 'Business Account',
	},
	{
		id: '6',
		type: 'outgoing',
		description: 'Online Shopping',
		amount: 234.5,
		date: '2026-05-02',
		time: '06:30 PM',
		status: 'Pending',
		account: 'Credit Card',
	},
];

const getOperationIcon = (type: string) => {
	switch (type) {
		case 'incoming':
			return <ArrowDownLeft className="size-5 text-green-600" />;
		case 'outgoing':
			return <ArrowUpRight className="size-5 text-red-600" />;
		case 'transfer':
			return <RefreshCw className="size-5 text-blue-600" />;
		default:
			return null;
	}
};

export function OperationsList() {
	return (
		<div className="p-8">
			<div className="mb-6">
				<h1 className="text-3xl font-semibold mb-2">Operations</h1>
				<p className="text-muted-foreground">View all your transactions and transfers</p>
			</div>
			<div className="grid gap-4">
				{operations.map((operation) => (
					<Link key={operation.id} to={`/operations/${operation.id}`}>
						<Card className="hover:bg-accent transition-colors cursor-pointer">
							<CardContent className="p-4">
								<div className="flex items-center gap-4">
									<div className="p-2 bg-accent rounded-lg">{getOperationIcon(operation.type)}</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1 min-w-0">
												<p className="font-medium truncate">{operation.description}</p>
												<p className="text-sm text-muted-foreground">{operation.account}</p>
											</div>
											<div className="text-right shrink-0">
												<p
													className={`font-semibold ${
														operation.type === 'incoming'
															? 'text-green-600'
															: operation.type === 'outgoing'
																? 'text-foreground'
																: 'text-blue-600'
													}`}
												>
													{operation.type === 'incoming' ? '+' : operation.type === 'outgoing' ? '-' : ''}$
													{operation.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
												</p>
											</div>
										</div>
										<div className="flex items-center justify-between mt-2">
											<div className="flex items-center gap-2">
												<span className="text-xs text-muted-foreground">{operation.date}</span>
												<span className="text-xs text-muted-foreground">•</span>
												<span className="text-xs text-muted-foreground">{operation.time}</span>
											</div>
											<div className="flex items-center gap-2">
												<Badge
													variant={operation.status === 'Completed' ? 'default' : 'secondary'}
													className="text-xs"
												>
													{operation.status}
												</Badge>
												<ArrowRight className="size-4 text-muted-foreground" />
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
