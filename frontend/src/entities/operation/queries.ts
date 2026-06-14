import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { OperationsQuery } from '@/shared/api/operations';
import {
	getAccountOperations,
	getCardOperations,
	getOperation,
	getOperations,
	getOperationsSummary,
} from '@/shared/api/operations';

const LIMIT = 20;

export type OperationFilters = Pick<OperationsQuery, 'direction' | 'dateFrom' | 'dateTo'>;
export type AccountOperationFilters = Pick<OperationsQuery, 'direction' | 'dateFrom' | 'dateTo'>;

export const operationKeys = {
	all: ['operations'] as const,
	list: (filters: OperationFilters) => ['operations', 'list', filters] as const,
	summary: ['operations', 'summary'] as const,
	detail: (id: string) => ['operations', id] as const,
	byAccount: (accountId: string, filters: AccountOperationFilters) =>
		['operations', 'account', accountId, filters] as const,
	byCard: (cardId: string, filters: AccountOperationFilters) =>
		['operations', 'card', cardId, filters] as const,
};

export function useOperationsSummary() {
	return useQuery({
		queryKey: operationKeys.summary,
		queryFn: getOperationsSummary,
	});
}

export function useOperations(filters: OperationFilters = {}) {
	return useInfiniteQuery({
		queryKey: operationKeys.list(filters),
		queryFn: ({ pageParam = 0 }) =>
			getOperations({ limit: LIMIT, offset: pageParam as number, ...filters }),
		initialPageParam: 0,
		getNextPageParam: (last, pages) => {
			const fetched = pages.reduce((sum, p) => sum + p.items.length, 0);
			return fetched < last.total ? fetched : undefined;
		},
	});
}

export function useOperation(id: string) {
	return useQuery({
		queryKey: operationKeys.detail(id),
		queryFn: () => getOperation(id),
		enabled: !!id,
	});
}

export function useAccountOperations(accountId: string, filters: AccountOperationFilters = {}) {
	return useInfiniteQuery({
		queryKey: operationKeys.byAccount(accountId, filters),
		queryFn: ({ pageParam = 0 }) =>
			getAccountOperations(accountId, { limit: LIMIT, offset: pageParam as number, ...filters }),
		initialPageParam: 0,
		getNextPageParam: (last, pages) => {
			const fetched = pages.reduce((sum, p) => sum + p.items.length, 0);
			return fetched < last.total ? fetched : undefined;
		},
		enabled: !!accountId,
	});
}

export function useCardOperations(cardId: string, filters: AccountOperationFilters = {}) {
	return useInfiniteQuery({
		queryKey: operationKeys.byCard(cardId, filters),
		queryFn: ({ pageParam = 0 }) =>
			getCardOperations(cardId, { limit: LIMIT, offset: pageParam as number, ...filters }),
		initialPageParam: 0,
		getNextPageParam: (last, pages) => {
			const fetched = pages.reduce((sum, p) => sum + p.items.length, 0);
			return fetched < last.total ? fetched : undefined;
		},
		enabled: !!cardId,
	});
}
