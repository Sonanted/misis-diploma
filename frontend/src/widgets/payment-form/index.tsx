import { CreditCard, Hash, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';

type PaymentMethod = 'account' | 'phone' | 'card' | null;

type PaymentFormValues = {
	fromAccount: string;
	recipient: string;
	recipientIdentifier: string;
	amount: number;
	description: string;
};

export function NewPayment() {
	const { t } = useTranslation();
	const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<PaymentFormValues>({ mode: 'onBlur' });

	const handleMethodSelect = (method: PaymentMethod) => {
		setSelectedMethod(method);
		reset();
	};

	const onSubmit = (data: PaymentFormValues) => {
		// biome-ignore lint/suspicious/noConsole: temporary
		console.log('new payment', data);
		const methodLabel =
			selectedMethod === 'account' ? 'account' : selectedMethod === 'phone' ? 'phone number' : 'card';
		toast.success(t('payments.toast_success'), {
			description: `$${Number(data.amount).toFixed(2)} sent to ${data.recipient} via ${methodLabel}`,
		});
		reset();
	};

	const getPlaceholder = () => {
		switch (selectedMethod) {
			case 'account': return t('payments.account_placeholder');
			case 'phone': return t('payments.phone_placeholder');
			case 'card': return t('payments.card_placeholder');
			default: return '';
		}
	};

	const getRecipientLabel = () => {
		switch (selectedMethod) {
			case 'account': return t('payments.recipient_account');
			case 'phone': return t('payments.recipient_phone');
			case 'card': return t('payments.recipient_card');
			default: return '';
		}
	};

	const getPayByTitle = () => {
		switch (selectedMethod) {
			case 'account': return t('payments.pay_by_account');
			case 'phone': return t('payments.pay_by_phone');
			case 'card': return t('payments.pay_by_card');
			default: return '';
		}
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
						{(
							[
								{ method: 'account', icon: Hash, label: 'payments.method_account', sub: 'payments.method_account_sub' },
								{ method: 'phone', icon: Phone, label: 'payments.method_phone', sub: 'payments.method_phone_sub' },
								{ method: 'card', icon: CreditCard, label: 'payments.method_card', sub: 'payments.method_card_sub' },
							] as const
						).map(({ method, icon: Icon, label, sub }) => (
							<Button
								key={method}
								variant={selectedMethod === method ? 'default' : 'outline'}
								className="h-24 flex-col gap-2"
								onClick={() => handleMethodSelect(method)}
							>
								<Icon className="size-6" />
								<div className="text-center">
									<div className="font-semibold">{t(label)}</div>
									<div className="text-xs opacity-80">{t(sub)}</div>
								</div>
							</Button>
						))}
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
								<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
									<FieldGroup>
										<Field data-invalid={!!errors.fromAccount}>
											<FieldLabel>{t('payments.from_account')} *</FieldLabel>
											<Controller
												name="fromAccount"
												control={control}
												rules={{ required: t('validation.required') }}
												render={({ field }) => (
													<Select value={field.value ?? ''} onValueChange={field.onChange} onOpenChange={(open) => { if (!open) field.onBlur(); }}>
														<SelectTrigger className="w-full">
															<SelectValue placeholder={t('payments.from_account_placeholder')} />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="checking">Checking Account (****3456) - $15,420.50</SelectItem>
															<SelectItem value="savings">Savings Account (****7890) - $48,750.25</SelectItem>
															<SelectItem value="business">Business Account (****1234) - $92,340.00</SelectItem>
														</SelectContent>
													</Select>
												)}
											/>
											<FieldError errors={[errors.fromAccount]} />
										</Field>

										<Field data-invalid={!!errors.recipient}>
											<FieldLabel>{t('payments.recipient')} *</FieldLabel>
											<Input
												placeholder={t('payments.recipient_placeholder')}
												{...register('recipient', { required: t('validation.required') })}
											/>
											<FieldError errors={[errors.recipient]} />
										</Field>

										<Field data-invalid={!!errors.recipientIdentifier}>
											<FieldLabel>{getRecipientLabel()} *</FieldLabel>
											<Input
												type={selectedMethod === 'phone' ? 'tel' : 'text'}
												placeholder={getPlaceholder()}
												{...register('recipientIdentifier', { required: t('validation.required') })}
											/>
											{selectedMethod === 'phone' && (
												<p className="text-xs text-muted-foreground">{t('payments.phone_hint')}</p>
											)}
											{selectedMethod === 'card' && (
												<p className="text-xs text-muted-foreground">{t('payments.card_hint')}</p>
											)}
											<FieldError errors={[errors.recipientIdentifier]} />
										</Field>

										<Field data-invalid={!!errors.amount}>
											<FieldLabel>{t('payments.amount')} *</FieldLabel>
											<div className="relative">
												<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
												<Input
													type="number"
													step="0.01"
													placeholder="0.00"
													className="pl-7"
													{...register('amount', {
														required: t('validation.required'),
														min: { value: 0.01, message: t('validation.amount_min') },
													})}
												/>
											</div>
											<FieldError errors={[errors.amount]} />
										</Field>

										<Field>
											<FieldLabel>{t('payments.description_optional')}</FieldLabel>
											<Textarea
												placeholder={t('payments.description_placeholder')}
												rows={3}
												{...register('description')}
											/>
										</Field>
									</FieldGroup>

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
