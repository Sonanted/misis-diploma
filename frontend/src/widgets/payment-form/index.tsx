import { CreditCard, Hash, Phone, Send } from 'lucide-react';
import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';

type PaymentMethod = 'account' | 'phone' | 'card' | null;

export function NewPayment() {
	const { t } = useTranslation();
	const fromAccountId = useId();
	const recipientId = useId();
	const recipientIdentifierId = useId();
	const amountId = useId();
	const descriptionId = useId();

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
			toast.error(t('payments.toast_fill_required'));
			return;
		}

		const methodLabel =
			selectedMethod === 'account' ? 'account' : selectedMethod === 'phone' ? 'phone number' : 'card';
		toast.success(t('payments.toast_success'), {
			description: `$${parseFloat(formData.amount).toFixed(2)} sent to ${formData.recipient} via ${methodLabel}`,
		});

		resetForm();
	};

	const getPlaceholder = () => {
		switch (selectedMethod) {
			case 'account':
				return t('payments.account_placeholder');
			case 'phone':
				return t('payments.phone_placeholder');
			case 'card':
				return t('payments.card_placeholder');
			default:
				return '';
		}
	};

	const getRecipientLabel = () => {
		switch (selectedMethod) {
			case 'account':
				return t('payments.recipient_account');
			case 'phone':
				return t('payments.recipient_phone');
			case 'card':
				return t('payments.recipient_card');
			default:
				return '';
		}
	};

	const getPayByTitle = () => {
		switch (selectedMethod) {
			case 'account':
				return t('payments.pay_by_account');
			case 'phone':
				return t('payments.pay_by_phone');
			case 'card':
				return t('payments.pay_by_card');
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
						<h1 className="text-3xl font-semibold mb-2">{t('payments.title')}</h1>
						<p className="text-muted-foreground">{t('payments.description')}</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Button
							variant={selectedMethod === 'account' ? 'default' : 'outline'}
							className="h-24 flex-col gap-2"
							onClick={() => handleMethodSelect('account')}
						>
							<Hash className="size-6" />
							<div className="text-center">
								<div className="font-semibold">{t('payments.method_account')}</div>
								<div className="text-xs opacity-80">{t('payments.method_account_sub')}</div>
							</div>
						</Button>

						<Button
							variant={selectedMethod === 'phone' ? 'default' : 'outline'}
							className="h-24 flex-col gap-2"
							onClick={() => handleMethodSelect('phone')}
						>
							<Phone className="size-6" />
							<div className="text-center">
								<div className="font-semibold">{t('payments.method_phone')}</div>
								<div className="text-xs opacity-80">{t('payments.method_phone_sub')}</div>
							</div>
						</Button>

						<Button
							variant={selectedMethod === 'card' ? 'default' : 'outline'}
							className="h-24 flex-col gap-2"
							onClick={() => handleMethodSelect('card')}
						>
							<CreditCard className="size-6" />
							<div className="text-center">
								<div className="font-semibold">{t('payments.method_card')}</div>
								<div className="text-xs opacity-80">{t('payments.method_card_sub')}</div>
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
								<CardTitle>{getPayByTitle()}</CardTitle>
								<CardDescription>{t('payments.form_description')}</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="space-y-2">
										<Label htmlFor={fromAccountId}>{t('payments.from_account')} *</Label>
										<Select
											value={formData.fromAccount}
											onValueChange={(value) => setFormData({ ...formData, fromAccount: value || '' })}
										>
											<SelectTrigger id={fromAccountId} className="w-full">
												<SelectValue placeholder={t('payments.from_account_placeholder')} />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="checking">Checking Account (****3456) - $15,420.50</SelectItem>
												<SelectItem value="savings">Savings Account (****7890) - $48,750.25</SelectItem>
												<SelectItem value="business">Business Account (****1234) - $92,340.00</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label htmlFor={recipientId}>{t('payments.recipient')} *</Label>
										<Input
											id={recipientId}
											placeholder={t('payments.recipient_placeholder')}
											value={formData.recipient}
											onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor={recipientIdentifierId}>{getRecipientLabel()} *</Label>
										<Input
											id={recipientIdentifierId}
											type={getInputType()}
											placeholder={getPlaceholder()}
											value={formData.recipientIdentifier}
											onChange={(e) => setFormData({ ...formData, recipientIdentifier: e.target.value })}
										/>
										{selectedMethod === 'phone' && (
											<p className="text-xs text-muted-foreground">{t('payments.phone_hint')}</p>
										)}
										{selectedMethod === 'card' && (
											<p className="text-xs text-muted-foreground">{t('payments.card_hint')}</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor={amountId}>{t('payments.amount')} *</Label>
										<div className="relative">
											<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
											<Input
												id={amountId}
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
										<Label htmlFor={descriptionId}>{t('payments.description_optional')}</Label>
										<Textarea
											id={descriptionId}
											placeholder={t('payments.description_placeholder')}
											rows={3}
											value={formData.description}
											onChange={(e) => setFormData({ ...formData, description: e.target.value })}
										/>
									</div>

									<div className="pt-4">
										<Button type="submit" className="w-full" size="lg">
											<Send className="size-4 mr-2" />
											{t('payments.send')}
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
									<strong>Note:</strong> {t('payments.note_base')}
									{selectedMethod === 'phone' && t('payments.note_phone')}
									{selectedMethod === 'card' && t('payments.note_card')}
								</p>
							</CardContent>
						</Card>
					)}

					{!selectedMethod && (
						<Card className="bg-muted/50">
							<CardContent className="p-8 text-center">
								<p className="text-muted-foreground">{t('payments.select_method')}</p>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
