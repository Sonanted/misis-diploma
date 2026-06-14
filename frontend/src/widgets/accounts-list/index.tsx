import { ArrowRight, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useAccounts } from '@/entities/account/queries';
import { useMe } from '@/entities/user/queries';
import { BalanceToggle } from '@/features/balance-visibility/balance-toggle';
import { usePrivacyStore } from '@/features/balance-visibility/model';
import type { EAccountCurrency } from '@/shared/api/types';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { Skeleton } from '@/shared/ui/skeleton';
import { CreateAccountDialog } from './create-account-dialog';

const CURRENCY_SYMBOLS: Record<EAccountCurrency, string> = {
	RUB: '₽',
	USD: '$',
	EUR: '€',
};

export function AccountsList() {
	const { t } = useTranslation();
	const { balanceVisible, toggle } = usePrivacyStore();
	const { data: me } = useMe();
	const { data: accounts, isLoading } = useAccounts();

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
				<CreateAccountDialog />
			</div>

			{isLoading && (
				<div className="grid gap-4">
					{Array.from({ length: 3 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
						<Skeleton key={i} className="h-26 rounded-xl" />
					))}
				</div>
			)}

			{!isLoading && accounts?.length === 0 && (
				<EmptyState
					icon={Wallet}
					title={t('accounts.empty_title')}
					description={t('accounts.empty_description')}
					action={<CreateAccountDialog />}
				/>
			)}

			{!isLoading && accounts && accounts.length > 0 && (
				<div className="grid gap-4">
					{accounts.map((account) => {
						const isPrimary = me?.primaryAccountId === account.id;
						const symbol = CURRENCY_SYMBOLS[account.currency];
						const masked = `****${account.accountNumber.slice(-4)}`;
						return (
							<Link key={account.id} to={`/accounts/${account.id}`}>
								<Card className="hover:bg-accent transition-colors cursor-pointer">
									<CardHeader className="pb-3">
										<div className="flex items-start justify-between flex-wrap gap-y-2">
											<div className="min-w-0">
												<div className="flex items-center gap-2 flex-wrap">
													<CardTitle className="text-lg sm:text-xl">{account.name}</CardTitle>
													{isPrimary && (
														<Badge className="shrink-0 text-xs">{t('accounts.primary')}</Badge>
													)}
												</div>
												<p className="text-sm text-muted-foreground mt-1">{masked}</p>
											</div>
											<Badge variant="secondary" className="shrink-0">{t(`enums.account_type.${account.type}`)}</Badge>
										</div>
									</CardHeader>
									<CardContent>
										<div className="flex items-center justify-between gap-2">
											<div className="min-w-0">
												<p className="text-2xl sm:text-3xl font-bold">
													{balanceVisible
														? `${account.balance.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ${symbol}`
														: `•••••• ${symbol}`}
												</p>
												<p className="text-sm text-muted-foreground mt-1">{t('accounts.available_balance')}</p>
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
