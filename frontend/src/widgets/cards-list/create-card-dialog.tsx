import { Plus } from 'lucide-react';
import { cloneElement, isValidElement, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAccounts } from '@/entities/account/queries';
import { useCreateCard } from '@/entities/card/queries';
import { Badge } from '@/shared/ui/badge';
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

type CreateCardValues = {
	name: string;
	accountId: string;
};

interface CreateCardDialogProps {
	defaultAccountId?: string;
	trigger?: React.ReactNode;
}

export function CreateCardDialog({ defaultAccountId, trigger }: CreateCardDialogProps = {}) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const { data: accounts } = useAccounts();
	const createCard = useCreateCard();

	const eligibleAccounts =
		accounts?.filter((a) => (a.type === 'checking' || a.type === 'credit') && a.status !== 'closed') ?? [];

	const {
		register,
		control,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm<CreateCardValues>({
		mode: 'onBlur',
		defaultValues: defaultAccountId ? { accountId: defaultAccountId } : undefined,
	});

	const accountId = watch('accountId');
	const selectedAccount = eligibleAccounts.find((a) => a.id === accountId);
	const isCredit = selectedAccount?.type === 'credit';

	useEffect(() => {
		if (!open) reset(defaultAccountId ? { accountId: defaultAccountId } : undefined);
	}, [open, reset, defaultAccountId]);

	const onSubmit = (data: CreateCardValues) => {
		createCard.mutate(
			{ name: data.name, accountId: data.accountId },
			{
				onSuccess: (card) => {
					toast.success(t('cards.create'), { description: card.name });
					setOpen(false);
				},
				onError: () => {
					toast.error(t('cards.create_error'));
				},
			},
		);
	};

	const dialogTrigger = trigger ? (
		isValidElement(trigger)
			? cloneElement(trigger as React.ReactElement<{ onClick: () => void }>, {
					onClick: () => setOpen(true),
				})
			: trigger
	) : (
		<DialogTrigger
			render={
				<Button>
					<Plus className="size-4 mr-2" />
					{t('cards.create')}
				</Button>
			}
		/>
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{dialogTrigger}
			<DialogContent>
				<span autoFocus tabIndex={-1} className="sr-only" />
				<DialogHeader>
					<DialogTitle>{t('cards.dialog_title')}</DialogTitle>
					<DialogDescription>{t('cards.dialog_description')}</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<FieldGroup>
						<Field data-invalid={!!errors.name}>
							<FieldLabel>{t('cards.name_label')} *</FieldLabel>
							<Input
								placeholder={t('cards.name_placeholder')}
								{...register('name', { required: t('validation.required') })}
							/>
							<FieldError errors={[errors.name]} />
						</Field>

						<Field data-invalid={!!errors.accountId}>
							<FieldLabel>{t('cards.account_label')} *</FieldLabel>
							<Controller
								name="accountId"
								control={control}
								rules={{ required: t('validation.required') }}
								render={({ field }) => (
									<Select
										value={field.value ?? ''}
										onValueChange={field.onChange}
										onOpenChange={(o) => {
											if (!o) field.onBlur();
										}}
										disabled={!!defaultAccountId}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder={t('cards.account_placeholder')} />
										</SelectTrigger>
										<SelectContent>
											{eligibleAccounts.map((acc) => (
												<SelectItem key={acc.id} value={acc.id}>
													{acc.name} (****{acc.accountNumber.slice(-4)})
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
							<FieldError errors={[errors.accountId]} />
						</Field>

						{selectedAccount && (
							<Field>
								<FieldLabel>{t('cards.type_label')}</FieldLabel>
								<div className="flex items-center h-9 px-3">
									<Badge variant="secondary">
										{isCredit ? t('cards.type_credit') : t('cards.type_debit')}
									</Badge>
								</div>
							</Field>
						)}
					</FieldGroup>

					<div className="flex gap-3 pt-4">
						<Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
							{t('cards.cancel')}
						</Button>
						<Button
							type="submit"
							className="flex-1"
							disabled={createCard.isPending || !selectedAccount}
						>
							{t('cards.create')}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
