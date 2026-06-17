import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ApiAccount, EAccountCurrency } from '@/shared/api/types';
import { formatBalance, maskAccountNumber } from '@/shared/helpers';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Separator } from '@/shared/ui/separator';

export type PendingPayment = {
	method: 'account' | 'phone' | 'card';
	fromAccountId: string;
	recipientIdentifier: string;
	amount: number;
	description?: string;
};

export type ConversionInfo = {
	fromCurrency: EAccountCurrency;
	toCurrency: EAccountCurrency;
	fromAmount: number;
	toAmount: number;
	updatedAt: string;
};

type Props = {
	open: boolean;
	data: PendingPayment;
	accounts: ApiAccount[];
	conversionInfo: ConversionInfo | null;
	isPending: boolean;
	onClose: () => void;
	onConfirm: () => void;
};

type RowProps = {
	label: string;
	value: string;
};

function Row({ label, value }: RowProps) {
	return (
		<div>
			<p className="text-sm text-muted-foreground">{label}</p>
			<p className="font-medium mt-0.5">{value}</p>
		</div>
	);
}

function rateLabel(from: EAccountCurrency, to: EAccountCurrency, fromAmount: number, toAmount: number): string {
	const rate = toAmount / fromAmount;
	return `1 ${from} = ${rate.toFixed(4)} ${to}`;
}

export function PaymentConfirmDialog({ open, data, accounts, conversionInfo, isPending, onClose, onConfirm }: Props) {
	const { t } = useTranslation();

	const fromAccount = accounts.find((a) => a.id === data.fromAccountId);
	const fromAccountLabel = fromAccount
		? `${fromAccount.name} (${maskAccountNumber(fromAccount.accountNumber)}) — ${formatBalance(fromAccount.balance, fromAccount.currency)}`
		: data.fromAccountId;

	const recipientLabel =
		data.method === 'phone'
			? t('payments.recipient_phone')
			: data.method === 'card'
				? t('payments.recipient_card')
				: t('payments.recipient_account');

	const updatedDate = conversionInfo
		? new Date(conversionInfo.updatedAt).toLocaleDateString('ru-RU')
		: null;

	return (
		<Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('payments.confirm_title')}</DialogTitle>
				</DialogHeader>

				<div className="space-y-3 py-2">
					<Row label={t('payments.from_account')} value={fromAccountLabel} />
					<Separator />
					<Row label={recipientLabel} value={data.recipientIdentifier} />
					<Separator />
					<Row
						label={t('payments.amount')}
						value={fromAccount ? formatBalance(data.amount, fromAccount.currency) : String(data.amount)}
					/>
					{data.description && (
						<>
							<Separator />
							<Row label={t('payments.description_optional')} value={data.description} />
						</>
					)}
				</div>

				{conversionInfo && (
					<div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 text-sm">
						<div className="flex items-center gap-2 font-semibold text-yellow-700 dark:text-yellow-400 mb-2">
							<AlertTriangle className="h-4 w-4 shrink-0" />
							{t('payments.conversion_title')}
						</div>
						<div className="flex items-center gap-2 font-medium mb-1">
							<span>{formatBalance(conversionInfo.fromAmount, conversionInfo.fromCurrency)}</span>
							<ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
							<span>≈ {formatBalance(conversionInfo.toAmount, conversionInfo.toCurrency)}</span>
						</div>
						<p className="text-xs text-muted-foreground">
							{rateLabel(conversionInfo.fromCurrency, conversionInfo.toCurrency, conversionInfo.fromAmount, conversionInfo.toAmount)}
							{' · '}{t('payments.conversion_cbr')} {updatedDate}
						</p>
					</div>
				)}

				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isPending}>
						{t('payments.cancel')}
					</Button>
					<Button onClick={onConfirm} disabled={isPending}>
						{isPending ? t('payments.sending') : t('payments.send')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
