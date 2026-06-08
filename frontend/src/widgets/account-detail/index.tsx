import axios from 'axios';
import { ArrowRight, CalendarClock, CreditCard, FileText, PlusCircle, Send, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { useAccount, useBankInfo, useMonthlyPayment, useSetPrimaryAccount, useUpdateAccountStatus } from '@/entities/account/queries';
import { useCards } from '@/entities/card/queries';
import { useMe } from '@/entities/user/queries';
import { BalanceToggle } from '@/features/balance-visibility/balance-toggle';
import { usePrivacyStore } from '@/features/balance-visibility/model';
import { NotFound } from '@/pages/not-found';
import type { EAccountType } from '@/shared/api/types';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Separator } from '@/shared/ui/separator';
import { Skeleton } from '@/shared/ui/skeleton';
import { CreateCardDialog } from '@/widgets/cards-list/create-card-dialog';
import { TopupDialog } from './topup-dialog';

const CURRENCY_SYMBOLS: Record<string, string> = {
	RUB: '₽',
	USD: '$',
	EUR: '€',
};

const PRIMARY_ELIGIBLE_TYPES = new Set(['checking']);

interface AccountBalanceCardProps {
	balance: number;
	currency: string;
	symbol: string;
	accountType: EAccountType;
	creditLimit: number | null;
	availableCredit: number | null;
	interestRate?: number;
	balanceVisible: boolean;
	onToggle: () => void;
}

function AccountBalanceCard({
	balance,
	currency,
	symbol,
	accountType,
	creditLimit,
	availableCredit,
	interestRate,
	balanceVisible,
	onToggle,
}: AccountBalanceCardProps) {
	const { t } = useTranslation();
	const isCredit = accountType === 'credit';
	return (
		<Card className="mb-4">
			<CardHeader>
				<CardTitle>{isCredit ? t('account_detail.debt') : t('account_detail.available_balance')}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center gap-2">
					<p className="text-3xl sm:text-4xl font-bold">
						{balanceVisible
							? `${balance.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ${symbol}`
							: `•••••• ${symbol}`}
					</p>
					<BalanceToggle visible={balanceVisible} onToggle={onToggle} />
				</div>
				<p className="text-sm text-muted-foreground mt-2">{currency}</p>
				{interestRate != null && (
					<p className="text-sm text-muted-foreground mt-1">
						{t('account_detail.interest_rate')}: {interestRate}%
					</p>
				)}
				{isCredit && creditLimit != null && (
					<p className="text-sm text-muted-foreground mt-1">
						{t('account_detail.credit_limit')}: {creditLimit.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} {symbol}
					</p>
				)}
				{isCredit && availableCredit != null && (
					<p className="text-sm text-muted-foreground mt-1">
						{t('account_detail.available_credit')}:{' '}
						{balanceVisible
							? `${availableCredit.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ${symbol}`
							: `•••••• ${symbol}`}
					</p>
				)}
			</CardContent>
		</Card>
	);
}

interface CloseAccountButtonProps {
	accountId: string;
	status: string;
}

function CloseAccountButton({ accountId, status }: CloseAccountButtonProps) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const updateStatus = useUpdateAccountStatus();

	const onSuccess = () => {
		toast.success(t('account_detail.close_account_toast'));
		navigate('/accounts');
	};
	const onError = (error: unknown) => {
		const is400 = axios.isAxiosError(error) && error.response?.status === 400;
		toast.error(is400 ? t('account_detail.close_account_error_balance') : t('account_detail.close_account_error'));
	};
	const handleClose = () => {
		updateStatus.mutate({ id: accountId, dto: { status: 'closed' } }, { onSuccess, onError });
		setOpen(false);
	};

	return (
		<>
			<Button
				variant="destructive"
				onClick={() => setOpen(true)}
				disabled={status === 'closed'}
			>
				<Trash2 className="size-4 mr-2" />
				{t('account_detail.close_account')}
			</Button>
			<ConfirmDialog
				open={open}
				title={t('account_detail.close_account_confirm_title')}
				description={t('account_detail.close_account_confirm_description')}
				onClose={() => setOpen(false)}
				onConfirm={handleClose}
			/>
		</>
	);
}

interface AccountSecondaryActionsProps {
	showPrimaryButton: boolean;
	isPrimaryPending: boolean;
	onSetPrimary: () => void;
	accountId: string;
	status: string;
}

function AccountSecondaryActions({ showPrimaryButton, isPrimaryPending, onSetPrimary, accountId, status }: AccountSecondaryActionsProps) {
	const { t } = useTranslation();
	return (
		<div className={`grid grid-cols-1 gap-3 mb-6 ${showPrimaryButton ? 'md:grid-cols-2' : ''}`}>
			{showPrimaryButton && (
				<Button variant="outline" onClick={onSetPrimary} disabled={isPrimaryPending}>
					<Star className="size-4 mr-2" />
					{t('accounts.set_primary')}
				</Button>
			)}
			<CloseAccountButton accountId={accountId} status={status} />
		</div>
	);
}

interface MonthlyPaymentActionProps {
	accountId: string;
}

function MonthlyPaymentAction({ accountId }: MonthlyPaymentActionProps) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const monthlyPayment = useMonthlyPayment();

	const handleConfirm = () => {
		monthlyPayment.mutate(accountId, {
			onSuccess: () => {
				toast.success(t('account_detail.monthly_payment_toast'));
				setOpen(false);
			},
			onError: () => toast.error(t('account_detail.monthly_payment_error')),
		});
	};

	return (
		<>
			<div className="mb-3">
				<Button
					variant="outline"
					className="w-full"
					disabled={monthlyPayment.isPending}
					onClick={() => setOpen(true)}
				>
					<CalendarClock className="size-4 mr-2" />
					{t('account_detail.monthly_payment')}
				</Button>
			</div>
			<ConfirmDialog
				open={open}
				title={t('account_detail.monthly_payment_confirm_title')}
				description={t('account_detail.monthly_payment_confirm_description')}
				onClose={() => setOpen(false)}
				onConfirm={handleConfirm}
			/>
		</>
	);
}

interface AccountDetailsDialogProps {
	accountNumber: string;
	bankInfo: { bik: string; name: string } | undefined;
	status: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

function AccountDetailsDialog({ accountNumber, bankInfo, status, open, onOpenChange }: AccountDetailsDialogProps) {
	const { t } = useTranslation();
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('account_detail.details_title')}</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 pt-2">
					<div>
						<p className="text-sm text-muted-foreground">{t('account_detail.account_number')}</p>
						<p className="font-mono text-sm mt-0.5">{accountNumber}</p>
					</div>
					<Separator />
					<div>
						<p className="text-sm text-muted-foreground">{t('account_detail.bik')}</p>
						<p className="font-mono text-sm mt-0.5">{bankInfo?.bik ?? '—'}</p>
					</div>
					<Separator />
					<div>
						<p className="text-sm text-muted-foreground">{t('account_detail.bank')}</p>
						<p className="text-sm mt-0.5">{bankInfo?.name ?? '—'}</p>
					</div>
					<Separator />
					<div>
						<p className="text-sm text-muted-foreground">{t('account_detail.status')}</p>
						<p className="text-sm mt-0.5">{status}</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

interface LinkedCardItemProps {
	id: string;
	name: string;
	cardNumber: string;
	type: string;
	status: string;
}

function LinkedCardItem({ id, name, cardNumber, type, status }: LinkedCardItemProps) {
	return (
		<Link to={`/cards/${id}`}>
			<div className="flex items-center justify-between gap-3 py-3 px-1 hover:bg-accent rounded-lg transition-colors cursor-pointer">
				<div className="flex items-center gap-3 min-w-0">
					<div className="p-2 bg-primary/10 rounded-lg shrink-0">
						<CreditCard className="size-4 text-primary" />
					</div>
					<div className="min-w-0">
						<p className="font-medium text-sm">{name}</p>
						<p className="text-xs text-muted-foreground mt-0.5">{cardNumber}</p>
					</div>
				</div>
				<div className="flex items-center gap-2 shrink-0">
					<Badge variant="secondary" className="text-xs">{type}</Badge>
					<Badge variant="outline" className="text-xs">{status}</Badge>
					<ArrowRight className="size-4 text-muted-foreground" />
				</div>
			</div>
		</Link>
	);
}

export function AccountDetail() {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const [detailsOpen, setDetailsOpen] = useState(false);
	const { balanceVisible, toggle } = usePrivacyStore();

	const { data: me } = useMe();
	const { data: account, isLoading, isError } = useAccount(id ?? '');
	const { data: allCards } = useCards();
	const linkedCards = allCards?.filter((c) => c.linkedAccountId === id) ?? [];
	const { data: bankInfo } = useBankInfo();
	const setPrimary = useSetPrimaryAccount();

	const isPrimary = me?.primaryAccountId === id;

	if (isLoading) {
		return (
			<div className="p-4 sm:p-8 space-y-6">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-32 rounded-xl" />
				<Skeleton className="h-12 rounded-xl" />
			</div>
		);
	}

	if (isError || !account) {
		return (
			<NotFound
				title={t('account_detail.not_found_title')}
				description={t('account_detail.not_found_description')}
				backTo="/accounts"
				backLabel={t('account_detail.back')}
			/>
		);
	}

	const isEligible = PRIMARY_ELIGIBLE_TYPES.has(account.type);
	const showPrimaryButton = isEligible && !isPrimary;
	const symbol = CURRENCY_SYMBOLS[account.currency] ?? account.currency;
	const masked = `****${account.accountNumber.slice(-4)}`;
	const availableCredit = account.creditLimit != null ? account.creditLimit - account.balance : null;
	const canCreateCard =
		(account.type === 'checking' || account.type === 'credit') && account.status === 'active';
	const onSetPrimaryError = () => toast.error(t('account_detail.set_primary_error'));
	const handleSetPrimary = () => setPrimary.mutate(account.id, { onError: onSetPrimaryError });

	return (
		<div className="p-4 sm:p-8">
			<div className="mb-6">
				<div className="flex items-start justify-between flex-wrap gap-y-2 mb-2">
					<div className="flex items-center gap-2 flex-wrap">
						<h1 className="text-2xl sm:text-3xl font-semibold">{account.name}</h1>
						{isPrimary && (
							<Badge className="shrink-0">
								<Star className="size-3 mr-1 fill-current" />
								{t('accounts.primary')}
							</Badge>
						)}
					</div>
					<Badge variant="secondary">{account.type}</Badge>
				</div>
				<p className="text-sm text-muted-foreground break-all">{masked}</p>
			</div>

			<AccountBalanceCard
				balance={account.balance}
				currency={account.currency}
				symbol={symbol}
				accountType={account.type}
				creditLimit={account.creditLimit}
				availableCredit={availableCredit}
				interestRate={account.interestRate}
				balanceVisible={balanceVisible}
				onToggle={toggle}
			/>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
				<Link to="/payments" className="w-full">
					<Button className="w-full">
						<Send className="size-4 mr-2" />
						{t('account_detail.transfer')}
					</Button>
				</Link>
				<TopupDialog
					accountId={account.id}
					balance={account.balance}
					trigger={
						<Button className="w-full">
							<PlusCircle className="size-4 mr-2" />
							{t('account_detail.topup')}
						</Button>
					}
				/>
				<Button className="w-full" onClick={() => setDetailsOpen(true)}>
					<FileText className="size-4 mr-2" />
					{t('account_detail.details')}
				</Button>
			</div>

			{account.type === 'credit' && <MonthlyPaymentAction accountId={account.id} />}

			{canCreateCard && (
				<div className="mb-3">
					<CreateCardDialog
						defaultAccountId={account.id}
						trigger={
							<Button variant="outline" className="w-full">
								<CreditCard className="size-4 mr-2" />
								{t('account_detail.create_card')}
							</Button>
						}
					/>
				</div>
			)}

			<AccountSecondaryActions
				showPrimaryButton={showPrimaryButton}
				isPrimaryPending={setPrimary.isPending}
				onSetPrimary={handleSetPrimary}
				accountId={account.id}
				status={account.status}
			/>

			<AccountDetailsDialog
				open={detailsOpen}
				onOpenChange={setDetailsOpen}
				accountNumber={account.accountNumber}
				bankInfo={bankInfo}
				status={account.status}
			/>

			{linkedCards.length > 0 && (
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>{t('account_detail.linked_cards')}</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						{linkedCards.map((card) => (
							<LinkedCardItem
								key={card.id}
								id={card.id}
								name={card.name}
								cardNumber={card.cardNumber}
								type={card.type}
								status={card.status}
							/>
						))}
					</CardContent>
				</Card>
			)}

		</div>
	);
}
