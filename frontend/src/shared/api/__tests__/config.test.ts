import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockApiClient = vi.hoisted(() => ({
	get: vi.fn(),
}));

vi.mock('../client', () => ({ apiClient: mockApiClient }));

import { getBankInfo } from '../config';

describe('config API', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('getBankInfo calls GET /accounts/bank-info and returns data', async () => {
		const mockData = { bik: '044525225', name: 'Test Bank' };
		mockApiClient.get.mockResolvedValue({ data: mockData });
		const result = await getBankInfo();
		expect(mockApiClient.get).toHaveBeenCalledWith('/accounts/bank-info');
		expect(result).toEqual(mockData);
	});
});
