import axios from 'axios';
import { CreditCard, Hash, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAccounts } from '@/entities/account/queries';
import { useTransfer } from '@/entities/transfer/queries';
import { getCurrencyRates } from '@/shared/api/currency-rates';
import { resolveDestinationCurrency } from '@/shared/api/transfers';
import type { EAccountCurrency } from '@/shared/api/types';
import { formatBalance, maskAccountNumber } from '@/shared/helpers';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';
import type { ConversionInfo, PendingPayment } from './payment-confirm-dialog';
import { PaymentConfirmDialog } from './payment-confirm-dialog';
import { normalizeAmount } from './utils';

type PaymentMethod = 'account' | 'phone' | 'card' | null;

type PaymentFormValues = {
	fromAccountId: string;
	recipientIdentifier: string;
	amount: string;
	description: string;
};

export function NewPayment() {
	const { t } = useTranslation();
	const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
	const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null);

	const { data: accounts = [] } = useAccounts();
	const activeAccounts = accounts.filter((a) => a.status === 'active' && a.type !== 'credit');
	const transfer = useTransfer();
	const [conversionInfo, setConversionInfo] = useState<ConversionInfo | null>(null);
	const [isResolving, setIsResolving] = useState(false);

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

	const onSubmit = async (data: PaymentFormValues) => {
		if (!selectedMethod) return;
		const amount = normalizeAmount(data.amount);
		const payment: PendingPayment = {
			method: selectedMethod,
			fromAccountId: data.fromAccountId,
			recipientIdentifier: data.recipientIdentifier,
			amount,
			description: data.description,
		};

		setIsResolving(true);
		try {
			const fromAccount = activeAccounts.find((a) => a.id === data.fromAccountId);
			const { toCurrency } = await resolveDestinationCurrency({
				method: selectedMethod,
				recipientIdentifier: data.recipientIdentifier,
			});

			if (fromAccount && toCurrency !== fromAccount.currency) {
				const ratesData = await getCurrencyRates();
				const fromRate = ratesData.rates[fromAccount.currency];
				const toRate = ratesData.rates[toCurrency as EAccountCurrency];
				const toAmount = parseFloat(((amount * fromRate) / toRate).toFixed(2));
				setConversionInfo({
					fromCurrency: fromAccount.currency,
					toCurrency: toCurrency as EAccountCurrency,
					fromAmount: amount,
					toAmount,
					updatedAt: ratesData.updatedAt,
				});
			} else {
				setConversionInfo(null);
			}
		} catch {
			setConversionInfo(null);
		} finally {
			setIsResolving(false);
		}

		setPendingPayment(payment);
	};

	const handleConfirm = () => {
		if (!pendingPayment) return;

		transfer.mutate(
			{
				fromAccountId: pendingPayment.fromAccountId,
				method: pendingPayment.method,
				recipientIdentifier: pendingPayment.recipientIdentifier,
				amount: pendingPayment.amount,
				description: pendingPayment.description,
			},
			{
				onSuccess: () => {
					toast.success(t('payments.toast_success'));
					setPendingPayment(null);
					setConversionInfo(null);
					reset();
					setSelectedMethod(null);
				},
				onError: (error) => {
					setPendingPayment(null);
					setConversionInfo(null);
					if (axios.isAxiosError(error)) {
						const message: string = error.response?.data?.message ?? t('payments.toast_error');
						toast.error(message);
					} else {
						toast.error(t('payments.toast_error'));
					}
				},
			},
		);
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
								{
									method: 'account',
									icon: Hash,
									label: 'payments.method_account',
									sub: 'payments.method_account_sub',
								},
								{
									method: 'phone',
									icon: Phone,
									label: 'payments.method_phone',
									sub: 'payments.method_phone_sub',
								},
								{
									method: 'card',
									icon: CreditCard,
									label: 'payments.method_card',
									sub: 'payments.method_card_sub',
								},
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
										<Field data-invalid={!!errors.fromAccountId}>
											<FieldLabel>{t('payments.from_account')} *</FieldLabel>
											<Controller
												name="fromAccountId"
												control={control}
												rules={{ required: t('validation.required') }}
												render={({ field }) => (
													<Select
														value={field.value ?? ''}
														onValueChange={field.onChange}
														onOpenChange={(open) => {
															if (!open) field.onBlur();
														}}
													>
														<SelectTrigger className="w-full">
															<SelectValue placeholder={t('payments.from_account_placeholder')}>
																{(value: string) => {
																	const acc = activeAccounts.find((a) => a.id === value);
																	return acc ? `${acc.name} (${maskAccountNumber(acc.accountNumber)})` : null;
																}}
															</SelectValue>
														</SelectTrigger>
														<SelectContent>
															{activeAccounts.map((account) => (
																<SelectItem
																	key={account.id}
																	value={account.id}
																	label={`${account.name} (${maskAccountNumber(account.accountNumber)})`}
																>
																	{account.name} ({maskAccountNumber(account.accountNumber)}) —{' '}
																	{formatBalance(account.balance, account.currency)}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												)}
											/>
											<FieldError errors={[errors.fromAccountId]} />
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
											<Input
												type="text"
												inputMode="decimal"
												placeholder="0.00"
												{...register('amount', {
													required: t('validation.required'),
													validate: (v) => {
														const num = normalizeAmount(v);
														if (num <= 0) return t('validation.amount_min');
														return true;
													},
												})}
											/>
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
										<Button type="submit" className="w-full" size="lg" disabled={isResolving}>
											<Send className="size-4 mr-2" />
											{isResolving ? t('payments.resolving') : t('payments.send')}
										</Button>
									</div>
								</form>
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

			{pendingPayment && (
				<PaymentConfirmDialog
					open={true}
					data={pendingPayment}
					accounts={activeAccounts}
					conversionInfo={conversionInfo}
					isPending={transfer.isPending}
					onClose={() => { setPendingPayment(null); setConversionInfo(null); }}
					onConfirm={handleConfirm}
				/>
			)}
		</div>
	);
}
