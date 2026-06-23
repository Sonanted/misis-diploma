import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/api/cards', () => ({
	getCards: vi.fn(() => Promise.resolve([])),
	getCard: vi.fn(() => Promise.resolve({ id: 'card_1', name: 'Test Card' })),
	createCard: vi.fn(() => Promise.resolve({ id: 'card_new' })),
	updateCardStatus: vi.fn(() => Promise.resolve({ id: 'card_1' })),
	changeCardPin: vi.fn(() => Promise.resolve(undefined)),
	revealCard: vi.fn(() => Promise.resolve({ fullNumber: '4111111111111234', cvv: '123' })),
	getCardPin: vi.fn(() => Promise.resolve({ pin: '1234' })),
}));

import {
	useCard,
	useCardPin,
	useCards,
	useChangeCardPin,
	useCreateCard,
	useRevealCard,
	useUpdateCardStatus,
} from '../queries';

function createWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});
	return ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

describe('card queries', () => {
	it('useCards returns data', async () => {
		const { result } = renderHook(() => useCards(), { wrapper: createWrapper() });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual([]);
	});

	it('useCard returns data for a given id', async () => {
		const { result } = renderHook(() => useCard('card_1'), { wrapper: createWrapper() });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual({ id: 'card_1', name: 'Test Card' });
	});

	it('useCard is disabled when id is empty', () => {
		const { result } = renderHook(() => useCard(''), { wrapper: createWrapper() });
		expect(result.current.fetchStatus).toBe('idle');
	});

	it('useCreateCard calls mutationFn and onSuccess', async () => {
		const { result } = renderHook(() => useCreateCard(), { wrapper: createWrapper() });
		result.current.mutate({ name: 'New Card', accountId: 'acc_1' });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});

	it('useUpdateCardStatus calls mutationFn and onSuccess', async () => {
		const { result } = renderHook(() => useUpdateCardStatus(), { wrapper: createWrapper() });
		result.current.mutate({ id: 'card_1', dto: { status: 'Locked' as const } });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});

	it('useChangeCardPin calls mutationFn and onSuccess', async () => {
		const { result } = renderHook(() => useChangeCardPin(), { wrapper: createWrapper() });
		result.current.mutate({ id: 'card_1', dto: { pin: '4321' } });
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
	});

	it('useRevealCard returns data when enabled', async () => {
		const { result } = renderHook(() => useRevealCard('card_1', true), {
			wrapper: createWrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual({ fullNumber: '4111111111111234', cvv: '123' });
	});

	it('useRevealCard is disabled when enabled=false', () => {
		const { result } = renderHook(() => useRevealCard('card_1', false), {
			wrapper: createWrapper(),
		});
		expect(result.current.fetchStatus).toBe('idle');
	});

	it('useRevealCard is disabled when id is empty', () => {
		const { result } = renderHook(() => useRevealCard('', true), { wrapper: createWrapper() });
		expect(result.current.fetchStatus).toBe('idle');
	});

	it('useCardPin returns data when enabled', async () => {
		const { result } = renderHook(() => useCardPin('card_1', true), {
			wrapper: createWrapper(),
		});
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual({ pin: '1234' });
	});

	it('useCardPin is disabled when enabled=false', () => {
		const { result } = renderHook(() => useCardPin('card_1', false), {
			wrapper: createWrapper(),
		});
		expect(result.current.fetchStatus).toBe('idle');
	});
});
