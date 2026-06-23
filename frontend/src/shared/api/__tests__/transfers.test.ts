import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockApiClient = vi.hoisted(() => ({
	post: vi.fn(),
}));

vi.mock('../client', () => ({ apiClient: mockApiClient }));

import { createTransfer, resolveDestinationCurrency } from '../transfers';

describe('transfers API', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('createTransfer calls POST /transfers and returns data', async () => {
		const dto = {
			fromAccountId: 'acc_1',
			method: 'account' as const,
			recipientIdentifier: 'acc_2',
			amount: 1000,
			description: 'Test transfer',
		};
		const mockData = { fromAccountId: 'acc_1', toAccountId: 'acc_2', amount: 1000 };
		mockApiClient.post.mockResolvedValue({ data: mockData });
		const result = await createTransfer(dto);
		expect(mockApiClient.post).toHaveBeenCalledWith('/transfers', dto);
		expect(result).toEqual(mockData);
	});

	it('createTransfer works without optional description', async () => {
		const dto = {
			fromAccountId: 'acc_1',
			method: 'phone' as const,
			recipientIdentifier: '+79001234567',
			amount: 500,
		};
		const mockData = { fromAccountId: 'acc_1', toAccountId: 'acc_2', amount: 500 };
		mockApiClient.post.mockResolvedValue({ data: mockData });
		await createTransfer(dto);
		expect(mockApiClient.post).toHaveBeenCalledWith('/transfers', dto);
	});

	it('resolveDestinationCurrency calls POST /transfers/resolve-destination and returns data', async () => {
		const dto = { method: 'phone' as const, recipientIdentifier: '+79001234567' };
		const mockData = { toCurrency: 'USD' };
		mockApiClient.post.mockResolvedValue({ data: mockData });
		const result = await resolveDestinationCurrency(dto);
		expect(mockApiClient.post).toHaveBeenCalledWith('/transfers/resolve-destination', dto);
		expect(result).toEqual(mockData);
	});
});
