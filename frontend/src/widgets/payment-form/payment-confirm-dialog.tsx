import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Separator } from '@/shared/ui/separator';

export type PendingPayment = {
	method: 'account' | 'phone' | 'card';
	fromAccount: string;
	recipient: string;
	recipientIdentifier: string;
	amount: number;
	description?: string;
};

const ACCOUNT_DISPLAY: Record<string, string> = {
	checking: 'Checking Account (****3456)',
	savings: 'Savings Account (****7890)',
	business: 'Business Account (****1234)',
};

type Props = {
	open: boolean;
	data: PendingPayment;
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

export function PaymentConfirmDialog({ open, data, onClose, onConfirm }: Props) {
	const { t } = useTranslation();

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
					<Row
						label={t('payments.from_account')}
						value={ACCOUNT_DISPLAY[data.fromAccount] ?? data.fromAccount}
					/>
					<Separator />
					<Row label={t('payments.recipient')} value={data.recipient} />
					<Separator />
					<Row label={recipientLabel} value={data.recipientIdentifier} />
					<Separator />
					<Row label={t('payments.amount')} value={`$${Number(data.amount).toFixed(2)}`} />
					{data.description && (
						<>
							<Separator />
							<Row label={t('payments.description_optional')} value={data.description} />
						</>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						{t('payments.cancel')}
					</Button>
					<Button onClick={onConfirm}>
						{t('payments.send')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
