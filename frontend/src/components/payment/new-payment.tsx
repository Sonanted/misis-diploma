import { CreditCard, Hash, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

type PaymentMethod = 'account' | 'phone' | 'card' | null;

export function NewPayment() {
	const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
	const [formData, setFormData] = useState({
		fromAccount: '',
		recipient: '',
		recipientIdentifier: '',
		amount: '',
		description: '',
	});

	const resetForm = () => {
		setFormData({
			fromAccount: '',
			recipient: '',
			recipientIdentifier: '',
			amount: '',
			description: '',
		});
	};

	const handleMethodSelect = (method: PaymentMethod) => {
		setSelectedMethod(method);
		resetForm();
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (
			!formData.fromAccount ||
			!formData.recipient ||
			!formData.recipientIdentifier ||
			!formData.amount
		) {
			toast.error('Please fill in all required fields');
			return;
		}

		const methodLabel =
			selectedMethod === 'account' ? 'account' : selectedMethod === 'phone' ? 'phone number' : 'card';
		toast.success('Payment sent successfully!', {
			description: `$${parseFloat(formData.amount).toFixed(2)} sent to ${formData.recipient} via ${methodLabel}`,
		});

		resetForm();
	};

	const getPlaceholder = () => {
		switch (selectedMethod) {
			case 'account':
				return 'Enter account number or IBAN';
			case 'phone':
				return 'Enter phone number (e.g., +1 234 567 8900)';
			case 'card':
				return 'Enter card number (16 digits)';
			default:
				return '';
		}
	};

	const getInputType = () => {
		return selectedMethod === 'phone' ? 'tel' : 'text';
	};

	return (
		<div className="flex flex-col h-full">
			<div className="shrink-0 p-8 pb-6 border-b">
				<div className="max-w-2xl mx-auto">
					<div className="mb-6">
						<h1 className="text-3xl font-semibold mb-2">New Payment</h1>
						<p className="text-muted-foreground">Choose a payment method and send money</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Button
							variant={selectedMethod === 'account' ? 'default' : 'outline'}
							className="h-24 flex-col gap-2"
							onClick={() => handleMethodSelect('account')}
						>
							<Hash className="size-6" />
							<div className="text-center">
								<div className="font-semibold">Account Number</div>
								<div className="text-xs opacity-80">IBAN or Account</div>
							</div>
						</Button>

						<Button
							variant={selectedMethod === 'phone' ? 'default' : 'outline'}
							className="h-24 flex-col gap-2"
							onClick={() => handleMethodSelect('phone')}
						>
							<Phone className="size-6" />
							<div className="text-center">
								<div className="font-semibold">Phone Number</div>
								<div className="text-xs opacity-80">Instant Transfer</div>
							</div>
						</Button>

						<Button
							variant={selectedMethod === 'card' ? 'default' : 'outline'}
							className="h-24 flex-col gap-2"
							onClick={() => handleMethodSelect('card')}
						>
							<CreditCard className="size-6" />
							<div className="text-center">
								<div className="font-semibold">Card Number</div>
								<div className="text-xs opacity-80">Debit or Credit</div>
							</div>
						</Button>
					</div>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto p-8 pt-6">
				<div className="max-w-2xl mx-auto">
					{selectedMethod && (
						<Card>
							<CardHeader>
								<CardTitle>
									{selectedMethod === 'account' && 'Pay by Account Number'}
									{selectedMethod === 'phone' && 'Pay by Phone Number'}
									{selectedMethod === 'card' && 'Pay by Card Number'}
								</CardTitle>
								<CardDescription>Enter the payment information below</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="space-y-2">
										<Label htmlFor="fromAccount">From Account *</Label>
										<Select
											value={formData.fromAccount}
											onValueChange={(value) => setFormData({ ...formData, fromAccount: value || '' })}
										>
											<SelectTrigger id="fromAccount" className="w-full">
												<SelectValue placeholder="Select account" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="checking">Checking Account (****3456) - $15,420.50</SelectItem>
												<SelectItem value="savings">Savings Account (****7890) - $48,750.25</SelectItem>
												<SelectItem value="business">Business Account (****1234) - $92,340.00</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label htmlFor="recipient">Recipient Name *</Label>
										<Input
											id="recipient"
											placeholder="Enter recipient name"
											value={formData.recipient}
											onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="recipientIdentifier">
											{selectedMethod === 'account' && 'Recipient Account *'}
											{selectedMethod === 'phone' && 'Recipient Phone Number *'}
											{selectedMethod === 'card' && 'Recipient Card Number *'}
										</Label>
										<Input
											id="recipientIdentifier"
											type={getInputType()}
											placeholder={getPlaceholder()}
											value={formData.recipientIdentifier}
											onChange={(e) => setFormData({ ...formData, recipientIdentifier: e.target.value })}
										/>
										{selectedMethod === 'phone' && (
											<p className="text-xs text-muted-foreground">
												The recipient will receive the payment to their default account
											</p>
										)}
										{selectedMethod === 'card' && (
											<p className="text-xs text-muted-foreground">
												Payment will be sent to the account linked to this card
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="amount">Amount *</Label>
										<div className="relative">
											<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
											<Input
												id="amount"
												type="number"
												step="0.01"
												min="0.01"
												placeholder="0.00"
												className="pl-7"
												value={formData.amount}
												onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="description">Description (Optional)</Label>
										<Textarea
											id="description"
											placeholder="Add a note about this payment"
											rows={3}
											value={formData.description}
											onChange={(e) => setFormData({ ...formData, description: e.target.value })}
										/>
									</div>

									<div className="pt-4">
										<Button type="submit" className="w-full" size="lg">
											<Send className="size-4 mr-2" />
											Send Payment
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>
					)}

					{selectedMethod && (
						<Card className="mt-6 bg-muted/50">
							<CardContent className="p-4">
								<p className="text-sm text-muted-foreground">
									<strong>Note:</strong> Payments are processed immediately. Please verify all details before
									sending.
									{selectedMethod === 'phone' &&
										" Phone number payments use the recipient's registered default account."}
									{selectedMethod === 'card' && ' Card payments are sent to the linked bank account.'}
								</p>
							</CardContent>
						</Card>
					)}

					{!selectedMethod && (
						<Card className="bg-muted/50">
							<CardContent className="p-8 text-center">
								<p className="text-muted-foreground">Select a payment method above to get started</p>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
