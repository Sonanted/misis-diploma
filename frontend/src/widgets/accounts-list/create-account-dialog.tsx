import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useCreateAccount } from '@/entities/account/queries';
import type { EAccountCurrency, EAccountType } from '@/shared/api/types';
import { Button } from '@/shared/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

type CreateAccountValues = {
	name: string;
	type: EAccountType;
	currency: EAccountCurrency;
	creditLimit: string;
};

const CURRENCY_LABELS: Record<EAccountCurrency, string> = {
	RUB: 'RUB — ₽',
	USD: 'USD — $',
	EUR: 'EUR — €',
};

export function CreateAccountDialog() {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const createAccount = useCreateAccount();

	const {
		register,
		control,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm<CreateAccountValues>({ mode: 'onBlur' });

	const TYPE_LABELS: Record<EAccountType, string> = {
		checking: t('accounts.type_checking'),
		savings: t('accounts.type_savings'),
		credit: t('accounts.type_credit'),
		currency: t('accounts.type_currency'),
	};

	const selectedType = watch('type');
	const isCredit = selectedType === 'credit';

	useEffect(() => {
		if (!open) reset();
	}, [open, reset]);

	const onSubmit = (data: CreateAccountValues) => {
		createAccount.mutate(
			{
				name: data.name,
				type: data.type,
				currency: data.currency,
				creditLimit: isCredit && data.creditLimit ? Number(data.creditLimit) : undefined,
			},
			{
				onSuccess: (account) => {
					toast.success(t('accounts.create'), { description: account.name });
					setOpen(false);
				},
				onError: () => {
					toast.error(t('accounts.create_error'));
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<Button>
						<Plus className="size-4 mr-2" />
						{t('accounts.create')}
					</Button>
				}
			/>
			<DialogContent>
				<span autoFocus tabIndex={-1} className="sr-only" />
				<DialogHeader>
					<DialogTitle>{t('accounts.dialog_title')}</DialogTitle>
					<DialogDescription>{t('accounts.dialog_description')}</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<FieldGroup>
						<Field data-invalid={!!errors.name}>
							<FieldLabel>{t('accounts.name_label')} *</FieldLabel>
							<Input
								placeholder={t('accounts.name_placeholder')}
								{...register('name', { required: t('validation.required') })}
							/>
							<FieldError errors={[errors.name]} />
						</Field>

						<Field data-invalid={!!errors.type}>
							<FieldLabel>{t('accounts.type_label')} *</FieldLabel>
							<Controller
								name="type"
								control={control}
								rules={{ required: t('validation.required') }}
								render={({ field }) => (
									<Select
										value={field.value ?? ''}
										onValueChange={field.onChange}
										onOpenChange={(o) => { if (!o) field.onBlur(); }}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder={t('accounts.type_placeholder')}>
												{field.value ? TYPE_LABELS[field.value] : undefined}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="checking">{t('accounts.type_checking')}</SelectItem>
											<SelectItem value="savings">{t('accounts.type_savings')}</SelectItem>
											<SelectItem value="credit">{t('accounts.type_credit')}</SelectItem>
											<SelectItem value="currency">{t('accounts.type_currency')}</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>
							<FieldError errors={[errors.type]} />
						</Field>

						<Field data-invalid={!!errors.currency}>
							<FieldLabel>{t('accounts.currency_label')} *</FieldLabel>
							<Controller
								name="currency"
								control={control}
								rules={{ required: t('validation.required') }}
								render={({ field }) => (
									<Select
										value={field.value ?? ''}
										onValueChange={field.onChange}
										onOpenChange={(o) => { if (!o) field.onBlur(); }}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder={t('accounts.currency_placeholder')}>
												{field.value ? CURRENCY_LABELS[field.value] : undefined}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="RUB">RUB — ₽</SelectItem>
											<SelectItem value="USD">USD — $</SelectItem>
											<SelectItem value="EUR">EUR — €</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>
							<FieldError errors={[errors.currency]} />
						</Field>

						{isCredit && (
							<Field data-invalid={!!errors.creditLimit}>
								<FieldLabel>{t('accounts.credit_limit_label')} *</FieldLabel>
								<div className="relative">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
										₽
									</span>
									<Input
										type="number"
										step="100"
										placeholder="0"
										className="pl-7"
										{...register('creditLimit', {
											required: t('validation.required'),
											min: { value: 500, message: t('validation.credit_limit_min') },
										})}
									/>
								</div>
								<p className="text-xs text-muted-foreground">{t('accounts.credit_limit_hint')}</p>
								<FieldError errors={[errors.creditLimit]} />
							</Field>
						)}
					</FieldGroup>

					<div className="flex gap-3 pt-4">
						<Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
							{t('accounts.cancel')}
						</Button>
						<Button type="submit" className="flex-1" disabled={createAccount.isPending}>
							{t('accounts.create')}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
