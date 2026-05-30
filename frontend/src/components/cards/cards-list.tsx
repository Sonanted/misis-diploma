import { ArrowRight, CreditCard, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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
	{
		id: '4',
		name: 'Visa Signature',
		cardNumber: '**** 2211',
		expiryDate: '06/29',
		balance: 5678.25,
		limit: 25000,
		type: 'Credit',
		status: 'Active',
	},
	{
		id: '5',
		name: 'Amex Platinum',
		cardNumber: '**** 3344',
		expiryDate: '11/27',
		balance: 1234.0,
		limit: 50000,
		type: 'Credit',
		status: 'Active',
	},
	{
		id: '6',
		name: 'Business Debit',
		cardNumber: '**** 5566',
		expiryDate: '09/26',
		balance: 34560.9,
		limit: 0,
		type: 'Debit',
		status: 'Active',
	},
	{
		id: '7',
		name: 'Travel Rewards Card',
		cardNumber: '**** 7788',
		expiryDate: '04/28',
		balance: 890.5,
		limit: 20000,
		type: 'Credit',
		status: 'Active',
	},
	{
		id: '8',
		name: 'Cashback Card',
		cardNumber: '**** 9900',
		expiryDate: '02/27',
		balance: 3456.8,
		limit: 12000,
		type: 'Credit',
		status: 'Active',
	},
	{
		id: '9',
		name: 'Student Debit',
		cardNumber: '**** 1133',
		expiryDate: '07/26',
		balance: 890.25,
		limit: 0,
		type: 'Debit',
		status: 'Active',
	},
	{
		id: '10',
		name: 'Premium Black Card',
		cardNumber: '**** 2244',
		expiryDate: '10/29',
		balance: 12340.0,
		limit: 100000,
		type: 'Credit',
		status: 'Active',
	},
	{
		id: '11',
		name: 'Discover Card',
		cardNumber: '**** 5577',
		expiryDate: '05/28',
		balance: 456.75,
		limit: 8000,
		type: 'Credit',
		status: 'Active',
	},
	{
		id: '12',
		name: 'Joint Debit Card',
		cardNumber: '**** 6688',
		expiryDate: '01/27',
		balance: 8920.4,
		limit: 0,
		type: 'Debit',
		status: 'Active',
	},
];

export function CardsList() {
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState({
		cardName: '',
		cardType: '',
		linkedAccount: '',
		creditLimit: '',
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.cardName || !formData.cardType || !formData.linkedAccount) {
			toast.error('Please fill in all required fields');
			return;
		}

		if (formData.cardType === 'credit' && !formData.creditLimit) {
			toast.error('Please enter a credit limit for credit cards');
			return;
		}

		toast.success('Card created successfully!', {
			description: `${formData.cardName} has been created and will arrive in 5-7 business days`,
		});

		setFormData({
			cardName: '',
			cardType: '',
			linkedAccount: '',
			creditLimit: '',
		});
		setOpen(false);
	};

	return (
		<div className="p-8">
			<div className="mb-6 flex items-start justify-between">
				<div>
					<h1 className="text-3xl font-semibold mb-2">Cards</h1>
					<p className="text-muted-foreground">Manage your debit and credit cards</p>
				</div>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="size-4 mr-2" />
							Create Card
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create New Card</DialogTitle>
							<DialogDescription>
								Request a new debit or credit card. Fill in the details below.
							</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="cardName">Card Name *</Label>
								<Input
									id="cardName"
									placeholder="e.g., My Travel Card"
									value={formData.cardName}
									onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="cardType">Card Type *</Label>
								<Select
									value={formData.cardType}
									onValueChange={(value) => setFormData({ ...formData, cardType: value })}
								>
									<SelectTrigger id="cardType">
										<SelectValue placeholder="Select card type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="debit">Debit Card</SelectItem>
										<SelectItem value="credit">Credit Card</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="linkedAccount">Linked Account *</Label>
								<Select
									value={formData.linkedAccount}
									onValueChange={(value) => setFormData({ ...formData, linkedAccount: value })}
								>
									<SelectTrigger id="linkedAccount">
										<SelectValue placeholder="Select account" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="checking">Checking Account (****3456)</SelectItem>
										<SelectItem value="savings">Savings Account (****7890)</SelectItem>
										<SelectItem value="business">Business Account (****1234)</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{formData.cardType === 'credit' && (
								<div className="space-y-2">
									<Label htmlFor="creditLimit">Credit Limit *</Label>
									<div className="relative">
										<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
										<Input
											id="creditLimit"
											type="number"
											step="100"
											min="500"
											placeholder="0"
											className="pl-7"
											value={formData.creditLimit}
											onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
										/>
									</div>
									<p className="text-xs text-muted-foreground">Minimum credit limit: $500</p>
								</div>
							)}

							<div className="flex gap-3 pt-4">
								<Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
									Cancel
								</Button>
								<Button type="submit" className="flex-1">
									Create Card
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
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
