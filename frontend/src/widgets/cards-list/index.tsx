import { ArrowRight, CreditCard, WalletCards } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useCards } from '@/entities/card/queries';
import { BalanceToggle } from '@/features/balance-visibility/balance-toggle';
import { usePrivacyStore } from '@/features/balance-visibility/model';
import type { EAccountCurrency } from '@/shared/api/types';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { Skeleton } from '@/shared/ui/skeleton';
import { CreateCardDialog } from './create-card-dialog';

const CURRENCY_SYMBOLS: Record<EAccountCurrency, string> = {
	RUB: '₽',
	USD: '$',
	EUR: '€',
};

export function CardsList() {
	const { t } = useTranslation();
	const { balanceVisible, toggle } = usePrivacyStore();
	const { data: cards, isLoading } = useCards();

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
				<CreateCardDialog />
			</div>

			{isLoading && (
				<div className="grid gap-4">
					{Array.from({ length: 3 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
						<Skeleton key={i} className="h-26 rounded-xl" />
					))}
				</div>
			)}

			{!isLoading && cards?.length === 0 && (
				<EmptyState
					icon={WalletCards}
					title={t('cards.empty_title')}
					description={t('cards.empty_description')}
					action={<CreateCardDialog />}
				/>
			)}

			{!isLoading && cards && cards.length > 0 && (
				<div className="grid gap-4">
					{cards.map((card) => {
						const symbol = CURRENCY_SYMBOLS[card.currency];
						return (
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
												<Badge variant="secondary">{t(`enums.card_type.${card.type}`)}</Badge>
												<Badge variant="outline">{t(`enums.card_status.${card.status}`)}</Badge>
											</div>
										</div>
									</CardHeader>
									<CardContent>
										<div className="flex items-center justify-between gap-2">
											<div className="min-w-0">
												<p className="text-xl sm:text-2xl font-bold">
													{balanceVisible
														? `${card.balance.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ${symbol}`
														: `•••••• ${symbol}`}
												</p>
												<p className="text-sm text-muted-foreground mt-1 wrap-break-word">
													{card.type === 'Credit' && card.creditLimit != null
														? `${balanceVisible ? `${(card.availableCredit ?? 0).toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ${symbol}` : `•••••• ${symbol}`} ${t('cards.available_credit').toLowerCase()} / ${t('cards.credit_limit').toLowerCase()} ${card.creditLimit.toLocaleString('ru-RU')} ${symbol}`
														: t('cards.current_balance')}
												</p>
											</div>
											<ArrowRight className="size-5 text-muted-foreground shrink-0" />
										</div>
									</CardContent>
								</Card>
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
}
