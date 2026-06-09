import { useTranslation } from 'react-i18next';
import type { ApiAccount } from '@/shared/api/types';
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

type Props = {
	open: boolean;
	data: PendingPayment;
	accounts: ApiAccount[];
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

export function PaymentConfirmDialog({ open, data, accounts, isPending, onClose, onConfirm }: Props) {
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
					<Row label={t('payments.amount')} value={String(data.amount)} />
					{data.description && (
						<>
							<Separator />
							<Row label={t('payments.description_optional')} value={data.description} />
						</>
					)}
				</div>

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
