import {
	CreditCard as CreditCardIcon,
	ExternalLink,
	Eye,
	EyeOff,
	KeyRound,
	Lock,
	LockOpen,
	PlusCircle,
	Send,
	Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { useCard, useUpdateCardStatus } from '@/entities/card/queries';
import { BalanceToggle } from '@/features/balance-visibility/balance-toggle';
import { usePrivacyStore } from '@/features/balance-visibility/model';
import { NotFound } from '@/pages/not-found';
import type { EAccountCurrency } from '@/shared/api/types';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';
import { Skeleton } from '@/shared/ui/skeleton';
import { TransactionHistory } from '@/widgets/transaction-history';
import { PinDialog } from './pin-dialog';

const CURRENCY_SYMBOLS: Record<EAccountCurrency, string> = {
	RUB: '₽',
	USD: '$',
	EUR: '€',
};

interface CardFaceProps {
	card: { fullNumber: string; expiryDate: string; cvv: string; type: string; cardHolder: string };
	visible: boolean;
	onToggle: () => void;
}

function CardFace({ card, visible, onToggle }: CardFaceProps) {
	const { t } = useTranslation();
	return (
		<div
			className="w-full max-w-sm rounded-2xl bg-linear-to-br from-slate-900 to-slate-700 text-white p-4 sm:p-6 flex flex-col justify-between shadow-xl"
			style={{ aspectRatio: '85.6/53.98' }}
		>
			<div className="flex justify-between items-start">
				<CreditCardIcon className="size-6 sm:size-8" />
				<div className="flex items-center gap-2">
					<span className="text-xs opacity-80">{t(`enums.card_type.${card.type}`)}</span>
					<button
						type="button"
						onClick={onToggle}
						className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
						aria-label={visible ? 'Hide card info' : 'Show card info'}
					>
						{visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
					</button>
				</div>
			</div>

			<p className="text-sm sm:text-base tracking-wider sm:tracking-widest font-mono">
				{visible ? card.fullNumber : `•••• •••• •••• ${card.fullNumber.slice(-4)}`}
			</p>

			<div className="flex justify-between items-end">
				<div>
					<p className="text-[10px] opacity-60 mb-1">CARDHOLDER</p>
					<p className="text-xs sm:text-sm font-medium">{card.cardHolder}</p>
				</div>
				<div className="text-center">
					<p className="text-[10px] opacity-60 mb-1">EXPIRES</p>
					<p className="text-xs sm:text-sm font-medium font-mono">
						{visible ? card.expiryDate : '••/••'}
					</p>
				</div>
				<div className="text-right">
					<p className="text-[10px] opacity-60 mb-1">CVV</p>
					<p className="text-xs sm:text-sm font-medium font-mono">{visible ? card.cvv : '•••'}</p>
				</div>
			</div>
		</div>
	);
}

export function CardDetail() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { balanceVisible, toggle } = usePrivacyStore();
	const [cardInfoVisible, setCardInfoVisible] = useState(false);
	const [confirmAction, setConfirmAction] = useState<'lock' | 'cancel' | null>(null);

	const { data: card, isLoading, isError } = useCard(id ?? '');
	const updateStatus = useUpdateCardStatus();

	if (isLoading) {
		return (
			<div className="p-4 sm:p-8 space-y-6">
				<Skeleton className="h-10 w-48" />
				<Skeleton className="h-48 w-full max-w-sm mx-auto rounded-2xl" />
				<div className="grid gap-6 md:grid-cols-2">
					<Skeleton className="h-32 rounded-xl" />
					<Skeleton className="h-32 rounded-xl" />
				</div>
			</div>
		);
	}

	if (isError || !card) {
		return (
			<NotFound
				title={t('cards.not_found_title')}
				description={t('cards.not_found_description')}
				backTo="/cards"
				backLabel={t('cards.back')}
			/>
		);
	}

	const symbol = CURRENCY_SYMBOLS[card.currency];

	const transactionItems: never[] = [];

	return (
		<div className="p-4 sm:p-8">
			<div className="mb-6">
				<div className="flex items-start justify-between flex-wrap gap-y-2 mb-2">
					<h1 className="text-2xl sm:text-3xl font-semibold">{card.name}</h1>
					<div className="flex gap-2">
						<Badge variant="secondary">{t(`enums.card_type.${card.type}`)}</Badge>
						<Badge variant="outline">{t(`enums.card_status.${card.status}`)}</Badge>
					</div>
				</div>
				<p className="text-sm text-muted-foreground">{card.cardNumber}</p>
			</div>

			<div className="grid gap-6 mb-6">
				<div className="flex justify-center">
					<CardFace
						card={card}
						visible={cardInfoVisible}
						onToggle={() => setCardInfoVisible((v) => !v)}
					/>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>
								{card.type === 'Credit' ? t('cards.debt') : t('cards.available_balance')}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-2">
								<p className="text-3xl sm:text-4xl font-bold">
									{balanceVisible
										? `${card.balance.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ${symbol}`
										: `•••••• ${symbol}`}
								</p>
								<BalanceToggle visible={balanceVisible} onToggle={toggle} />
							</div>
							{card.type === 'Credit' && card.availableCredit != null && (
								<p className="text-sm text-muted-foreground mt-2">
									{t('cards.available_credit')}:{' '}
									{balanceVisible
										? `${card.availableCredit.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ${symbol}`
										: `•••••• ${symbol}`}
								</p>
							)}
						</CardContent>
					</Card>

					{card.type === 'Credit' && card.creditLimit != null && (
						<Card>
							<CardHeader>
								<CardTitle>{t('cards.credit_limit')}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-3xl sm:text-4xl font-bold">
									{card.creditLimit.toLocaleString('ru-RU')} {symbol}
								</p>
								<p className="text-sm text-muted-foreground mt-2">
									{card.creditLimit > 0
										? `${((card.balance / card.creditLimit) * 100).toFixed(1)}% ${t('cards.utilized')}`
										: '0% utilized'}
								</p>
							</CardContent>
						</Card>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
				<Link to="/payments" className="w-full">
					<Button className="w-full">
						<PlusCircle className="size-4 mr-2" />
						{t('cards.topup')}
					</Button>
				</Link>
				<Link to="/payments" className="w-full">
					<Button className="w-full">
						<Send className="size-4 mr-2" />
						{t('cards.transfer')}
					</Button>
				</Link>
				<PinDialog
					cardId={card.id}
					pin={card.pin}
					trigger={
						<Button variant="outline" className="w-full">
							<KeyRound className="size-4 mr-2" />
							{t('cards.pin_button')}
						</Button>
					}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
				<Link to={`/accounts/${card.linkedAccountId}`} className="w-full">
					<Button variant="outline" className="w-full">
						<ExternalLink className="size-4 mr-2" />
						{t('cards.go_to_account')}
					</Button>
				</Link>
				{card.status === 'Locked' ? (
					<Button
						variant="outline"
						className="w-full"
						disabled={updateStatus.isPending}
						onClick={() =>
							updateStatus.mutate(
								{ id: card.id, dto: { status: 'Active' } },
								{
									onSuccess: () => toast.success(t('cards.unlock_card_toast')),
									onError: () => toast.error(t('cards.action_error')),
								},
							)
						}
					>
						<LockOpen className="size-4 mr-2" />
						{t('cards.unlock_card')}
					</Button>
				) : (
					<Button
						variant="outline"
						className="w-full"
						disabled={updateStatus.isPending}
						onClick={() => setConfirmAction('lock')}
					>
						<Lock className="size-4 mr-2" />
						{t('cards.lock_card')}
					</Button>
				)}
			</div>

			<div className="mb-6">
				<Button
					variant="destructive"
					className="w-full"
					disabled={updateStatus.isPending}
					onClick={() => setConfirmAction('cancel')}
				>
					<Trash2 className="size-4 mr-2" />
					{t('cards.cancel_card')}
				</Button>
			</div>

			<Card className="gap-1">
				<CardHeader>
					<CardTitle>{t('cards.recent_transactions')}</CardTitle>
				</CardHeader>
				<CardContent>
					<TransactionHistory
						transactions={transactionItems}
						currency={symbol}
						locale="ru-RU"
						getDetailUrl={(txId) => `/operations/${txId}`}
					/>
				</CardContent>
			</Card>

			<ConfirmDialog
				open={confirmAction !== null}
				title={confirmAction === 'lock' ? t('cards.lock_card_confirm_title') : t('cards.cancel_card_confirm_title')}
				description={
					confirmAction === 'lock'
						? t('cards.lock_card_confirm_description')
						: t('cards.cancel_card_confirm_description')
				}
				onClose={() => setConfirmAction(null)}
				onConfirm={() => {
					const status = confirmAction === 'lock' ? 'Locked' : 'Closed';
					updateStatus.mutate(
						{ id: card.id, dto: { status } },
						{
							onSuccess: () => {
								if (confirmAction === 'cancel') {
									toast.success(t('cards.cancel_card_toast'));
									navigate('/cards');
								} else {
									toast.success(t('cards.lock_card_toast'));
									setConfirmAction(null);
								}
							},
							onError: () => {
								toast.error(t('cards.action_error'));
								setConfirmAction(null);
							},
						},
					);
				}}
			/>
		</div>
	);
}
