import { ArrowDownLeft, ArrowUpRight, Download, RefreshCw, Share2 } from 'lucide-react';
import { useParams } from 'react-router';
import { NotFound } from '@/pages/not-found';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

const operationsData = {
	'1': {
		id: '1',
		type: 'incoming',
		description: 'Salary Deposit',
		amount: 4500.0,
		date: '2026-05-07',
		time: '09:15 AM',
		status: 'Completed',
		account: 'Checking Account',
		accountNumber: '****3456',
		reference: 'SAL-2026-05',
		sender: 'ABC Corporation',
		senderAccount: 'Corp Account ****9012',
		category: 'Income',
		notes: 'Monthly salary payment',
	},
	'2': {
		id: '2',
		type: 'outgoing',
		description: 'Rent Payment',
		amount: 1850.0,
		date: '2026-05-06',
		time: '10:30 AM',
		status: 'Completed',
		account: 'Checking Account',
		accountNumber: '****3456',
		reference: 'RENT-MAY-2026',
		recipient: 'Property Management LLC',
		recipientAccount: '****5678',
		category: 'Housing',
		notes: 'Monthly rent for May 2026',
	},
	'3': {
		id: '3',
		type: 'transfer',
		description: 'Transfer to Savings',
		amount: 2000.0,
		date: '2026-05-05',
		time: '02:45 PM',
		status: 'Completed',
		account: 'Checking → Savings',
		accountNumber: '****3456 → ****7890',
		reference: 'TRF-2026-05-05-001',
		category: 'Transfer',
		notes: 'Monthly savings transfer',
	},
	'4': {
		id: '4',
		type: 'outgoing',
		description: 'Electric Bill',
		amount: 89.32,
		date: '2026-05-04',
		time: '11:20 AM',
		status: 'Completed',
		account: 'Checking Account',
		accountNumber: '****3456',
		reference: 'ELEC-APR-2026',
		recipient: 'City Electric Company',
		recipientAccount: '****1111',
		category: 'Utilities',
		notes: 'April 2026 electricity bill',
	},
	'5': {
		id: '5',
		type: 'incoming',
		description: 'Freelance Payment',
		amount: 750.0,
		date: '2026-05-03',
		time: '04:15 PM',
		status: 'Completed',
		account: 'Business Account',
		accountNumber: '****1234',
		reference: 'INV-2026-042',
		sender: 'XYZ Consulting',
		senderAccount: '****4567',
		category: 'Income',
		notes: 'Web development project payment',
	},
	'6': {
		id: '6',
		type: 'outgoing',
		description: 'Online Shopping',
		amount: 234.5,
		date: '2026-05-02',
		time: '06:30 PM',
		status: 'Pending',
		account: 'Credit Card',
		accountNumber: '****4532',
		reference: 'ORD-123456789',
		recipient: 'Amazon.com',
		category: 'Shopping',
		notes: 'Electronics and accessories',
	},
};

const getOperationIcon = (type: string) => {
	switch (type) {
		case 'incoming':
			return <ArrowDownLeft className="size-8 text-green-600" />;
		case 'outgoing':
			return <ArrowUpRight className="size-8 text-red-600" />;
		case 'transfer':
			return <RefreshCw className="size-8 text-blue-600" />;
		default:
			return null;
	}
};

export function OperationDetail() {
	const { id } = useParams<{ id: string }>();
	const operation = id ? operationsData[id as keyof typeof operationsData] : null;

	if (!operation) {
		return (
			<NotFound
				title="Operation Not Found"
				description="This operation doesn't exist or has been removed."
				backTo="/operations"
				backLabel="Go to Operations"
			/>
		);
	}

	return (
		<div className="p-8">
			<div className="mb-6">
				<div className="flex items-start gap-4 mb-4">
					<div className="p-3 bg-accent rounded-xl">{getOperationIcon(operation.type)}</div>
					<div className="flex-1">
						<h1 className="text-3xl font-semibold mb-2">{operation.description}</h1>
						<p className="text-muted-foreground">{operation.account}</p>
					</div>
					<Badge variant={operation.status === 'Completed' ? 'default' : 'secondary'}>
						{operation.status}
					</Badge>
				</div>
			</div>

			<div className="grid gap-6 mb-6">
				<Card>
					<CardHeader>
						<CardTitle>Transaction Amount</CardTitle>
					</CardHeader>
					<CardContent>
						<p
							className={`text-5xl font-bold ${
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
						<p className="text-sm text-muted-foreground mt-2">
							{operation.date} at {operation.time}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Transaction Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-muted-foreground mb-1">Reference Number</p>
								<p className="font-mono text-sm">{operation.reference}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground mb-1">Category</p>
								<Badge variant="outline">{operation.category}</Badge>
							</div>
						</div>

						<Separator />

						<div>
							<p className="text-sm text-muted-foreground mb-1">Account</p>
							<p className="font-medium">{operation.account}</p>
							<p className="font-mono text-sm text-muted-foreground">{operation.accountNumber}</p>
						</div>

						{operation.type === 'incoming' && operation.sender && (
							<>
								<Separator />
								<div>
									<p className="text-sm text-muted-foreground mb-1">From</p>
									<p className="font-medium">{operation.sender}</p>
									{operation.senderAccount && (
										<p className="font-mono text-sm text-muted-foreground">{operation.senderAccount}</p>
									)}
								</div>
							</>
						)}

						{operation.type === 'outgoing' && operation.recipient && (
							<>
								<Separator />
								<div>
									<p className="text-sm text-muted-foreground mb-1">To</p>
									<p className="font-medium">{operation.recipient}</p>
									{operation.recipientAccount && (
										<p className="font-mono text-sm text-muted-foreground">{operation.recipientAccount}</p>
									)}
								</div>
							</>
						)}

						{operation.notes && (
							<>
								<Separator />
								<div>
									<p className="text-sm text-muted-foreground mb-1">Notes</p>
									<p className="text-sm">{operation.notes}</p>
								</div>
							</>
						)}
					</CardContent>
				</Card>
			</div>

			<div className="flex gap-3">
				<Button variant="outline" className="flex-1">
					<Download className="size-4 mr-2" />
					Download Receipt
				</Button>
				<Button variant="outline" className="flex-1">
					<Share2 className="size-4 mr-2" />
					Share
				</Button>
			</div>
		</div>
	);
}
