import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
	getAccountOperations,
	getCardOperations,
	getOperation,
	getOperations,
} from '@/shared/api/operations';

const LIMIT = 20;

export const operationKeys = {
	all: ['operations'] as const,
	detail: (id: string) => ['operations', id] as const,
	byAccount: (accountId: string) => ['operations', 'account', accountId] as const,
	byCard: (cardId: string) => ['operations', 'card', cardId] as const,
};

export function useOperations() {
	return useInfiniteQuery({
		queryKey: operationKeys.all,
		queryFn: ({ pageParam = 0 }) => getOperations({ limit: LIMIT, offset: pageParam as number }),
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

export function useAccountOperations(accountId: string) {
	return useInfiniteQuery({
		queryKey: operationKeys.byAccount(accountId),
		queryFn: ({ pageParam = 0 }) =>
			getAccountOperations(accountId, { limit: LIMIT, offset: pageParam as number }),
		initialPageParam: 0,
		getNextPageParam: (last, pages) => {
			const fetched = pages.reduce((sum, p) => sum + p.items.length, 0);
			return fetched < last.total ? fetched : undefined;
		},
		enabled: !!accountId,
	});
}

export function useCardOperations(cardId: string) {
	return useInfiniteQuery({
		queryKey: operationKeys.byCard(cardId),
		queryFn: ({ pageParam = 0 }) =>
			getCardOperations(cardId, { limit: LIMIT, offset: pageParam as number }),
		initialPageParam: 0,
		getNextPageParam: (last, pages) => {
			const fetched = pages.reduce((sum, p) => sum + p.items.length, 0);
			return fetched < last.total ? fetched : undefined;
		},
		enabled: !!cardId,
	});
}
