import { ArrowDownLeft, ArrowRight, ArrowUpRight, CreditCard, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { useAccounts } from '@/entities/account/queries';
import { useOperation } from '@/entities/operation/queries';
import { NotFound } from '@/pages/not-found';
import type { ApiAccount, ApiOperation, EOperationType } from '@/shared/api/types';
import { maskAccountNumber } from '@/shared/helpers';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import { Skeleton } from '@/shared/ui/skeleton';

type Direction = 'incoming' | 'outgoing' | 'internal' | null;

function OperationIcon({ type, direction }: { type: EOperationType; direction: Direction }) {
	if (type === 'transfer' || type === 'topup' || type === 'monthly_payment') {
		if (direction === 'incoming') return <ArrowDownLeft className="size-8 text-green-600" />;
		if (direction === 'outgoing') return <ArrowUpRight className="size-8 text-red-600" />;
		return <RefreshCw className="size-8 text-blue-600" />;
	}
	return <CreditCard className="size-8 text-muted-foreground" />;
}

function resolveDirection(op: ApiOperation, userAccountIds: Set<string>): Direction {
	if (op.type === 'topup') return 'incoming';
	if (op.type === 'monthly_payment') return 'outgoing';
	if (op.type === 'transfer') {
		const fromIsOurs = !!op.fromAccountId && userAccountIds.has(op.fromAccountId);
		const toIsOurs = !!op.toAccountId && userAccountIds.has(op.toAccountId);
		if (fromIsOurs && toIsOurs) return 'internal';
		if (fromIsOurs) return 'outgoing';
		if (toIsOurs) return 'incoming';
	}
	return null;
}

interface AccountRowProps {
	label: string;
	accountId: string | null;
	accountNumber: string;
	numbersVisible: boolean;
	accountMap: Map<string, ApiAccount>;
}

function AccountRow({ label, accountId, accountNumber, numbersVisible, accountMap }: AccountRowProps) {
	const ownAccount = accountId ? accountMap.get(accountId) : null;
	const displayNumber = numbersVisible ? accountNumber : maskAccountNumber(accountNumber);

	return (
		<div>
			<p className="text-sm text-muted-foreground mb-1">{label}</p>
			{ownAccount ? (
				<Link
					to={`/accounts/${accountId}`}
					className="inline-flex items-center gap-2 font-mono text-sm rounded-md px-2 py-1 -ml-2 hover:bg-accent transition-colors"
				>
					{displayNumber}
					<ArrowRight className="size-3 text-muted-foreground shrink-0" />
				</Link>
			) : (
				<p className="font-mono text-sm">{displayNumber}</p>
			)}
		</div>
	);
}

interface OperationDetailsCardProps {
	op: ApiOperation;
	accountMap: Map<string, ApiAccount>;
}

function OperationDetailsCard({ op, accountMap }: OperationDetailsCardProps) {
	const { t } = useTranslation();
	const [numbersVisible, setNumbersVisible] = useState(false);
	const hasAccountNumbers = !!(op.fromAccountNumber || op.toAccountNumber);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>{t('operations.transaction_details')}</CardTitle>
				{hasAccountNumbers && (
					<Button
						variant="ghost"
						size="icon"
						className="size-8 shrink-0"
						onClick={() => setNumbersVisible((v) => !v)}
						aria-label={numbersVisible ? t('cards.pin_hide') : t('cards.pin_show')}
					>
						{numbersVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
					</Button>
				)}
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<p className="text-sm text-muted-foreground mb-1">{t('operations.reference_number')}</p>
					<p className="font-mono text-sm">{op.id}</p>
				</div>

				{op.fromAccountNumber && (
					<>
						<Separator />
						<AccountRow
							label={t('operations.from')}
							accountId={op.fromAccountId}
							accountNumber={op.fromAccountNumber}
							numbersVisible={numbersVisible}
							accountMap={accountMap}
						/>
					</>
				)}

				{op.toAccountNumber && (
					<>
						<Separator />
						<AccountRow
							label={t('operations.to')}
							accountId={op.toAccountId}
							accountNumber={op.toAccountNumber}
							numbersVisible={numbersVisible}
							accountMap={accountMap}
						/>
					</>
				)}

				{op.description && (
					<>
						<Separator />
						<div>
							<p className="text-sm text-muted-foreground mb-1">{t('operations.notes')}</p>
							<p className="text-sm">{op.description}</p>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}

export function OperationDetail() {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();

	const { data: op, isLoading, isError } = useOperation(id ?? '');
	const { data: accounts = [] } = useAccounts();
	const userAccountIds = new Set(accounts.map((a) => a.id));
	const accountMap = new Map(accounts.map((a) => [a.id, a]));

	if (isLoading) {
		return (
			<div className="p-8 space-y-6">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-32 rounded-xl" />
				<Skeleton className="h-48 rounded-xl" />
			</div>
		);
	}

	if (isError || !op) {
		return (
			<NotFound
				title={t('operations.not_found_title')}
				description={t('operations.not_found_description')}
				backTo="/operations"
				backLabel={t('operations.back')}
			/>
		);
	}

	const direction = resolveDirection(op, userAccountIds);
	const isInternal = direction === 'internal';
	const typeLabel = t(`operations.type_${op.type}`);
	const description = op.description ?? typeLabel;
	const dateTime = new Date(op.createdAt);
	const dateStr = dateTime.toLocaleDateString('ru-RU');
	const timeStr = dateTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
	const amountColor = direction === 'incoming' ? 'text-green-600' : 'text-foreground';
	const amountPrefix = direction === 'incoming' ? '+' : direction === 'outgoing' ? '−' : '↔ ';

	return (
		<div className="p-8">
			<div className="mb-6">
				<div className="flex items-start gap-4 mb-4">
					<div className="p-3 bg-accent rounded-xl">
						<OperationIcon type={op.type} direction={direction} />
					</div>
					<div className="flex-1">
						<h1 className="text-3xl font-semibold mb-2">{description}</h1>
						<div className="flex items-center gap-2 flex-wrap">
							<p className="text-muted-foreground">{typeLabel}</p>
							{isInternal && <Badge variant="outline">{t('operations.type_internal')}</Badge>}
						</div>
					</div>
					<Badge variant="default">{t('operations.status_completed')}</Badge>
				</div>
			</div>

			<div className="grid gap-6 mb-6">
				{op.amount !== null && (
					<Card>
						<CardHeader>
							<CardTitle>{t('operations.transaction_amount')}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className={`text-5xl font-bold ${amountColor}`}>
								{amountPrefix}
								{op.amount.toLocaleString('ru-RU', { minimumFractionDigits: 2 })}
							</p>
							<p className="text-sm text-muted-foreground mt-2">
								{dateStr} {t('operations.at')} {timeStr}
							</p>
						</CardContent>
					</Card>
				)}

				<OperationDetailsCard op={op} accountMap={accountMap} />
			</div>
		</div>
	);
}
