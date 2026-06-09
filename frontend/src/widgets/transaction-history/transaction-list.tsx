import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { usePrivacyStore } from '@/features/balance-visibility/model';
import { maskAccountNumber } from '@/shared/helpers';
import { Badge } from '@/shared/ui/badge';
import { Separator } from '@/shared/ui/separator';

export type TransactionItem = {
	id: string;
	date: string;
	description: string;
	/** Positive = income (green), negative = expense */
	amount: number;
	typeLabel?: string;
	/** Machine value used for type-filter matching inside TransactionHistory */
	type?: string;
	fromAccountNumber?: string | null;
	toAccountNumber?: string | null;
};

type Props = {
	transactions: TransactionItem[];
	currency?: string;
	locale?: string;
	emptyMessage?: string;
	getDetailUrl?: (id: string) => string;
};

interface TransactionCardProps {
	transaction: TransactionItem;
	currency: string;
	locale: string;
	url?: string;
}

function TransactionCard({ transaction, currency, locale, url }: TransactionCardProps) {
	const { t } = useTranslation();
	const balanceVisible = usePrivacyStore((s) => s.balanceVisible);
	const isInternal = transaction.type === 'internal';
	const amountColor = !isInternal && transaction.amount > 0 ? 'text-green-600' : 'text-foreground';
	const amountPrefix = isInternal ? '↔ ' : transaction.amount > 0 ? '+' : '−';
	const accountRoute =
		transaction.fromAccountNumber && transaction.toAccountNumber
			? `${maskAccountNumber(transaction.fromAccountNumber)} → ${maskAccountNumber(transaction.toAccountNumber)}`
			: null;

	const content = (
		<div>
			<div className="flex items-start justify-between gap-2">
				<div className="min-w-0">
					<p className="font-medium">{transaction.description}</p>
					<div className="flex items-center gap-1.5 flex-wrap mt-0.5">
						{transaction.typeLabel && (
							<Badge variant="secondary" className="text-xs">
								{transaction.typeLabel}
							</Badge>
						)}
						{isInternal && (
							<Badge variant="outline" className="text-xs">
								{t('operations.type_internal')}
							</Badge>
						)}
					</div>
					{accountRoute && (
						<p className="text-xs text-muted-foreground font-mono mt-1">{accountRoute}</p>
					)}
				</div>
				<p className={`font-semibold shrink-0 ${amountColor}`}>
					{balanceVisible
						? `${amountPrefix}${Math.abs(transaction.amount).toLocaleString(locale, { minimumFractionDigits: 2 })} ${currency}`
						: `•••• ${currency}`}
				</p>
			</div>
			<p className="text-sm text-muted-foreground mt-1">{transaction.date}</p>
		</div>
	);

	if (url) {
		return (
			<Link to={url} className="block hover:bg-accent -mx-3 px-3 py-1 rounded-md transition-colors">
				{content}
			</Link>
		);
	}
	return content;
}

export function TransactionList({
	transactions,
	currency = '₽',
	locale = 'ru-RU',
	emptyMessage,
	getDetailUrl,
}: Props) {
	const { t } = useTranslation();
	const message = emptyMessage ?? t('transaction_history.empty');

	if (transactions.length === 0) {
		return <p className="text-sm text-muted-foreground text-center py-4">{message}</p>;
	}

	return (
		<div className="space-y-4">
			{transactions.map((transaction, index) => (
				<div key={transaction.id}>
					{index > 0 && <Separator className="mb-4" />}
					<TransactionCard
						transaction={transaction}
						currency={currency}
						locale={locale}
						url={getDetailUrl?.(transaction.id)}
					/>
				</div>
			))}
		</div>
	);
}
