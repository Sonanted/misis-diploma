import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/api/auth', () => ({
	signin: vi.fn(() => Promise.resolve(undefined)),
	signup: vi.fn(() => Promise.resolve(undefined)),
	logout: vi.fn(() => Promise.resolve(undefined)),
}));

vi.mock('@/shared/api/users', () => ({
	getMe: vi.fn(() => Promise.resolve({ id: 'usr_1', firstName: 'John' })),
	updateMe: vi.fn(() => Promise.resolve({ id: 'usr_1' })),
	changePassword: vi.fn(() => Promise.resolve(undefined)),
}));

import {
	useChangePassword,
	useLogout,
	useMe,
	useSignin,
	useSignup,
	useUpdateMe,
} from '../queries';

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

	it('useSignin calls mutationFn and onSuccess', async () => {
		const { result } = renderHook(() => useSignin(), { wrapper: createWrapper() });
		result.current.mutate({ phone: '+79001234567', password: 'pass' });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});

	it('useSignup calls mutationFn and onSuccess', async () => {
		const { result } = renderHook(() => useSignup(), { wrapper: createWrapper() });
		result.current.mutate({
			firstName: 'John',
			lastName: 'Doe',
			phone: '+79001234567',
			email: 'john@example.com',
			password: 'pass',
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});

	it('useLogout returns mutation object', () => {
		const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() });
		expect(result.current.mutate).toBeTypeOf('function');
		expect(result.current.isPending).toBe(false);
	});

	it('useLogout calls mutationFn and onSuccess', async () => {
		const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() });
		result.current.mutate();
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});

	it('useUpdateMe calls mutationFn and onSuccess', async () => {
		const { result } = renderHook(() => useUpdateMe(), { wrapper: createWrapper() });
		result.current.mutate({ firstName: 'Jane' });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});

	it('useChangePassword calls mutationFn and succeeds', async () => {
		const { result } = renderHook(() => useChangePassword(), { wrapper: createWrapper() });
		result.current.mutate({ oldPassword: 'old', newPassword: 'new' });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});
});
