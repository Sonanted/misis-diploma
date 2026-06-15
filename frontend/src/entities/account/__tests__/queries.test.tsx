import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/api/accounts', () => ({
	getAccounts: vi.fn(() => Promise.resolve([])),
	getAccount: vi.fn(() => Promise.resolve({ id: 'acc_1' })),
	createAccount: vi.fn(() => Promise.resolve({ id: 'acc_new' })),
	updateAccountStatus: vi.fn(() => Promise.resolve({ id: 'acc_1' })),
	topupAccount: vi.fn(() => Promise.resolve({ id: 'acc_1' })),
	setPrimaryAccount: vi.fn(() => Promise.resolve(undefined)),
	deleteAccount: vi.fn(() => Promise.resolve(undefined)),
	monthlyPayment: vi.fn(() => Promise.resolve({ id: 'acc_1' })),
}));

vi.mock('@/shared/api/config', () => ({
	getBankInfo: vi.fn(() => Promise.resolve({ bik: '044525225', name: 'Test Bank' })),
}));

vi.mock('@/entities/user/model', () => ({
	useAuthStore: vi.fn((selector: (s: { isAuthenticated: boolean }) => unknown) =>
		selector({ isAuthenticated: true }),
	),
}));

import {
	useAccount,
	useAccounts,
	useBankInfo,
	useCreateAccount,
	useDeleteAccount,
	useMonthlyPayment,
	useSetPrimaryAccount,
	useTopupAccount,
	useUpdateAccountStatus,
} from '../queries';

function createWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});
	return ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

describe('account queries', () => {
	it('useAccounts returns data', async () => {
		const { result } = renderHook(() => useAccounts(), { wrapper: createWrapper() });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual([]);
	});

	it('useAccount returns data for a given id', async () => {
		const { result } = renderHook(() => useAccount('acc_1'), { wrapper: createWrapper() });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual({ id: 'acc_1' });
	});

	it('useAccount is disabled when id is empty', () => {
		const { result } = renderHook(() => useAccount(''), { wrapper: createWrapper() });
		expect(result.current.fetchStatus).toBe('idle');
	});

	it('useCreateAccount returns mutation object', () => {
		const { result } = renderHook(() => useCreateAccount(), { wrapper: createWrapper() });
		expect(result.current.mutate).toBeTypeOf('function');
		expect(result.current.isPending).toBe(false);
	});

	it('useTopupAccount returns mutation object', () => {
		const { result } = renderHook(() => useTopupAccount(), { wrapper: createWrapper() });
		expect(result.current.mutate).toBeTypeOf('function');
	});

	it('useSetPrimaryAccount returns mutation object', () => {
		const { result } = renderHook(() => useSetPrimaryAccount(), { wrapper: createWrapper() });
		expect(result.current.mutate).toBeTypeOf('function');
	});

	it('useUpdateAccountStatus returns mutation object', () => {
		const { result } = renderHook(() => useUpdateAccountStatus(), { wrapper: createWrapper() });
		expect(result.current.mutate).toBeTypeOf('function');
	});

	it('useDeleteAccount returns mutation object', () => {
		const { result } = renderHook(() => useDeleteAccount(), { wrapper: createWrapper() });
		expect(result.current.mutate).toBeTypeOf('function');
	});

	it('useMonthlyPayment returns mutation object', () => {
		const { result } = renderHook(() => useMonthlyPayment(), { wrapper: createWrapper() });
		expect(result.current.mutate).toBeTypeOf('function');
	});

	it('useBankInfo returns data when authenticated', async () => {
		const { result } = renderHook(() => useBankInfo(), { wrapper: createWrapper() });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual({ bik: '044525225', name: 'Test Bank' });
	});

	it('useBankInfo is disabled when not authenticated', async () => {
		const { useAuthStore } = await import('@/entities/user/model');
		vi.mocked(useAuthStore).mockImplementationOnce(
			(selector: (s: { isAuthenticated: boolean }) => unknown) =>
				selector({ isAuthenticated: false }),
		);
		const { result } = renderHook(() => useBankInfo(), { wrapper: createWrapper() });
		expect(result.current.fetchStatus).toBe('idle');
	});
});
