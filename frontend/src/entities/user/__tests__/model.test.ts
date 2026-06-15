import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from '../model';

describe('useAuthStore', () => {
	beforeEach(() => {
		useAuthStore.setState({ isAuthenticated: false, token: null });
	});

	it('initial state is unauthenticated with no token', () => {
		const { isAuthenticated, token } = useAuthStore.getState();
		expect(isAuthenticated).toBe(false);
		expect(token).toBeNull();
	});

	it('login sets isAuthenticated to true and stores token', () => {
		useAuthStore.getState().login('test-token-123');
		const { isAuthenticated, token } = useAuthStore.getState();
		expect(isAuthenticated).toBe(true);
		expect(token).toBe('test-token-123');
	});

	it('logout resets isAuthenticated to false', () => {
		useAuthStore.getState().login('test-token-123');
		useAuthStore.getState().logout();
		expect(useAuthStore.getState().isAuthenticated).toBe(false);
	});

	it('logout clears token', () => {
		useAuthStore.getState().login('test-token-123');
		useAuthStore.getState().logout();
		expect(useAuthStore.getState().token).toBeNull();
	});

	it('login with different tokens stores the latest', () => {
		useAuthStore.getState().login('token-a');
		useAuthStore.getState().login('token-b');
		expect(useAuthStore.getState().token).toBe('token-b');
	});
});
