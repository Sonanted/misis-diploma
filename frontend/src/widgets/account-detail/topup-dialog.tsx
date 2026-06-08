import axios from 'axios';
import { cloneElement, isValidElement, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useTopupAccount } from '@/entities/account/queries';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';

interface TopupDialogProps {
	accountId: string;
	balance: number;
	trigger: React.ReactNode;
}

type TopupFormValues = {
	amount: number;
	password: string;
};

const normalizeAmount = (v: string): number => {
	const normalized = String(v ?? '').trim().replace(',', '.');
	const num = parseFloat(normalized);
	return Number.isNaN(num) ? 0 : num;
};

export function TopupDialog({ accountId, balance, trigger }: TopupDialogProps) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const topup = useTopupAccount();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TopupFormValues>({ mode: 'onBlur' });

	const handleOpenChange = (next: boolean) => {
		setOpen(next);
		if (!next) reset();
	};

	const onSubmit = (data: TopupFormValues) => {
		topup.mutate(
			{ id: accountId, dto: { amount: data.amount, password: data.password } },
			{
				onSuccess: () => {
					toast.success(t('account_detail.topup_success'));
					handleOpenChange(false);
				},
				onError: (error) => {
					if (axios.isAxiosError(error) && error.response?.status === 403) {
						toast.error(t('account_detail.topup_error_password'));
					} else if (axios.isAxiosError(error) && error.response?.status === 400) {
						toast.error(t('account_detail.topup_error_balance'));
					} else {
						toast.error(t('account_detail.topup_error'));
					}
				},
			},
		);
	};

	return (
		<>
			{isValidElement(trigger)
				? cloneElement(trigger as React.ReactElement<{ onClick: () => void }>, { onClick: () => setOpen(true) })
				: trigger}
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogContent>
					<span autoFocus tabIndex={-1} className="sr-only" />
					<DialogHeader>
						<DialogTitle>{t('account_detail.topup_dialog_title')}</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<FieldGroup>
							<Field data-invalid={!!errors.amount}>
								<FieldLabel>{t('account_detail.topup_amount_label')}</FieldLabel>
								<Input
									type="text"
									inputMode="decimal"
									placeholder={t('account_detail.topup_amount_placeholder')}
									{...register('amount', {
										required: t('validation.required'),
										setValueAs: normalizeAmount,
										validate: (v) => {
											if (v === 0) return t('validation.amount_min');
											const decimals = String(Math.abs(v)).split('.')[1];
											if (decimals && decimals.length > 2) return t('validation.amount_decimal');
											if (balance + v < 0) return t('account_detail.topup_error_balance');
											return true;
										},
									})}
								/>
								<FieldError errors={[errors.amount]} />
							</Field>

							<Field data-invalid={!!errors.password}>
								<FieldLabel>{t('account_detail.topup_password_label')}</FieldLabel>
								<Input
									type="password"
									placeholder={t('account_detail.topup_password_placeholder')}
									{...register('password', { required: t('validation.required') })}
								/>
								<FieldError errors={[errors.password]} />
							</Field>
						</FieldGroup>

						<div className="flex gap-3 pt-2">
							<Button type="button" variant="outline" className="flex-1" onClick={() => handleOpenChange(false)}>
								{t('common.cancel')}
							</Button>
							<Button type="submit" className="flex-1" disabled={topup.isPending}>
								{t('account_detail.topup_submit')}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
