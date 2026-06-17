import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../queries', () => ({
	useMe: vi.fn(),
}));

import { useMe } from '../queries';
import { useAuth } from '../use-auth';

describe('useAuth', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns isAuthenticated false when useMe has no data', () => {
		vi.mocked(useMe).mockReturnValue({ data: undefined, isLoading: false } as ReturnType<typeof useMe>);
		const { result } = renderHook(() => useAuth());
		expect(result.current.isAuthenticated).toBe(false);
		expect(result.current.isLoading).toBe(false);
	});

	it('returns isAuthenticated true when useMe returns user data', () => {
		vi.mocked(useMe).mockReturnValue({
			data: { id: 'usr_1', firstName: 'John' },
			isLoading: false,
		} as ReturnType<typeof useMe>);
		const { result } = renderHook(() => useAuth());
		expect(result.current.isAuthenticated).toBe(true);
	});

	it('reflects isLoading state from useMe', () => {
		vi.mocked(useMe).mockReturnValue({ data: undefined, isLoading: true } as ReturnType<typeof useMe>);
		const { result } = renderHook(() => useAuth());
		expect(result.current.isLoading).toBe(true);
	});
});
