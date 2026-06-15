import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/api/auth', () => ({
	signin: vi.fn(() => Promise.resolve({ access_token: 'token' })),
	signup: vi.fn(() => Promise.resolve({ access_token: 'token' })),
}));

vi.mock('@/shared/api/users', () => ({
	getMe: vi.fn(() => Promise.resolve({ id: 'usr_1', firstName: 'John' })),
	updateMe: vi.fn(() => Promise.resolve({ id: 'usr_1' })),
	changePassword: vi.fn(() => Promise.resolve(undefined)),
}));

vi.mock('@/entities/user/model', () => ({
	useAuthStore: vi.fn((selector: (s: { isAuthenticated: boolean; login: () => void }) => unknown) =>
		selector({ isAuthenticated: true, login: vi.fn() }),
	),
}));

import { useChangePassword, useMe, useSignin, useSignup, useUpdateMe } from '../queries';

function createWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});
	return ({ children }: { children: ReactNode }) => (
		<MemoryRouter>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</MemoryRouter>
	);
}

describe('user queries', () => {
	it('useMe returns data when authenticated', async () => {
		const { result } = renderHook(() => useMe(), { wrapper: createWrapper() });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual({ id: 'usr_1', firstName: 'John' });
	});

	it('useMe is disabled when not authenticated', async () => {
		const { useAuthStore } = await import('@/entities/user/model');
		vi.mocked(useAuthStore).mockImplementationOnce(
			(selector: (s: { isAuthenticated: boolean; login: () => void }) => unknown) =>
				selector({ isAuthenticated: false, login: vi.fn() }),
		);
		const { result } = renderHook(() => useMe(), { wrapper: createWrapper() });
		expect(result.current.fetchStatus).toBe('idle');
	});

	it('useSignin returns mutation object', () => {
		const { result } = renderHook(() => useSignin(), { wrapper: createWrapper() });
		expect(result.current.mutate).toBeTypeOf('function');
		expect(result.current.isPending).toBe(false);
	});

	it('useSignup returns mutation object', () => {
		const { result } = renderHook(() => useSignup(), { wrapper: createWrapper() });
		expect(result.current.mutate).toBeTypeOf('function');
	});

	it('useUpdateMe returns mutation object', () => {
		const { result } = renderHook(() => useUpdateMe(), { wrapper: createWrapper() });
		expect(result.current.mutate).toBeTypeOf('function');
	});

	it('useChangePassword returns mutation object', () => {
		const { result } = renderHook(() => useChangePassword(), { wrapper: createWrapper() });
		expect(result.current.mutate).toBeTypeOf('function');
	});
});
