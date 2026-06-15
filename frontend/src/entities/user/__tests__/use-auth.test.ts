import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from '../model';
import { useAuth } from '../use-auth';

function makeJwt(expOffsetMs: number): string {
	const payload = { exp: Math.floor((Date.now() + expOffsetMs) / 1000) };
	const encoded = btoa(JSON.stringify(payload));
	return `header.${encoded}.signature`;
}

describe('useAuth', () => {
	beforeEach(() => {
		useAuthStore.setState({ isAuthenticated: false, token: null });
	});

	it('returns false when not authenticated', () => {
		const { result } = renderHook(() => useAuth());
		expect(result.current).toBe(false);
	});

	it('returns true with a valid non-expired token', () => {
		const token = makeJwt(60 * 60 * 1000); // expires in 1 hour
		useAuthStore.setState({ isAuthenticated: true, token });
		const { result } = renderHook(() => useAuth());
		expect(result.current).toBe(true);
	});

	it('returns false when token is expired', () => {
		const token = makeJwt(-5000); // expired 5 seconds ago
		useAuthStore.setState({ isAuthenticated: true, token });
		const { result } = renderHook(() => useAuth());
		expect(result.current).toBe(false);
	});

	it('calls logout when token is expired', () => {
		const token = makeJwt(-5000);
		useAuthStore.setState({ isAuthenticated: true, token });
		renderHook(() => useAuth());
		expect(useAuthStore.getState().isAuthenticated).toBe(false);
		expect(useAuthStore.getState().token).toBeNull();
	});

	it('returns false with a malformed token', () => {
		useAuthStore.setState({ isAuthenticated: true, token: 'not.a.jwt' });
		const { result } = renderHook(() => useAuth());
		expect(result.current).toBe(false);
	});

	it('returns true when token has no exp claim (treated as non-expiring)', () => {
		const payload = { sub: 'user1' }; // no exp field
		const token = `h.${btoa(JSON.stringify(payload))}.s`;
		useAuthStore.setState({ isAuthenticated: true, token });
		const { result } = renderHook(() => useAuth());
		// isTokenExpired: typeof payload.exp === 'number' → false → not expired
		expect(result.current).toBe(true);
	});
});
