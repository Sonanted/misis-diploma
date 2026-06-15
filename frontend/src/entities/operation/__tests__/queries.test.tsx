import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/api/operations', () => ({
	getOperations: vi.fn(() => Promise.resolve({ items: [], total: 0 })),
	getOperationsSummary: vi.fn(() => Promise.resolve({ income: 0, expense: 0 })),
	getOperation: vi.fn(() => Promise.resolve({ id: 'op_1', amount: 100 })),
	getAccountOperations: vi.fn(() => Promise.resolve({ items: [], total: 0 })),
	getCardOperations: vi.fn(() => Promise.resolve({ items: [], total: 0 })),
}));

import {
	useAccountOperations,
	useCardOperations,
	useOperation,
	useOperations,
	useOperationsSummary,
} from '../queries';

function createWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	return ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

describe('operation queries', () => {
	it('useOperationsSummary returns data', async () => {
		const { result } = renderHook(() => useOperationsSummary(), { wrapper: createWrapper() });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual({ income: 0, expense: 0 });
	});

	it('useOperations returns pages', async () => {
		const { result } = renderHook(() => useOperations(), { wrapper: createWrapper() });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data?.pages).toHaveLength(1);
	});

	it('useOperations accepts filter params', async () => {
		const { result } = renderHook(() => useOperations({ direction: 'incoming' }), {
			wrapper: createWrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data?.pages[0]).toEqual({ items: [], total: 0 });
	});

	it('useOperation returns data for a given id', async () => {
		const { result } = renderHook(() => useOperation('op_1'), { wrapper: createWrapper() });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual({ id: 'op_1', amount: 100 });
	});

	it('useOperation is disabled when id is empty', () => {
		const { result } = renderHook(() => useOperation(''), { wrapper: createWrapper() });
		expect(result.current.fetchStatus).toBe('idle');
	});

	it('useAccountOperations returns pages', async () => {
		const { result } = renderHook(() => useAccountOperations('acc_1'), {
			wrapper: createWrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data?.pages[0]).toEqual({ items: [], total: 0 });
	});

	it('useAccountOperations is disabled when accountId is empty', () => {
		const { result } = renderHook(() => useAccountOperations(''), { wrapper: createWrapper() });
		expect(result.current.fetchStatus).toBe('idle');
	});

	it('useCardOperations returns pages', async () => {
		const { result } = renderHook(() => useCardOperations('card_1'), { wrapper: createWrapper() });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data?.pages[0]).toEqual({ items: [], total: 0 });
	});

	it('useCardOperations is disabled when cardId is empty', () => {
		const { result } = renderHook(() => useCardOperations(''), { wrapper: createWrapper() });
		expect(result.current.fetchStatus).toBe('idle');
	});
});
