import { ArrowRight, CreditCard, Plus } from 'lucide-react';
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
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const { balanceVisible, toggle } = usePrivacyStore();
	const cardNameId = useId();
	const cardTypeId = useId();
	const linkedAccountId = useId();
	const creditLimitId = useId();
	const [formData, setFormData] = useState({
		cardName: '',
		cardType: '',
		linkedAccount: '',
		creditLimit: '',
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.cardName || !formData.cardType || !formData.linkedAccount) {
			toast.error(t('cards.toast_fill_required'));
			return;
		}

		if (formData.cardType === 'credit' && !formData.creditLimit) {
			toast.error(t('cards.toast_fill_credit_limit'));
			return;
		}

		toast.success(t('cards.create'), {
			description: `${formData.cardName} has been created and will arrive in 5-7 business days`,
		});

		setFormData({ cardName: '', cardType: '', linkedAccount: '', creditLimit: '' });
		setOpen(false);
	};

	return (
		<div className="p-4 sm:p-8">
			<div className="mb-6 flex items-start justify-between flex-wrap gap-y-3">
				<div>
					<div className="flex items-center gap-2 mb-2">
						<h1 className="text-2xl sm:text-3xl font-semibold">{t('cards.title')}</h1>
						<BalanceToggle visible={balanceVisible} onToggle={toggle} />
					</div>
					<p className="text-muted-foreground">{t('cards.description')}</p>
				</div>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger
						render={
							<Button>
								<Plus className="size-4 mr-2" />
								{t('cards.create')}
							</Button>
						}
					/>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{t('cards.dialog_title')}</DialogTitle>
							<DialogDescription>{t('cards.dialog_description')}</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor={cardNameId}>{t('cards.name_label')} *</Label>
								<Input
									id={cardNameId}
									placeholder={t('cards.name_placeholder')}
									value={formData.cardName}
									onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor={cardTypeId}>{t('cards.type_label')} *</Label>
								<Select
									value={formData.cardType}
									onValueChange={(value) => setFormData({ ...formData, cardType: value })}
								>
									<SelectTrigger id={cardTypeId}>
										<SelectValue placeholder={t('cards.type_placeholder')} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="debit">{t('cards.type_debit')}</SelectItem>
										<SelectItem value="credit">{t('cards.type_credit')}</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor={linkedAccountId}>{t('cards.account_label')} *</Label>
								<Select
									value={formData.linkedAccount}
									onValueChange={(value) => setFormData({ ...formData, linkedAccount: value })}
								>
									<SelectTrigger id={linkedAccountId}>
										<SelectValue placeholder={t('cards.account_placeholder')} />
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
									<Label htmlFor={creditLimitId}>{t('cards.limit_label')} *</Label>
									<div className="relative">
										<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
										<Input
											id={creditLimitId}
											type="number"
											step="100"
											min="500"
											placeholder="0"
											className="pl-7"
											value={formData.creditLimit}
											onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
										/>
									</div>
									<p className="text-xs text-muted-foreground">{t('cards.limit_hint')}</p>
								</div>
							)}

							<div className="flex gap-3 pt-4">
								<Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
									{t('cards.cancel')}
								</Button>
								<Button type="submit" className="flex-1">
									{t('cards.create')}
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
								<div className="flex items-start justify-between flex-wrap gap-y-2">
									<div className="flex items-center gap-3 min-w-0">
										<div className="p-2 bg-primary/10 rounded-lg shrink-0">
											<CreditCard className="size-5 text-primary" />
										</div>
										<div className="min-w-0">
											<CardTitle className="text-lg sm:text-xl">{card.name}</CardTitle>
											<p className="text-sm text-muted-foreground mt-1">
												{card.cardNumber} • Exp {card.expiryDate}
											</p>
										</div>
									</div>
									<div className="flex gap-2 shrink-0">
										<Badge variant="secondary">{card.type}</Badge>
										<Badge variant="outline">{card.status}</Badge>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between gap-2">
									<div className="min-w-0">
										<p className="text-xl sm:text-2xl font-bold">
											{balanceVisible
												? `$${card.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
												: '$••••••'}
										</p>
										<p className="text-sm text-muted-foreground mt-1 wrap-break-word">
											{card.type === 'Credit'
												? `${balanceVisible ? `$${(card.limit - card.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$••••••'} available of $${card.limit.toLocaleString('en-US')}`
												: t('cards.current_balance')}
										</p>
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
