import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockApiClient = vi.hoisted(() => ({
	get: vi.fn(),
	post: vi.fn(),
	patch: vi.fn(),
	delete: vi.fn(),
}));

vi.mock('../client', () => ({ apiClient: mockApiClient }));

import {
	createAccount,
	deleteAccount,
	getAccount,
	getAccounts,
	monthlyPayment,
	setPrimaryAccount,
	topupAccount,
	updateAccountName,
	updateAccountStatus,
} from '../accounts';

describe('accounts API', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('getAccounts calls GET /accounts and returns data', async () => {
		const mockData = [{ id: 'acc_1', name: 'Main' }];
		mockApiClient.get.mockResolvedValue({ data: mockData });
		const result = await getAccounts();
		expect(mockApiClient.get).toHaveBeenCalledWith('/accounts');
		expect(result).toEqual(mockData);
	});

	it('getAccount calls GET /accounts/:id and returns data', async () => {
		const mockData = { id: 'acc_1', name: 'Main' };
		mockApiClient.get.mockResolvedValue({ data: mockData });
		const result = await getAccount('acc_1');
		expect(mockApiClient.get).toHaveBeenCalledWith('/accounts/acc_1');
		expect(result).toEqual(mockData);
	});

	it('createAccount calls POST /accounts and returns data', async () => {
		const dto = { name: 'New', type: 'Checking' as const, currency: 'RUB' as const };
		const mockData = { id: 'acc_2', ...dto };
		mockApiClient.post.mockResolvedValue({ data: mockData });
		const result = await createAccount(dto);
		expect(mockApiClient.post).toHaveBeenCalledWith('/accounts', dto);
		expect(result).toEqual(mockData);
	});

	it('updateAccountName calls PATCH /accounts/:id/name and returns data', async () => {
		const dto = { name: 'Updated' };
		const mockData = { id: 'acc_1', name: 'Updated' };
		mockApiClient.patch.mockResolvedValue({ data: mockData });
		const result = await updateAccountName('acc_1', dto);
		expect(mockApiClient.patch).toHaveBeenCalledWith('/accounts/acc_1/name', dto);
		expect(result).toEqual(mockData);
	});

	it('updateAccountStatus calls PATCH /accounts/:id/status and returns data', async () => {
		const dto = { status: 'Frozen' as const };
		const mockData = { id: 'acc_1', status: 'Frozen' };
		mockApiClient.patch.mockResolvedValue({ data: mockData });
		const result = await updateAccountStatus('acc_1', dto);
		expect(mockApiClient.patch).toHaveBeenCalledWith('/accounts/acc_1/status', dto);
		expect(result).toEqual(mockData);
	});

	it('topupAccount calls POST /accounts/:id/topup and returns data', async () => {
		const dto = { amount: 1000, password: 'pass' };
		const mockData = { id: 'acc_1', balance: 1000 };
		mockApiClient.post.mockResolvedValue({ data: mockData });
		const result = await topupAccount('acc_1', dto);
		expect(mockApiClient.post).toHaveBeenCalledWith('/accounts/acc_1/topup', dto);
		expect(result).toEqual(mockData);
	});

	it('setPrimaryAccount calls PATCH /accounts/:id/primary and returns undefined', async () => {
		mockApiClient.patch.mockResolvedValue({});
		const result = await setPrimaryAccount('acc_1');
		expect(mockApiClient.patch).toHaveBeenCalledWith('/accounts/acc_1/primary');
		expect(result).toBeUndefined();
	});

	it('deleteAccount calls DELETE /accounts/:id and returns undefined', async () => {
		mockApiClient.delete.mockResolvedValue({});
		const result = await deleteAccount('acc_1');
		expect(mockApiClient.delete).toHaveBeenCalledWith('/accounts/acc_1');
		expect(result).toBeUndefined();
	});

	it('monthlyPayment calls POST /accounts/:id/monthly-payment and returns data', async () => {
		const mockData = { id: 'acc_1', balance: 500 };
		mockApiClient.post.mockResolvedValue({ data: mockData });
		const result = await monthlyPayment('acc_1');
		expect(mockApiClient.post).toHaveBeenCalledWith('/accounts/acc_1/monthly-payment');
		expect(result).toEqual(mockData);
	});
});
