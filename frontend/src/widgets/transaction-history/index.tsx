import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { usePrivacyStore } from '@/features/balance-visibility/model';
import { Badge } from '@/shared/ui/badge';
import { Separator } from '@/shared/ui/separator';

export type TransactionItem = {
	id: string;
	date: string;
	description: string;
	/** Positive = income (green), negative = expense */
	amount: number;
	typeLabel?: string;
};

type Props = {
	transactions: TransactionItem[];
	currency?: string;
	locale?: string;
	emptyMessage?: string;
	getDetailUrl?: (id: string) => string;
};

export function TransactionHistory({
	transactions,
	currency = '₽',
	locale = 'ru-RU',
	emptyMessage,
	getDetailUrl,
}: Props) {
	const { t } = useTranslation();
	const balanceVisible = usePrivacyStore((s) => s.balanceVisible);
	const message = emptyMessage ?? t('transaction_history.empty');

	if (transactions.length === 0) {
		return <p className="text-sm text-muted-foreground text-center py-4">{message}</p>;
	}

	return (
		<div className="space-y-4">
			{transactions.map((transaction, index) => {
				const url = getDetailUrl?.(transaction.id);
				const content = (
					<div>
						<p className="font-medium">{transaction.description}</p>
						{transaction.typeLabel && (
							<Badge variant="secondary" className="text-xs mt-0.5">
								{transaction.typeLabel}
							</Badge>
						)}
						<div className="flex items-baseline justify-between flex-wrap gap-x-3 gap-y-0.5 mt-1">
							<p className="text-sm text-muted-foreground">{transaction.date}</p>
							<p
								className={`font-semibold ml-auto ${transaction.amount > 0 ? 'text-green-600' : 'text-foreground'}`}
							>
								{balanceVisible
									? `${transaction.amount > 0 ? '+' : '−'}${Math.abs(transaction.amount).toLocaleString(locale, { minimumFractionDigits: 2 })} ${currency}`
									: `•••• ${currency}`}
							</p>
						</div>
					</div>
				);

				return (
					<div key={transaction.id}>
						{index > 0 && <Separator className="mb-4" />}
						{url ? (
							<Link to={url} className="block hover:bg-accent -mx-3 px-3 py-1 rounded-md transition-colors">
								{content}
							</Link>
						) : (
							content
						)}
					</div>
				);
			})}
		</div>
	);
}
