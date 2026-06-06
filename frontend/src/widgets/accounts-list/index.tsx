import { ArrowRight, Plus } from 'lucide-react';
import { useId, useState } from 'react';
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
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

const accounts = [
	{
		id: '1',
		name: 'Checking Account',
		accountNumber: '****3456',
		balance: 15420.5,
		currency: 'USD',
		type: 'Checking',
	},
	{
		id: '2',
		name: 'Savings Account',
		accountNumber: '****7890',
		balance: 48750.25,
		currency: 'USD',
		type: 'Savings',
	},
	{
		id: '3',
		name: 'Business Account',
		accountNumber: '****1234',
		balance: 92340.0,
		currency: 'USD',
		type: 'Business',
	},
	{
		id: '4',
		name: 'Emergency Fund',
		accountNumber: '****5678',
		balance: 25000.0,
		currency: 'USD',
		type: 'Savings',
	},
	{
		id: '5',
		name: 'Investment Account',
		accountNumber: '****9012',
		balance: 156780.75,
		currency: 'USD',
		type: 'Savings',
	},
	{
		id: '6',
		name: 'Joint Checking',
		accountNumber: '****3344',
		balance: 8920.4,
		currency: 'USD',
		type: 'Checking',
	},
	{
		id: '7',
		name: 'Vacation Savings',
		accountNumber: '****5566',
		balance: 12450.0,
		currency: 'USD',
		type: 'Savings',
	},
	{
		id: '8',
		name: 'Freelance Business',
		accountNumber: '****7788',
		balance: 34560.9,
		currency: 'USD',
		type: 'Business',
	},
	{
		id: '9',
		name: 'Tax Savings',
		accountNumber: '****9900',
		balance: 18300.0,
		currency: 'USD',
		type: 'Savings',
	},
	{
		id: '10',
		name: 'Home Down Payment',
		accountNumber: '****1122',
		balance: 67890.5,
		currency: 'USD',
		type: 'Savings',
	},
];

export function AccountsList() {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const { balanceVisible, toggle } = usePrivacyStore();
	const accountNameId = useId();
	const accountTypeId = useId();
	const initialDepositId = useId();
	const [formData, setFormData] = useState({
		accountName: '',
		accountType: '',
		initialDeposit: '',
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.accountName || !formData.accountType || !formData.initialDeposit) {
			toast.error(t('accounts.toast_fill_required'));
			return;
		}

		toast.success(t('accounts.create'), {
			description: `${formData.accountName} has been created with $${parseFloat(formData.initialDeposit).toFixed(2)}`,
		});

		setFormData({
			accountName: '',
			accountType: '',
			initialDeposit: '',
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
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor={accountNameId}>{t('accounts.name_label')} *</Label>
								<Input
									id={accountNameId}
									placeholder={t('accounts.name_placeholder')}
									value={formData.accountName}
									onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor={accountTypeId}>{t('accounts.type_label')} *</Label>
								<Select
									value={formData.accountType}
									onValueChange={(value) => setFormData({ ...formData, accountType: value })}
								>
									<SelectTrigger id={accountTypeId}>
										<SelectValue placeholder={t('accounts.type_placeholder')} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="checking">{t('accounts.type_checking')}</SelectItem>
										<SelectItem value="savings">{t('accounts.type_savings')}</SelectItem>
										<SelectItem value="business">{t('accounts.type_business')}</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor={initialDepositId}>{t('accounts.deposit_label')} *</Label>
								<div className="relative">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
									<Input
										id={initialDepositId}
										type="number"
										step="0.01"
										min="0"
										placeholder="0.00"
										className="pl-7"
										value={formData.initialDeposit}
										onChange={(e) => setFormData({ ...formData, initialDeposit: e.target.value })}
									/>
								</div>
							</div>

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
