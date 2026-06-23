import { beforeEach, describe, expect, it } from 'vitest';
import { useAccountStore } from '../model';

describe('useAccountStore', () => {
	beforeEach(() => {
		useAccountStore.setState({ primaryAccountId: '1' });
	});

	it('starts with default primaryAccountId of "1"', () => {
		const { primaryAccountId } = useAccountStore.getState();
		expect(primaryAccountId).toBe('1');
	});

	it('setPrimaryAccount updates primaryAccountId', () => {
		useAccountStore.getState().setPrimaryAccount('acc_42');
		expect(useAccountStore.getState().primaryAccountId).toBe('acc_42');
	});

	it('setPrimaryAccount can be called multiple times', () => {
		useAccountStore.getState().setPrimaryAccount('acc_1');
		useAccountStore.getState().setPrimaryAccount('acc_2');
		expect(useAccountStore.getState().primaryAccountId).toBe('acc_2');
	});
});
