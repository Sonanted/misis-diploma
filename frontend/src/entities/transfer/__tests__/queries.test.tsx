import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/api/transfers', () => ({
	createTransfer: vi.fn(() => Promise.resolve({ fromAccountId: 'acc_1', toAccountId: 'acc_2', amount: 500 })),
}));

vi.mock('@/entities/account/queries', () => ({
	accountKeys: { all: ['accounts'] as const },
}));

vi.mock('@/entities/operation/queries', () => ({
	operationKeys: { all: ['operations'] as const },
}));

import { useTransfer } from '../queries';

function createWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: { mutations: { retry: false } },
	});
	return ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

describe('transfer queries', () => {
	it('useTransfer returns mutation object', () => {
		const { result } = renderHook(() => useTransfer(), { wrapper: createWrapper() });
		expect(result.current.mutate).toBeTypeOf('function');
		expect(result.current.isPending).toBe(false);
	});

	it('useTransfer calls mutationFn and onSuccess', async () => {
		const { result } = renderHook(() => useTransfer(), { wrapper: createWrapper() });
		result.current.mutate({
			fromAccountId: 'acc_1',
			method: 'account',
			recipientIdentifier: 'acc_2',
			amount: 500,
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});
});
