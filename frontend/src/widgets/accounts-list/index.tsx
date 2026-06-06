import { ArrowRight, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { BalanceToggle } from '@/features/balance-visibility/balance-toggle';
import { usePrivacyStore } from '@/features/balance-visibility/model';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
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

const accounts = [
	{ id: '1', name: 'Checking Account', accountNumber: '****3456', balance: 15420.5, currency: 'USD', type: 'Checking' },
	{ id: '2', name: 'Savings Account', accountNumber: '****7890', balance: 48750.25, currency: 'USD', type: 'Savings' },
	{ id: '3', name: 'Business Account', accountNumber: '****1234', balance: 92340.0, currency: 'USD', type: 'Business' },
	{ id: '4', name: 'Emergency Fund', accountNumber: '****5678', balance: 25000.0, currency: 'USD', type: 'Savings' },
	{ id: '5', name: 'Investment Account', accountNumber: '****9012', balance: 156780.75, currency: 'USD', type: 'Savings' },
	{ id: '6', name: 'Joint Checking', accountNumber: '****3344', balance: 8920.4, currency: 'USD', type: 'Checking' },
	{ id: '7', name: 'Vacation Savings', accountNumber: '****5566', balance: 12450.0, currency: 'USD', type: 'Savings' },
	{ id: '8', name: 'Freelance Business', accountNumber: '****7788', balance: 34560.9, currency: 'USD', type: 'Business' },
	{ id: '9', name: 'Tax Savings', accountNumber: '****9900', balance: 18300.0, currency: 'USD', type: 'Savings' },
	{ id: '10', name: 'Home Down Payment', accountNumber: '****1122', balance: 67890.5, currency: 'USD', type: 'Savings' },
];

type CreateAccountValues = {
	accountName: string;
	accountType: string;
	initialDeposit: number;
};

export function AccountsList() {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const { balanceVisible, toggle } = usePrivacyStore();

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateAccountValues>({ mode: 'onBlur' });

	useEffect(() => {
		if (!open) reset();
	}, [open, reset]);

	const onSubmit = (data: CreateAccountValues) => {
		// biome-ignore lint/suspicious/noConsole: temporary
		console.log('create account', data);
		toast.success(t('accounts.create'), {
			description: `${data.accountName} has been created with $${Number(data.initialDeposit).toFixed(2)}`,
		});
		setOpen(false);
	};

	return (
		<div className="p-4 sm:p-8">
			<div className="mb-6 flex items-start justify-between flex-wrap gap-y-3">
				<div>
					<div className="flex items-center gap-2 mb-2">
						<h1 className="text-2xl sm:text-3xl font-semibold">{t('accounts.title')}</h1>
						<BalanceToggle visible={balanceVisible} onToggle={toggle} />
					</div>
					<p className="text-muted-foreground">{t('accounts.description')}</p>
				</div>
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
						<DialogHeader>
							<DialogTitle>{t('accounts.dialog_title')}</DialogTitle>
							<DialogDescription>{t('accounts.dialog_description')}</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<FieldGroup>
								<Field data-invalid={!!errors.accountName}>
									<FieldLabel>{t('accounts.name_label')} *</FieldLabel>
									<Input
										placeholder={t('accounts.name_placeholder')}
										{...register('accountName', { required: t('validation.required') })}
									/>
									<FieldError errors={[errors.accountName]} />
								</Field>

								<Field data-invalid={!!errors.accountType}>
									<FieldLabel>{t('accounts.type_label')} *</FieldLabel>
									<Controller
										name="accountType"
										control={control}
										rules={{ required: t('validation.required') }}
										render={({ field }) => (
											<Select value={field.value ?? ''} onValueChange={field.onChange} onOpenChange={(open) => { if (!open) field.onBlur(); }}>
												<SelectTrigger>
													<SelectValue placeholder={t('accounts.type_placeholder')} />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="checking">{t('accounts.type_checking')}</SelectItem>
													<SelectItem value="savings">{t('accounts.type_savings')}</SelectItem>
													<SelectItem value="business">{t('accounts.type_business')}</SelectItem>
												</SelectContent>
											</Select>
										)}
									/>
									<FieldError errors={[errors.accountType]} />
								</Field>

								<Field data-invalid={!!errors.initialDeposit}>
									<FieldLabel>{t('accounts.deposit_label')} *</FieldLabel>
									<div className="relative">
										<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
										<Input
											type="number"
											step="0.01"
											min="0"
											placeholder="0.00"
											className="pl-7"
											{...register('initialDeposit', {
												required: t('validation.required'),
												min: { value: 0, message: t('validation.deposit_min') },
											})}
										/>
									</div>
									<FieldError errors={[errors.initialDeposit]} />
								</Field>
							</FieldGroup>

							<div className="flex gap-3 pt-4">
								<Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
									{t('accounts.cancel')}
								</Button>
								<Button type="submit" className="flex-1">
									{t('accounts.create')}
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>
			<div className="grid gap-4">
				{accounts.map((account) => (
					<Link key={account.id} to={`/accounts/${account.id}`}>
						<Card className="hover:bg-accent transition-colors cursor-pointer">
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between flex-wrap gap-y-2">
									<div className="min-w-0">
										<CardTitle className="text-lg sm:text-xl">{account.name}</CardTitle>
										<p className="text-sm text-muted-foreground mt-1">{account.accountNumber}</p>
									</div>
									<Badge variant="secondary" className="shrink-0">{account.type}</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between gap-2">
									<div className="min-w-0">
										<p className="text-2xl sm:text-3xl font-bold">
											{balanceVisible
												? `$${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
												: '$••••••'}
										</p>
										<p className="text-sm text-muted-foreground mt-1">{t('accounts.available_balance')}</p>
									</div>
									<ArrowRight className="size-5 text-muted-foreground shrink-0" />
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
