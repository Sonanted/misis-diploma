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

	it('useCreateAccount calls mutationFn and onSuccess', async () => {
		const { result } = renderHook(() => useCreateAccount(), { wrapper: createWrapper() });
		result.current.mutate({ name: 'New Account', type: 'checking', currency: 'RUB' });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});

	it('useTopupAccount calls mutationFn and onSuccess', async () => {
		const { result } = renderHook(() => useTopupAccount(), { wrapper: createWrapper() });
		result.current.mutate({ id: 'acc_1', dto: { amount: 500, password: 'pass' } });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});

	it('useSetPrimaryAccount calls mutationFn and onSuccess', async () => {
		const { result } = renderHook(() => useSetPrimaryAccount(), { wrapper: createWrapper() });
		result.current.mutate('acc_1');
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});

	it('useUpdateAccountStatus calls mutationFn and onSuccess', async () => {
		const { result } = renderHook(() => useUpdateAccountStatus(), { wrapper: createWrapper() });
		result.current.mutate({ id: 'acc_1', dto: { status: 'Closed' } });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});

	it('useDeleteAccount calls mutationFn and onSuccess', async () => {
		const { result } = renderHook(() => useDeleteAccount(), { wrapper: createWrapper() });
		result.current.mutate('acc_1');
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});

	it('useMonthlyPayment calls mutationFn and onSuccess', async () => {
		const { result } = renderHook(() => useMonthlyPayment(), { wrapper: createWrapper() });
		result.current.mutate('acc_1');
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});

	it('useBankInfo returns data when authenticated', async () => {
		const { result } = renderHook(() => useBankInfo(), { wrapper: createWrapper() });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual({ bik: '044525225', name: 'Test Bank' });
	});

});
