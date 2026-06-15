import { beforeEach, describe, expect, it } from 'vitest';
import { usePrivacyStore } from '../model';

describe('usePrivacyStore', () => {
	beforeEach(() => {
		usePrivacyStore.setState({ balanceVisible: true });
	});

	it('starts with balance visible', () => {
		expect(usePrivacyStore.getState().balanceVisible).toBe(true);
	});

	it('toggle hides the balance', () => {
		usePrivacyStore.getState().toggle();
		expect(usePrivacyStore.getState().balanceVisible).toBe(false);
	});

	it('toggle twice restores visibility', () => {
		usePrivacyStore.getState().toggle();
		usePrivacyStore.getState().toggle();
		expect(usePrivacyStore.getState().balanceVisible).toBe(true);
	});

	it('multiple toggles alternate correctly', () => {
		for (let i = 0; i < 5; i++) {
			usePrivacyStore.getState().toggle();
		}
		// 5 toggles from true → false
		expect(usePrivacyStore.getState().balanceVisible).toBe(false);
	});

	it('toggle from hidden state shows balance', () => {
		usePrivacyStore.setState({ balanceVisible: false });
		usePrivacyStore.getState().toggle();
		expect(usePrivacyStore.getState().balanceVisible).toBe(true);
	});
});
