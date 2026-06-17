import type { ApiOperation, EOperationType } from '@/shared/api/types';
import type { TransactionItem } from '@/widgets/transaction-history/transaction-list';

type Direction = 'incoming' | 'outgoing' | 'internal' | null;

export function operationToTransactionItem(
	op: ApiOperation,
	t: (key: string) => string,
	userAccountIds: Set<string>,
	viewAccountId?: string | null,
	accountCurrencyMap?: Map<string, string>,
): TransactionItem {
	const direction = resolveDirection(op, userAccountIds, viewAccountId);
	const currency = accountCurrencyMap
		? resolveCurrency(op, direction, accountCurrencyMap)
		: undefined;

	const signedAmount =
		op.amount !== null
			? direction === 'incoming'
				? op.amount
				: direction === 'outgoing'
					? -op.amount
					: op.amount // 'internal' or null → neutral, unsigned
			: 0;

	return {
		id: op.id,
		date: op.createdAt.slice(0, 10),
		description: op.description ?? defaultDescription(op.type, t),
		amount: signedAmount,
		type: direction ?? 'other',
		typeLabel: t(`operations.type_${op.type}`),
		fromAccountNumber: op.fromAccountNumber ?? null,
		toAccountNumber: op.toAccountNumber ?? null,
		currency,
	};
}

function resolveCurrency(
	op: ApiOperation,
	direction: Direction,
	map: Map<string, string>,
): string | undefined {
	if (op.type === 'topup') return map.get(op.toAccountId ?? '');
	if (op.type === 'monthly_payment') return map.get(op.fromAccountId ?? '');
	if (op.type === 'transfer') {
		if (direction === 'outgoing' || direction === 'internal') return map.get(op.fromAccountId ?? '');
		if (direction === 'incoming') return map.get(op.toAccountId ?? '');
	}
	return undefined;
}

function resolveDirectionForAccount(op: ApiOperation, viewAccountId: string): Direction {
	if (op.fromAccountId === viewAccountId) return 'outgoing';
	if (op.toAccountId === viewAccountId) return 'incoming';
	return null;
}

function resolveDirectionGlobal(op: ApiOperation, userAccountIds: Set<string>): Direction {
	if (op.type === 'topup') return 'incoming';
	if (op.type === 'monthly_payment') return 'outgoing';
	if (op.type !== 'transfer') return null;
	const fromIsOurs = op.fromAccountId !== null && userAccountIds.has(op.fromAccountId);
	const toIsOurs = op.toAccountId !== null && userAccountIds.has(op.toAccountId);
	if (fromIsOurs && toIsOurs) return 'internal';
	if (fromIsOurs) return 'outgoing';
	if (toIsOurs) return 'incoming';
	return null;
}

function resolveDirection(
	op: ApiOperation,
	userAccountIds: Set<string>,
	viewAccountId?: string | null,
): Direction {
	return viewAccountId
		? resolveDirectionForAccount(op, viewAccountId)
		: resolveDirectionGlobal(op, userAccountIds);
}

function defaultDescription(type: EOperationType, t: (key: string) => string): string {
	return t(`operations.type_${type}`);
}
